import fs from 'fs';
import path from 'path';
import mongoose from "mongoose";
import {RequestHandler} from 'express';
import {validationResult} from 'express-validator';
// const io = require('../socket');

import {Post} from '../models/post';
import {User} from '../models/user';

export const getPosts: RequestHandler = async (req, res, next) => {
  const currentPage: number = Number(req.query.post || 1);
  const perPage: number = 10;
  try {
    const totalItems: number = await Post.find().countDocuments();
    const posts = await Post.find()
      .populate('creator')
      .sort({createdAt: -1})
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200)
      .json({
        message: 'Fetch posts successfully.',
        posts: posts,
        totalItems: totalItems
      });
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const createPost: RequestHandler = async (req, res, next) => {
  try {
    const errors: any = validationResult(req);
    if (errors?.errors.length > 0) {
      const error = new Error('Validation failed, entered data is incorrect.');
      (<any>error).statusCode = 422;
      throw error;
    }
    // if (!(<any>req).file) {
    //   const error = new Error('No image provided.');
    //   (<any>error).statusCode = 422;
    //   throw error;
    // }

    // const imageUrl = (<any>req).file.path;
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
      title,
      content,
      // imageUrl: imageUrl,
      creator: (<any>req).userId.toString(),
    });

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

export const getPost: RequestHandler = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('Could not find post.');
      (<any>error).statusCode = 404;
      throw error;
    }
    res.status(200)
      .json({
        message: 'Post fetched.',
        post: post
      });
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// exports.updatePost = async (req, res, next) => {
//   const postId = req.params.postId;
//   const errors = validationResult(req);
//   if (errors?.errors.length > 0) {
//     const error = new Error('Validation failed, entered data is incorrect.');
//     error.statusCode = 422;
//     throw error;
//   }
//   const title = req.body.title;
//   const content = req.body.content;
//   let imageUrl = req.body.image;
//   if (req.file) {
//     imageUrl = req.file.path;
//   }
//   if (!imageUrl) {
//     const error = new Error('No file picked.');
//     error.statusCode = 422;
//     throw error;
//   }
//
//   try {
//     const post = await Post.findById(postId).populate('creator');
//     if (!post) {
//       const error = new Error('Could not find post.');
//       error.statusCode = 404;
//       throw error;
//     }
//     if (post.creator._id.toString() !== req.userId.toString()) {
//       const error = new Error('Not Authorized!');
//       error.statusCode = 403;
//       throw error;
//     }
//     if (imageUrl !== post.imageUrl) {
//       clearImage(post.imageUrl);
//     }
//     post.title = title;
//     post.imageUrl = imageUrl;
//     post.content = content;
//     const result = await post.save();
//     io.getIO().emit('posts', {
//       action: 'update',
//       post: result
//     });
//     res.status(200)
//       .json({
//         message: 'Post updated.',
//         post: result
//       });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };
//
// exports.deletePost = async (req, res, next) => {
//   const postId = req.params.postId;
//   try {
//     const post = await Post.findById(postId);
//
//     // Check logged in user
//     if (!post) {
//       const error = new Error('Could not find post.');
//       error.statusCode = 404;
//       throw error;
//     }
//     if (post.creator.toString() !== req.userId.toString()) {
//       const error = new Error('Not Authorized!');
//       error.statusCode = 403;
//       throw error;
//     }
//     clearImage(post.imageUrl);
//     await Post.findByIdAndDelete(postId);
//     const user = await User.findById(req.userId);
//     user.posts.pull(postId);
//     await user.save();
//     io.getIO().emit('posts', {
//       action: 'delete',
//       post: postId
//     });
//     res.status(200).json({message: 'Deleted post.'});
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };
//
// const clearImage = filePath => {
//   filePath = path.join(__dirname, '..', filePath);
//   fs.unlink(filePath, err => console.log(err));
// };
