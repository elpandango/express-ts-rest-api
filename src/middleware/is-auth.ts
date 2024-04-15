import jwt from 'jsonwebtoken';
import {RequestHandler} from 'express';

export const isAuth: RequestHandler = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated.');
    (<any>error).statusCode = 401;
    throw error;
  }
  const token: string = authHeader.split(' ')[1];
  let decodedToken: any;
  try {
    decodedToken = jwt.verify(token, 'somesupersecretsecret');
  } catch (err: any) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    (<any>error).statusCode = 401;
    throw error;
  }
  (<any>req).userId = decodedToken.userId;
  next();
};
