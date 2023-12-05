const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios");
require("dotenv").config();

const apiKey = process.env.XENDIT_API_KEY;
const xenditApiUrl = "https://api.xendit.co/v2/invoices";

module.exports = {
	createOrder: async (req, res) => {
		try {
			const { course_id, user_id, payment_method_id } = req.body;

			// Check if the user has already purchased the course
			const existingOrder = await prisma.order.findFirst({
				where: {
					course_id: parseInt(course_id),
					user_id: parseInt(user_id),
					status: "paid",
				},
			});

			if (existingOrder) {
				return res.status(400).json({ error: "User has already purchased this course" });
			}

			// Retrieve course details, user details, and calculate total price
			const orderDetails = await prisma.order.create({
				include: {
					user: true,
				},
				data: {
					course: {
						connect: {
							id: parseInt(course_id),
						},
					},
					user: {
						connect: {
							id: parseInt(user_id),
						},
					},
					payment_method: {
						connect: {
							id: parseInt(payment_method_id),
						},
					},
					reference: generateOrderReference(),
				},
			});

			// Retrieve course details and calculate total price
			const course = await prisma.course.findUnique({
				where: { id: course_id },
			});

			const amount = course.price;

			// Call Xendit API to create a payment link
			const xenditResponse = await createXenditInvoice(
				orderDetails.reference,
				orderDetails.user.email, // Accessing the username from the related user
				amount
			);

			// Assuming Xendit response contains a payment link and callback URL
			const paymentLink = xenditResponse.invoice_url;
			const callbackUrl = xenditResponse.callback_virtual_account_created;

			await prisma.order.update({
				where: { id: orderDetails.id },
				data: { status: "paid" },
			});

			res.status(201).json({ order: orderDetails, paymentLink, callbackUrl });
		} catch (error) {
			console.error("Error creating order:", error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	},
};

// Helper function to generate a unique order reference
const generateOrderReference = () => {
	// Implement your logic to generate a unique reference
	// This can be a combination of date, course ID, user ID, etc.
	return `ORDER_${Date.now()}`;
};

// Helper function to create an invoice using Xendit API
const createXenditInvoice = async (reference, email, amount) => {
	// Implement the logic to call the Xendit API to create an invoice
	// You will need your Xendit API key and appropriate Xendit API endpoints

	const authHeader = `Basic ${Buffer.from(apiKey + ":").toString("base64")}`;

	const response = await axios.post(
		xenditApiUrl,
		{
			external_id: reference,
			amount,
			payer_email: email, // Change this to the user's email
			description: "Course Payment",
		},
		{
			headers: {
				Authorization: authHeader,
			},
		}
	);

	return response.data;
};
