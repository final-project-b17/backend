const bcrypt = require("bcrypt"),
	ImageKit = require('imagekit');

const cryptPassword = async (password) => {
	const salt = await bcrypt.genSalt(13);

	return bcrypt.hash(password, salt);
};

const imageKit = new ImageKit({
	publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
	privateKey: process.env.IMAGEKIT_SECRET_KEY,
	urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

module.exports = {
	cryptPassword,
	ImageKit: imageKit,
};
