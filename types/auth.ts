export interface User {
    id: number;
    username: string;
    name?: string;
    phone?: string;
    age?: number;
    weight?: number;
    height?: number;
  }
  
  export interface AuthResponse {
    session: string;
    user: User;
  }
  
  export interface UserProfile {
    name?: string;
    phone?: string;
    age?: number;
    weight?: number;
    height?: number;
  }
  
  export interface RegisterData {
    username: string;
    password: string;
  }
  
  