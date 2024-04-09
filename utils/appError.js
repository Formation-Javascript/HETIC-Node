class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
console.log(statusCode);
    this.statusCode = statusCode;
    this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Permet de ne pas afficher les erreurs de programmation dans le stack
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;