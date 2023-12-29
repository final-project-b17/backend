const { users } = require("../models");
const jwt = require("jsonwebtoken");
const secret_key = process.env.JWT_KEY || "no_secret";

const authenticateUser = async (req, res, next) => {
	let token = req.headers.authorization;

	// Check fill token
	if (!token) {
		return res.status(403).json({
			error: "Please provide a token!",
		});
	}

	// Check if token with Bearer value
	if (token.toLowerCase().startsWith("bearer")) {
		token = token.slice("bearer".length).trim();
	}

	try {
		const jwtPayload = jwt.verify(token, secret_key, { algorithms: ["HS256"] });

		// Check if the user is verified
		const user = await users.findUnique({
			where: {
				id: jwtPayload.id,
			},
		});

		if (!user || !user.is_verified) {
			return res.status(403).json({
				error: "Please verify your email first!",
			});
		}

		req.user = jwtPayload;
		next();
	} catch (error) {
		console.error(error);
		return res.status(403).json({
			error: "Invalid signature",
		});
	}
};

module.exports = authenticateUser;
