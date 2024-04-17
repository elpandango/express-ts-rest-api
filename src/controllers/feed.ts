import fs from 'fs';
import path from 'path';
import mongoose, {Document} from "mongoose";
import {NextFunction, RequestHandler, Response, Request} from 'express';
import {validationResult} from 'express-validator';
import {CustomError} from "../interfaces/error";
// const io = require('../socket');

import {PostModel} from '../models/post';
import {UserModel} from '../models/user';

export const getPosts: RequestHandler = async (req, res, next): Promise<void> => {
    let currentPage: number = 1;
    // const currentPage: number = +req.query?.post || 1;
    const perPage: number = 10;
    try {
        const totalItems: number = await PostModel.find().countDocuments();
        const posts = await PostModel.find()
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
    } catch (err) {
        const error: CustomError = new Error('Internal server error.');
        error.statusCode = 500;
        next(error);
    }
};

export const createPost: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const errors: any = validationResult(req);
        if (errors?.errors.length > 0) {
            const error: CustomError = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }
        if (!(<any>req).file) {
            const error = new Error('No image provided.');
            (<any>error).statusCode = 422;
            throw error;
        }

        const filePath = (<any>req).file.path;
        const data = fs.readFileSync(filePath);
        const base64Data = Buffer.from(data).toString('base64');
        const imageUrl = `data:image/jpeg;base64,${base64Data}`;
        const title = req.body.title;
        const content = req.body.content;
        // const imageUrl = (<any>req).file.path;
        const post = new PostModel({
            title,
            content,
            imageUrl,
            creator: (<any>req).userId.toString(),
        });

        await post.save();
        const user = await UserModel.findById((<any>req).userId);

        if (user) {
            user.posts.push(post);
            await user.save();

            res.status(201).json({
                message: 'Post created successfully',
                post: {...(<any>post)._doc, creator: {_id: (<any>req).userId, name: user.name}},
                creator: {
                    _id: user._id,
                    name: user.name
                }
            });
        }
    } catch (err: any) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

export const getPost: RequestHandler = async (req, res, next): Promise<void> => {
    const postId: string = req.params.postId;
    try {
        const post = await PostModel.findById(postId);
        if (!post) {
            const error: CustomError = new Error('Could not find post.');
            error.statusCode = 404;
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

export const updatePost: RequestHandler = async (req, res, next) => {
    const postId = req.params.postId;
    const errors: any = validationResult(req);
    if (errors?.errors.length > 0) {
        const error: CustomError = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    // let imageUrl = req.body.image;
    let data;
    let base64Data;
    let imageUrl;

    const filePath = (<any>req)?.file?.path;
    if (filePath) {
        data = fs.readFileSync(filePath);
        base64Data = Buffer.from(data).toString('base64');
        imageUrl = `data:image/jpeg;base64,${base64Data}`;
    }


    // if (req.file) {
    //     imageUrl = req.file.path;
    // }
    // if (!imageUrl) {
    //     const error: CustomError = new Error('No file picked.');
    //     error.statusCode = 422;
    //     throw error;
    // }

    try {
        const post = await PostModel.findById(postId).populate('creator');

        // console.log(imageUrl);
        // console.log(post.imageUrl);

        if (!post) {
            const error: CustomError = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }
        if (post.creator._id.toString() !== (<any>req).userId.toString()) {
            const error: CustomError = new Error('Not Authorized!');
            error.statusCode = 403;
            throw error;
        }
        if (imageUrl) {
            // clearImage(post.imageUrl);
            post.imageUrl = imageUrl;
        }
        post.title = title;
        post.content = content;
        const result = await post.save();

        res.status(200)
            .json({
                message: 'Post updated.',
                post: result
            });
    } catch (err: any) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

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
