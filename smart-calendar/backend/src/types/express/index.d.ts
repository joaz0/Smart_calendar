declare namespace Express {
  export interface User {
    id: number;
    name: string;
    email: string;
  }
  export interface Request {
    user?: User;
  }
}
