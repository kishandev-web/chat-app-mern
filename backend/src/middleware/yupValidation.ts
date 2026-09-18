import { NextFunction, Request, Response } from "express";

export const validator =
  (schema: any) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.body.options && typeof req.body.options === "string") {
        req.body.options = JSON.parse(req.body.options); 
      }

      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.errors[0],
      });
    }
  };
