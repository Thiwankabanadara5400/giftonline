import express from 'express';
import { upload } from '../middleware/upload.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Upload single image
router.post('/upload', verifyToken, upload.single('image'), (req, res) => {
  try {
    if (!req.user || (req.user.role !== 'admin' && req.user.is_admin !== true)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Return the file path that can be used to access the image
    const imagePath = `/uploads/products/${req.file.filename}`;

    res.json({
      message: 'Image uploaded successfully',
      imageUrl: imagePath,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
});

// Upload multiple images
router.post('/upload-multiple', verifyToken, upload.array('images', 5), (req, res) => {
  try {
    if (!req.user || (req.user.role !== 'admin' && req.user.is_admin !== true)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedFiles = req.files.map(file => ({
      imageUrl: `/uploads/products/${file.filename}`,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size
    }));

    res.json({
      message: 'Images uploaded successfully',
      images: uploadedFiles
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
});

export default router;
