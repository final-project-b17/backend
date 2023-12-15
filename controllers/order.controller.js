const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios");
require("dotenv").config();

const apiKey = process.env.XENDIT_API_KEY;
const xenditApiUrl = "https://api.xendit.co/v2/invoices";

module.exports = {
	createOrder: async (req, res) => {
		try {
			const userId = req.user.id;
			const { course_id } = req.body;

			// Check if the user has already purchased the course
			const existingOrder = await prisma.order.findFirst({
				where: {
					course_id: parseInt(course_id),
					user_id: parseInt(userId),
					status: "paid",
				},
			});

			if (existingOrder) {
				return res.status(400).json({ error: "User has already purchased this course" });
			}

			// Retrieve course details
			const course = await prisma.course.findUnique({
				where: { id: parseInt(course_id) },
			});

			if (!course) {
				return res.status(404).json({ error: "Course not found" });
			}

			// Check if the course is free
			if (course.type_course == "free") {
				// If the course is free, mark the order as paid without creating a payment link
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
								id: parseInt(userId),
							},
						},
						status: "paid", // Mark the order as paid for free courses
						reference: generateOrderReference(),
					},
				});

				return res.status(201).json({ order: orderDetails, message: "Free course order created successfully" });
			}

			// For premium courses, continue with the payment process
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
							id: parseInt(userId),
						},
					},
					reference: generateOrderReference(),
					status: "paid", // Set the initial status as paid
				},
			});

			const amount = course.price;

			// Call Xendit API to create a payment link
			const xenditResponse = await createXenditInvoice(orderDetails.reference, orderDetails.user.email, amount);

			// Assuming Xendit response contains a payment status and other details
			const paymentStatus = xenditResponse.status;

			if (paymentStatus === "paid") {
				// If payment is successful, update the order status to "paid"
				await prisma.order.update({
					where: { id: orderDetails.id },
					data: { status: "paid" },
				});
			}

			// Assuming Xendit response contains a payment link and callback URL
			const paymentLink = xenditResponse.invoice_url;
			const callbackUrl = xenditResponse.callback_virtual_account_created;

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
