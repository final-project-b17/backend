const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios");
const { orders } = require("../models");
require("dotenv").config();

const apiKey = process.env.XENDIT_API_KEY;
const xenditApiUrl = "https://api.xendit.co/v2/invoices";
const callbackUrl = process.env.XENDIT_CALLBACK_URL;

// Helper function to generate a unique order reference
const generateOrderReference = () => {
	return `ORDER_${Date.now()}`;
};

// Helper function to create an invoice using Xendit API
const createXenditInvoice = async (reference, email, amount, callbackUrl) => {
	const authHeader = `Basic ${Buffer.from(apiKey + ":").toString("base64")}`;

	const response = await axios.post(
		xenditApiUrl,
		{
			external_id: reference,
			amount,
			payer_email: email,
			description: "Course Payment",
			callback_virtual_account_created: callbackUrl,
		},
		{
			headers: {
				Authorization: authHeader,
			},
		}
	);

	return response.data;
};

const orderController = {
	// Get recent transactions course
	myOrder: async (req, res) => {
		try {
			const userId = req.user.id;
			const data = await orders.findMany({
				where: {
					user_id: userId,
				},
			});

			return res.status(200).json({
				success: true,
				myOrder: data,
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
				error: "Internal Server Error",
			});
		}
	},

	// Handle to create payments
	createOrder: async (req, res) => {
		try {
			const userId = req.user.id;
			const { course_id } = req.body;

			// Cek apakah user sudeh pernah membeli course ini dan statusnya paid
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

			// Check if there is an existing pending order
			const existingOrderPending = await prisma.order.findFirst({
				where: {
					course_id: parseInt(course_id),
					user_id: parseInt(userId),
					status: "pending",
				},
				include: {
					user: true,
					course: true,
				},
			});

			let orderDetails;

			if (existingOrderPending) {
				const newPaymentLink = await createXenditInvoice(existingOrderPending.reference, existingOrderPending.user.email, existingOrderPending.course.price);

				orderDetails = {
					...existingOrderPending,
					paymentLink: newPaymentLink.invoice_url,
				};

				return res.status(200).json(orderDetails);
			} else {
				// No existing pending order, create a new order
				const course = await prisma.course.findUnique({
					where: { id: parseInt(course_id) },
				});

				if (!course) {
					return res.status(404).json({ error: "Course not found" });
				}

				orderDetails = await prisma.order.create({
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
						status: "pending",
					},
				});
			}

			const amount = course.price;
			const xenditResponse = await createXenditInvoice(orderDetails.reference, orderDetails.user.email, amount, callbackUrl);
			const paymentStatus = xenditResponse.status;

			if (paymentStatus === "COMPLETED") {
				await prisma.order.update({
					where: { id: orderDetails.id },
					data: { status: "paid" },
				});
			}

			const paymentLink = xenditResponse.invoice_url;
			const xenditCallbackUrl = xenditResponse.callback_virtual_account_created;

			res.status(201).json({ order: orderDetails, paymentLink, xenditCallbackUrl });
		} catch (error) {
			console.error("Error creating order:", error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	},

	// Handle Callback from xendit
	xenditCallback: async (req, res) => {
		try {
			const { external_id, status } = req.body;

			const statusOrder = await orders.findFirst({
				where: {
					reference: external_id,
					status: "pending",
				},
			});

			await orders.update({
				data: {
					status: "paid",
				},
				where: {
					id: statusOrder.id,
				},
			});

			return res.status(200).send("Success to update with status: " + status);
		} catch (error) {
			console.error("Error processing Xendit callback:", error);
			return res.status(500).send("Internal Server Error");
		}
	},
};

module.exports = orderController;
