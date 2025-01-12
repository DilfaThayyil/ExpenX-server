// errors.ts
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ExpiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExpiredError';
  }
}

  
  export class InternalServerError extends Error {
    constructor(message: string = 'An unexpected error occurred.') {
      super(message);
      this.name = 'InternalServerError';
    }
  }
  