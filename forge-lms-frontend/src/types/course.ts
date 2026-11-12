export interface Course {
  id: string;
  _id?: string;
  title: string;
  description: string;
  price: number;
  thumbnailUrl?: string;
  lectureCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

export interface CoursesResponse {
  courses: Course[];
}
