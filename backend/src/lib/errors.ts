export class HttpError extends Error {
  status: number;
  code?: string;
  payload?: any;
  constructor(status: number, message: string, opts: { code?: string; payload?: any } = {}) {
    super(message);
    this.status = status;
    this.code = opts.code;
    this.payload = opts.payload;
  }
}
export const BadRequest       = (m = 'Bad request', p?: any) => new HttpError(400, m, { payload: p });
export const Unauthorized     = (m = 'Unauthorized')          => new HttpError(401, m);
export const Forbidden        = (m = 'Forbidden')             => new HttpError(403, m);
export const NotFound         = (m = 'Not found')             => new HttpError(404, m);
export const PaymentRequired  = (m = 'Upgrade required', p?: any) => new HttpError(402, m, { payload: p });
