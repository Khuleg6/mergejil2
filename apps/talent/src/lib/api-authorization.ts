import { AuthorizationError } from './session';
import { jsonError } from './http';

export const authorizationErrorResponse = (error: unknown) => {
  if (error instanceof AuthorizationError) return jsonError(error.message, error.status);
  console.error('API request failed', error);
  return jsonError('An unexpected server error occurred.', 500);
};
