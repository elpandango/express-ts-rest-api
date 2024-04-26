import {RequestHandler} from "express";
import {Result, validationResult} from "express-validator";
import {CustomError} from "../../interfaces/error";
import bcrypt from "bcryptjs";
import {UserModel} from "../../models/user";

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