const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const uploadHandler = (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  // Move multer temp file to uploads (multer will already have placed it there if configured)
  const filePath = `/uploads/${req.file.filename}`;
  res.json({ url: filePath });
};

module.exports = { uploadHandler };
