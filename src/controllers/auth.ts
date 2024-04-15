import {User} from '../models/user';
import { RequestHandler} from 'express';
import {validationResult} from 'express-validator';

// import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const signup: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  // if (errors?.errors.length > 0) {
  //   const error = new Error('Validation failed.');
  //   (<any>error).statusCode = 422;
  //   (<any>error).data = errors.errors;
  //   throw error;
  // }

  console.log('req.body: ', req.body);

  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  try {
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPw,
      name: name
    });
    const result = await user.save();
    res.status(201).json({
      message: 'User created!',
      userId: result._id
    });
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
