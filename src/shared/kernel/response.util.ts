import { ApiResponse } from './response.interface';

export function createResponse<T>(
  type: 'success' | 'error' | 'warning' | 'info',
  message: string,
  data: T | null = null,
): ApiResponse<T> {
  return {
    data,
    messages: [
      {
        message,
        type,
      },
    ],
  };
}
