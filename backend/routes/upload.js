const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const { verifyToken } = require('./auth');
const router  = express.Router();

const CLOUD_NAME   = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY      = process.env.CLOUDINARY_API_KEY;
const API_SECRET   = process.env.CLOUDINARY_API_SECRET;
const useCloudinary = !!(CLOUD_NAME && API_KEY && API_SECRET);

let upload;

if (useCloudinary) {
  // ── Cloudinary Storage (permanent, survives redeploys) ─────────────────────
  const cloudinary = require('cloudinary').v2;
  const { CloudinaryStorage } = require('multer-storage-cloudinary');

  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key:    API_KEY,
    api_secret: API_SECRET
  });

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder:         'mangalam-travel',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }]
    }
  });

  upload = multer({ storage, limits: { fileSize: 15 * 1024 * 1024 } });
  console.log('☁️  Image uploads: Cloudinary storage active');
} else {
  // ── Local Disk Fallback (dev / no Cloudinary configured) ──────────────────
  const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename:    (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e5);
      cb(null, unique + path.extname(file.originalname).toLowerCase());
    }
  });

  const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/;
    if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  };

  upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter });
  console.log('💾  Image uploads: Local disk storage (set CLOUDINARY_* env vars for permanent storage)');
}

// POST /api/upload — protected
router.post('/', verifyToken, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  // Cloudinary returns req.file.path as the full CDN URL
  // Local disk returns just the filename — build the full URL
  const url = useCloudinary
    ? req.file.path
    : `/uploads/${req.file.filename}`;

  res.json({ url, filename: req.file.filename || req.file.public_id });
});

module.exports = router;
