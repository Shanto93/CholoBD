// class AppError extends Error {
//   public statuscode: number;

//   constructor(statuscode: number, message: string, stack: "") {
//     super(message);
//     this.statuscode = statuscode;
//     if (stack) {
//       this.stack = stack;
//     } else {
//       Error.captureStackTrace(this, this.constructor);
//     }
//   }
// }

// export default AppError;

class AppError extends Error {
  public statuscode: number;

  constructor(statuscode: number, message: string, stack?: string) {
    super(message);
    this.name = this.constructor.name;
    this.statuscode = statuscode;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
