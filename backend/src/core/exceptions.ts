export class AppException extends Error {
  public readonly code: string;
  public readonly httpStatus: number;

  constructor(message: string, code: string, httpStatus: number = 500) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.httpStatus = httpStatus;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidProfileUrlError extends AppException {
  constructor(message = "The provided URL is not a valid LinkedIn profile URL.") {
    super(message, "INVALID_PROFILE_URL", 400);
  }
}

export class ProfileNotFoundError extends AppException {
  constructor(message = "The requested profile could not be found or is unavailable.") {
    super(message, "PROFILE_NOT_FOUND", 404);
  }
}

export class UpstreamAuthenticationError extends AppException {
  constructor(message = "Failed to authenticate with the upstream provider.") {
    super(message, "UPSTREAM_AUTH_ERROR", 502);
  }
}

export class UpstreamRateLimitError extends AppException {
  constructor(message = "Upstream provider rate limit exceeded.") {
    super(message, "UPSTREAM_RATE_LIMIT", 502);
  }
}

export class UpstreamTimeoutError extends AppException {
  constructor(message = "Request to the upstream provider timed out.") {
    super(message, "UPSTREAM_TIMEOUT", 504);
  }
}

export class UpstreamUnavailableError extends AppException {
  constructor(message = "Upstream provider is temporarily unavailable.") {
    super(message, "UPSTREAM_UNAVAILABLE", 502);
  }
}

export class UpstreamResponseParseError extends AppException {
  constructor(message = "Failed to parse the response from the upstream provider.") {
    super(message, "UPSTREAM_PARSE_ERROR", 502);
  }
}

export class RateLimitExceededError extends AppException {
  constructor(message = "Too many requests. Please try again later.") {
    super(message, "RATE_LIMIT_EXCEEDED", 429);
  }
}
