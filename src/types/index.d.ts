declare module 'express-serve-static-core' {
  export interface Request {
    user: UserPayload;
  }
}

export type UserPayload = {
  id_user: number;
  username: string;
  iat: number;
  exp: number;
};
