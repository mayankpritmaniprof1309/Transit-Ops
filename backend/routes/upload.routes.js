import express from 'express';
import upload from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * @desc    Upload an image
 * @route   POST /api/upload
 * @access  Private
 */
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  // Construct the full URL for the uploaded file
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.status(200).json({
    success: true,
    message: 'File uploaded successfully',
    url: fileUrl,
  });
});

export default router;
