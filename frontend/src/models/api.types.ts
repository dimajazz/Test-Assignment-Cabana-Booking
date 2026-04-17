import { API_ERROR_TYPES } from "@constants/api.constants";

export type ApiErrorType = typeof API_ERROR_TYPES[keyof typeof API_ERROR_TYPES];

export type ApiError =
  | NetworkError
  | HttpError
  | ValidationError
  | ServerError
  | ParseError
  | TimeoutError;

export type ApiBaseError = {
  message: string;
  cause?: unknown;
}

export type NetworkError = ApiBaseError & {
  type: typeof API_ERROR_TYPES.NETWORK;
};

export type HttpError = ApiBaseError & {
  type: typeof API_ERROR_TYPES.HTTP;
  status: number;
};

export type ValidationError = ApiBaseError & {
  type: typeof API_ERROR_TYPES.VALIDATION;
  details?: Record<string, string>;
};

export type ServerError = ApiBaseError & {
  type: typeof API_ERROR_TYPES.SERVER;
};

export type ParseError = ApiBaseError & {
  type: typeof API_ERROR_TYPES.PARSE;
};

export type TimeoutError = ApiBaseError & {
  type: typeof API_ERROR_TYPES.TIMEOUT;
};
