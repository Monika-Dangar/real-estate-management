import multer from 'multer';
import path from 'path';

// Multer storage engine
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    }
});

// File filter (accept images and general videos)
const checkFileType = (file, cb) => {
    const filetypes = /jpeg|jpg|png|mp4|mkv|avi/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images and Videos Only!');
    }
};

// Initialize upload middleware
export const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});
