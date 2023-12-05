const jwt = require("jsonwebtoken");
const secret_key = process.env.JWT_KEY || "no_secret";

const authenticateUser = (req, res, next) => {
	let token = req.headers.authorization;

	if (!token) {
		return res.status(403).json({
			error: "Please provide a token!",
		});
	}

	if (token.toLowerCase().startsWith("bearer")) {
		token = token.slice("bearer".length).trim();
	}

	try {
		const jwtPayload = jwt.verify(token, secret_key, { algorithms: ["HS256"] });
		req.user = jwtPayload; // Fix: set req.user instead of res.user
		next();
	} catch (error) {
		console.error(error); // Log the error for debugging
		return res.status(403).json({
			error: "Invalid signature",
		});
	}
};

module.exports = authenticateUser;
