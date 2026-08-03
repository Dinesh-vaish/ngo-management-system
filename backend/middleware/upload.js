'use strict';
const multer = require('multer');
const path   = require('path');
const { v4: uuidv4 } = require('uuid');

const ALLOWED_TYPES = /jpeg|jpg|png|pdf/;
const MAX_SIZE      = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5 MB

function buildStorage(subfolder) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, path.join(__dirname, '..', 'uploads', subfolder));
    },
    filename: (_req, file, cb) => {
      const ext      = path.extname(file.originalname).toLowerCase();
      const unique   = `${uuidv4()}${ext}`;
      cb(null, unique);
    },
  });
}

function fileFilter(_req, file, cb) {
  const ext  = path.extname(file.originalname).toLowerCase().replace('.', '');
  const mime = file.mimetype;
  if (ALLOWED_TYPES.test(ext) && ALLOWED_TYPES.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG, and PDF files are allowed.'));
  }
}

exports.uploadBanner = multer({
  storage  : buildStorage('banners'),
  fileFilter,
  limits   : { fileSize: MAX_SIZE },
}).single('banner_image');

exports.uploadItem = multer({
  storage  : buildStorage('items'),
  fileFilter,
  limits   : { fileSize: MAX_SIZE },
}).single('item_image');
