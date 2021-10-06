const multer = require("multer");

const whitelist = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];

exports.storeImg = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 5,
    fileSize: 10 * 1000 * 1000, // 10 MB
  },
  fileFilter: (_, file, cb) => {
    validateImages(file, cb);
  }
});

const validateImages = (file, cb) => {
    if(!whitelist.includes(file.mimetype)) {
        return cb(new Error('Unsupported file format'), false);
    } 

    cb(null, true);
}
