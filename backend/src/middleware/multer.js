import multer from 'multer'

const storage = multer.memoryStorage();
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!allowedImageTypes.has(file.mimetype)) {
      return callback(new Error("Only image files are allowed."));
    }
    callback(null, true);
  },
}).single("file");

export const singleUpload = (req, res, next) => {
  upload(req, res, (error) => {
    if (error) {
      const isSizeLimit = error instanceof multer.MulterError &&
        error.code === "LIMIT_FILE_SIZE";
      return res.status(isSizeLimit ? 413 : 400).json({
        success: false,
        message: isSizeLimit
          ? "Image must be 5 MB or smaller."
          : error.message,
      });
    }
    next();
  });
};
