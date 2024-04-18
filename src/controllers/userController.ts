import {UserModel} from '../models/user';
import {RequestHandler} from "express";

export const getCurrentUser: RequestHandler = async (req, res, next): Promise<void> => {
    const userId = (<any>req).userId;
    const user = await UserModel.findOne({_id: userId});
    res.status(200).json({
        message: 'User successfully fetched.',
        user: user
    });
};