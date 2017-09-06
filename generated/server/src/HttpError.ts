export class HttpError extends Error {
  //name: string = 'HttpError';
  //stack: string = null;

  constructor(public status: number, message: string) {
    super(message);

    //this.stack = (new Error()).stack;
  }
}
