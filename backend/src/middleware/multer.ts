// import multer from "multer";
// import path from "path";

// const createMulter = (
//   destination: string,
//   allowedMimeTypes: string[],
//   fileSize: number = 1024 * 1024 * 2
// ) => {
//   const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, destination);
//     },

//     filename: (req, file, cb) => {
//       const uniqueName =
//         Date.now() + path.extname(file.originalname);

//       cb(null, uniqueName);
//     },
//   });

//   return multer({
//     storage,

//     limits: {
//       fileSize,
//     },

//     fileFilter: (req, file, cb) => {
//       if (allowedMimeTypes.includes(file.mimetype)) {
//         cb(null, true);
//       } else {
//         cb(
//           new Error(
//             `Only ${allowedMimeTypes.join(", ")} files allowed`
//           )
//         );
//       }
//     },
//   });
// };

import multer from "multer";
import path from "path";

const createMulter = (
  destination: string,
  allowedMimeTypes?: string[],
  fileSize: number = 1024 * 1024 * 2,
) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination);
    },

    filename: (req, file, cb) => {
      const uniqueName = Date.now() + path.extname(file.originalname);

      cb(null, uniqueName);
    },
  });

  return multer({
    storage,

    limits: {
      fileSize,
    },

    fileFilter: (req, file, cb) => {
      // If no validation needed
      if (!allowedMimeTypes || allowedMimeTypes.length === 0) {
        return cb(null, true);
      }

      // Validate file type
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file format"));
      }
    },
  });
};

// export const avatarUpload = createMulter("src/public/user");
export const avatarUpload = createMulter(
  "src/public/user",
  ["image/png", "image/jpeg", "image/jpg", "image/webp"],
  1024 * 1024 * 2,
);

export const chatImageUpload = createMulter("src/public/chat");
// chatImageUpload.array("images", 5)
export const documentUpload = createMulter("src/public/document");
// upload.fields([
//   { name: "avatar", maxCount: 1 },
//   { name: "coverImage", maxCount: 1 },
//   { name: "gallery", maxCount: 5 },
// ])
