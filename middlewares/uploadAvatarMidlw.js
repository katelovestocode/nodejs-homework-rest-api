const multer = require("multer");
const path = require("path");

const tempDir = path.join(__dirname, "../", "temp");

// middleware that helps to save a file/image into a temp folder
const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadAvatarMidlw = multer({
  storage: multerConfig,
});

module.exports = uploadAvatarMidlw;
