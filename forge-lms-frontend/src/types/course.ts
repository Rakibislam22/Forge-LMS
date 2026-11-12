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

export interface Lecture {
  id: string;
  _id?: string;
  courseId: string;
  title: string;
  description?: string;
  videoUrl: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Admin {
  id: string;
  email: string;
  role: "admin";
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

export interface CourseDetailResponse {
  course: Course;
  lectures: Lecture[];
}

export interface LectureResponse {
  lecture: Lecture;
  course: Course;
  prevLectureId?: string | null;
  nextLectureId?: string | null;
  allLectures: Lecture[];
}

export interface LoginResponse {
  token: string;
  admin: Admin;
}
