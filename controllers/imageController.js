// controllers/imageController.js
const multer = require('multer');
const path = require('path');

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the upload directory
    },
    filename: (req, file, cb) => {
        // Generate a unique filename using the current timestamp and original file extension
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, uniqueSuffix);
    },
});

const upload = multer({ storage });

exports.uploadImage = upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: '이미지가 필요합니다.' });
    }

    // Generate the image URL
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
};
