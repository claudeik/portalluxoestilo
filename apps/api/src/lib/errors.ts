export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public code: string = "BAD_REQUEST"
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(`${resource}${id ? ` (${id})` : ""} não encontrado`, 404, "NOT_FOUND");
  }
}

export class UpstreamError extends AppError {
  constructor(service: string, detail?: string) {
    super(`Falha na integração com ${service}${detail ? `: ${detail}` : ""}`, 502, "UPSTREAM_ERROR");
  }
}
