// src/middleware/multerS3.ts

import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import { s3 } from "../config/s3";

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

export const avatarUpload = createS3Upload("users/avatar", [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);
