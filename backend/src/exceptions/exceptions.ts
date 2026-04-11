export class AppError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = new.target.name;
    this.message = message;
  }
}

export class LoadFileAppError extends AppError { }
export class FileDataValidationAppError extends AppError { }

export class PayloadValidationAppError extends AppError { }
export class ReservationAppError extends AppError { }
