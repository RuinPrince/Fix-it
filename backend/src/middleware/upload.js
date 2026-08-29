// ============================================
// Fix It — File Upload Middleware (Multer)
// ============================================
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Store files locally (Firebase Storage upload happens in the service layer)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

// File filter — only allow images
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/heic',
    'image/heif',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only images are allowed.`), false);
  }
};

/**
 * Upload middleware for complaint images
 * Accepts up to 5 images, max 10MB each
 */
export const uploadImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    files: parseInt(process.env.MAX_FILES_PER_COMPLAINT) || 5,
  },
}).array('images', 5);

/**
 * Upload middleware for single avatar image
 */
export const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
  },
}).single('avatar');

/**
 * Upload middleware for chat images
 */
export const uploadChatImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
  },
}).single('image');

export default { uploadImages, uploadAvatar, uploadChatImage };
