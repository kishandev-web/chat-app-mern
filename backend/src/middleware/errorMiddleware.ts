import { Request, Response, NextFunction } from "express";

// export const errorMiddleware = (
//   err: any,
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   console.error(err);

//   const statusCode = err.statusCode || 500;

//   res.status(statusCode).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//   });
// };

import { logger } from "../utils/logger";

export const errorMiddleware = (err: any, req: any, res: any, next: any) => {
  logger.error(err.message);
  logger.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};