
export interface User {
  id: string;
  name: string;
  color: string;
}

export interface Stroke {
  id: string;
  userId: string;
  points: Point[];
  color: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface LoginRequest {
  name: string;
  color: string;
}

export interface LoginResponse {
  user: User;
}

export interface DrawRequest {
  userId: string;
  points: Point[];
}
