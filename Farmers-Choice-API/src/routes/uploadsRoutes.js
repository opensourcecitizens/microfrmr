const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});

const upload = multer({ storage });
const uploadController = require('../controllers/uploadController');

router.post('/', upload.single('file'), uploadController.uploadHandler);

module.exports = router;
