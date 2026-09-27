// src/middleware/multerS3.ts

import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import fs from "fs";
import { s3 } from "../config/s3";

// Local disk fallback storage (used when AWS is not configured)
const localDiskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

/**
 * S3 Upload Factory
 *
 * Hinglish: Ye function ek multer instance return karta hai jo
 * files directly AWS S3 pe upload karta hai.
 *
 * Lazy initialization: Ye tab chalega jab actual request aayegi —
 * startup pe nahi. Isse AWS env vars missing hone pe crash nahi hoga.
 */
const createS3Upload = (
  folder: string,
  allowedMimeTypes?: string[],
  fileSize: number = 1024 * 1024 * 5,
) => {
  return multer({
    storage: multerS3({
      s3,

      bucket: process.env.AWS_BUCKET_NAME!,

      contentType: multerS3.AUTO_CONTENT_TYPE,

      key: (req: any, file: any, cb: any) => {
        const uniqueName = `${folder}/${Date.now()}${path.extname(file.originalname)}`;

        cb(null, uniqueName);
      },
    }),

    limits: {
      fileSize,
    },

    fileFilter: (req, file, cb) => {
      if (!allowedMimeTypes || allowedMimeTypes.length === 0) {
        return cb(null, true);
      }

      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file format"));
      }
    },
  });
};

export default createS3Upload;

/**
 * Pre-configured upload instances (lazily created on first request)
 * AWS_BUCKET_NAME env var zaroor set karo production mein
 */
export const avatarUpload = {
  single: (fieldName: string) => (req: any, res: any, next: any) => {
    if (!process.env.AWS_BUCKET_NAME) {
      // AWS not configured — fall back to local disk so multipart body is still parsed
      return multer({ storage: localDiskStorage }).single(fieldName)(req, res, next);
    }
    return createS3Upload("users/avatar", [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ]).single(fieldName)(req, res, next);
  },
};

