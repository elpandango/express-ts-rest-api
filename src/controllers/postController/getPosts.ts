import {NextFunction, Request, RequestHandler, Response} from "express";
import {PostModel} from "../../models/post";
import {CustomError} from "../../interfaces/error";

export const getPosts: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const currentPage: number = +(<any>req.query)?.page || 1;
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
                posts: posts,
                totalItems: totalItems,
                currentPage: currentPage,
                hasNextPage: perPage * currentPage < totalItems,
                hasPrevPage: currentPage > 1,
                nextPage: currentPage + 1,
                previousPage: currentPage - 1,
                lastPage: Math.ceil(totalItems / perPage)
            });
    } catch (err) {
        const error: CustomError = new Error('Internal server error.');
        error.statusCode = 500;
        next(error);
    }
};