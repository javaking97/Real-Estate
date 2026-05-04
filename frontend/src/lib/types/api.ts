export interface ApiResponseEnvelope<T> {
  resultCode: number;
  resultMsg: string;
  result: T;
}

export interface ErrorField {
  field: string;
  value: string;
  reason: string;
}

export interface SpringErrorResponse {
  status: number;
  divisionCode: string;
  resultMsg: string;
  errors?: ErrorField[];
  reason?: string;
  traceId?: string;
  correlationId?: string;
  path?: string;
  timestamp?: string;
}

export class ApiError extends Error {
  status: number;
  divisionCode: string;
  reason?: string;
  traceId?: string;
  correlationId?: string;
  path?: string;
  timestamp?: string;
  errors?: ErrorField[];

  constructor(payload: SpringErrorResponse) {
    super(payload.resultMsg);
    this.name = 'ApiError';
    this.status = payload.status;
    this.divisionCode = payload.divisionCode;
    this.reason = payload.reason;
    this.traceId = payload.traceId;
    this.correlationId = payload.correlationId;
    this.path = payload.path;
    this.timestamp = payload.timestamp;
    this.errors = payload.errors;
  }
}
