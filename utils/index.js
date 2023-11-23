const bcrypt = require("bcrypt");

const cryptPassword = async (password) => {
	try {
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, salt);
		const cleanedHash = hashedPassword.replace(/[./]/g, "");
		return cleanedHash;
	} catch (error) {
		console.error("Hashing password:", error);
		throw error;
	}
};

module.exports = {
	cryptPassword,
};
