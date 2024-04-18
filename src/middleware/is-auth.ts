import jwt from 'jsonwebtoken';
import {RequestHandler, Request, Response, NextFunction} from 'express';
import {generateError} from "../utils/error";

interface DecodedToken {
  userId: string;
}

export const isAuth: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const authHeader: string | undefined = req.get('Authorization');
  if (!authHeader) {
    generateError({statusCode: 401, message: 'Not authenticated'});
  }
  const token: string = authHeader!.split(' ')[1];
  let decodedToken: DecodedToken;
  try {
    decodedToken = jwt.verify(token, 'somesupersecretsecret') as DecodedToken;
  } catch (err: any) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    generateError({statusCode: 401, message: 'Not authenticated'});
  }
  (<any>req).userId = decodedToken.userId;
  next();
};
