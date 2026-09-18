import { Response } from "express";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
) => {
  const response: ApiResponse<T> = {
    data,
    success: true,
    message,
  };

  return res.status(statusCode).json(response);
};


