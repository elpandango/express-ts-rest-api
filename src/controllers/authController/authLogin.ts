import {RequestHandler} from "express";
import {UserModel} from "../../models/user";
import {CustomError} from "../../interfaces/error";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
            , {expiresIn: '5h'})
        res.status(200).json({
            token: token,
            user: user,
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