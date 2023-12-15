const multer = require('multer');
const path = require('path');

const filename = (req, file, callback) => {
    console.log(file)
    const fileName = Date.now() + '-' + file.originalname;
    callback(null, fileName)
};

const generateStore = (destination) => {
    return multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, destination)
        },
        filename
    })
}

const allowedLogoTypes = ['image/png', 'image/jpg', 'image/jpeg'];
const allowedThumbnailTypes = ['image/png', 'image/jpg', 'image/jpeg'];
const allowedAvatarTypes = ['image/png', 'image/jpg', 'image/jpeg'];

module.exports = {
    logo: multer({
        storage: generateStore('./public/images'),
        fileFilter: (req, file, callback) => {
            if (allowedLogoTypes.includes(file.mimetype)) {
                callback(null, true);
            } else {
                const err = new Error(`Only ${allowedLogoTypes.join(', ')} are allowed to upload`);
                callback(err);
            }
        },
        onError: (err, next) => {
            next(err);
        },
    }),

    thumbnail: multer({
        storage: generateStore('./public/images'),
        fileFilter: (req, file, callback) => {
            if (allowedThumbnailTypes.includes(file.mimetype)) {
                callback(null, true);
            } else {
                const err = new Error(`Only ${allowedThumbnailTypes.join(', ')} are allowed to upload`);
                callback(err);
            }
        },
        onError: (err, next) => {
            next(err);
        },
    }),

    avatar: multer({
        storage: generateStore('./public/images'),
        fileFilter: (req, file, callback) => {
            if (allowedAvatarTypes.includes(file.mimetype)) {
                callback(null, true);
            } else {
                const err = new Error(`Only ${allowedAvatarTypes.join(', ')} are allowed to upload`);
                callback(err);
            }
        },
        onError: (err, next) => {
            next(err);
        },
    }),
};