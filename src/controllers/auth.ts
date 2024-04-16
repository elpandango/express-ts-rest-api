import {UserModel} from '../models/user';
import {RequestHandler} from 'express';
import {Result, validationResult} from 'express-validator';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {CustomError} from "../interfaces/error";

export const signup: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const errors: Result = validationResult(req);
        if (!errors.isEmpty()) {
            const error: CustomError = new Error('Validation failed.');
            error.statusCode = 422;
            error.data = errors;
            throw error;
        }

        const email = req.body?.email;
        const name = req.body?.name;
        const password = req.body?.password;
        const hashedPw: string = await bcrypt.hash(password, 12);
        const user = new UserModel({
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

export const login: RequestHandler = async (req, res, next): Promise<void> => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    try {
        const user = await UserModel.findOne({email: email});
        if (!user) {
            const error: CustomError = new Error('A user with this email could not be found.');
            error.statusCode = 404;
            throw error;
        }
        loadedUser = user;
        const isEqual: boolean = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error: CustomError = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }
        const token: string = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            }, 'somesupersecretsecret'
            , {expiresIn: '1h'})
        res.status(200).json({
            token: token,
            userId: loadedUser._id.toString()
        });
        return;
    } catch (err: any) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
        return err;
    }
};
