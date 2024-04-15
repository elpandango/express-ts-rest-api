import fs from 'fs';
import path from 'path';
import mongoose from "mongoose";
import {NextFunction, RequestHandler} from 'express';
import {validationResult} from 'express-validator';

import {Post} from '../models/post';
import {User} from '../models/user';


export const createPost: RequestHandler = async (req, res, next) => {
  const errors: any = validationResult(req);

  console.log(req);

  if (errors?.errors.length > 0) {
    const error = new Error('Validation failed, entered data is incorrect.');
    (<any>error).statusCode = 422;
    throw error;
  }
  if (!(<any>req).file) {
    const error = new Error('No image provided.');
    (<any>error).statusCode = 422;
    throw error;
  }

  const imageUrl = (<any>req).file.path;
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title,
    content,
    imageUrl: imageUrl,
    creator: (<any>req).userId,
  });

  try {
    await post.save();
    const user = await User.findById((<any>req).userId);
    let savedUser;

    if (user) {
      user.posts.push(post);
      savedUser = await user.save();

      res.status(201).json({
        message: 'Post created successfully',
        post: {...(<any>post)._doc, creator: {_id: (<any>req).userId, name: user.name}},
        creator: {
          _id: user._id,
          name: user.name
        }
      });
    }

    return savedUser;
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
