import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { authenticate } from "../../middleware/auth.js";
import { catchAsync } from "../../utils/catchAsync.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, "../../../uploads");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp)$/i;
    cb(null, allowed.test(path.extname(file.originalname)));
  },
});

const router = Router();

router.post(
  "/",
  authenticate,
  upload.single("file"),
  catchAsync((req, res) => {
    if (!req.file) {
      res.status(400).json({ message: "No file provided" });
      return;
    }
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
  }),
);

export default router;
