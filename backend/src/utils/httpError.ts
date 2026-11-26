export class HttpError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(status: number, message: string, code = 'ERROR', details?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static badRequest(message: string, details?: unknown) {
    return new HttpError(400, message, 'BAD_REQUEST', details);
  }
  static unauthorized(message = 'Authentication required') {
    return new HttpError(401, message, 'UNAUTHORIZED');
  }
  static forbidden(message = 'You do not have permission to do this') {
    return new HttpError(403, message, 'FORBIDDEN');
  }
  static notFound(message = 'Not found') {
    return new HttpError(404, message, 'NOT_FOUND');
  }
  static conflict(message: string) {
    return new HttpError(409, message, 'CONFLICT');
  }
}