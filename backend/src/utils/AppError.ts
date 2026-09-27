export class AppError extends Error {
  statusCode: number;
  type: string;

  constructor(message: string, statusCode = 500, type = "Error") {
    super(message);
    this.statusCode = statusCode;
    this.type = type;

    Error.captureStackTrace(this, this.constructor);
  }
}



// class AppError extends Error {
//   statusCode: number;
//   type: string;

//   constructor(message: string, statusCode = 500, type = "Error") {
//     super(message);
//     this.statusCode = statusCode;
//     this.type = type;

//     Error.captureStackTrace(this, this.constructor);
//   }
// }
