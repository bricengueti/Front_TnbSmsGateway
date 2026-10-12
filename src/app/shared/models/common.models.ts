/** Correspond exactement à ApiResponse — réponse générique de confirmation. */
export interface ApiResponse {
  message: string;
  success: boolean;
}

/** Correspond exactement à PageResponse<T> (ex: PageResponseMessageResponse). */
export interface PageResponse<T> {
  data: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
