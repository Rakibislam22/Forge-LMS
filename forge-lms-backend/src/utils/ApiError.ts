export type ErrorCode =
  | "VALIDATION_ERROR"
  | "INVALID_ID"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "PAYLOAD_TOO_LARGE"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

export class ApiError extends Error {
  public statusCode: number;
  public code: ErrorCode;
  public details?: Array<{ field: string; message: string }>;

  constructor(
    statusCode: number,
    code: ErrorCode,
    message: string,
    details?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message: string, details?: Array<{ field: string; message: string }>) {
    return new ApiError(400, "VALIDATION_ERROR", message, details);
  }

  static invalidId(message: string = "Invalid ID format") {
    return new ApiError(400, "INVALID_ID", message);
  }

  static unauthenticated(message: string = "Authentication required") {
    return new ApiError(401, "UNAUTHENTICATED", message);
  }

  static forbidden(message: string = "Access denied") {
    return new ApiError(403, "FORBIDDEN", message);
  }

  static notFound(message: string = "Resource not found") {
    return new ApiError(404, "NOT_FOUND", message);
  }

  static internal(message: string = "An unexpected error occurred") {
    return new ApiError(500, "INTERNAL_ERROR", message);
  }
}
