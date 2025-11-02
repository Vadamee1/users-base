export interface ApiMessage {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export interface ApiResponse<T> {
  data: T | null;
  messages: ApiMessage[];
}
