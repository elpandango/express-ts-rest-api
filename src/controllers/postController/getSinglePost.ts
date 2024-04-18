import {NextFunction, Request, RequestHandler, Response} from "express";
import {PostModel} from "../../models/post";
import {generateError} from "../../utils/error";

export const getSinglePost: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const postId: string = req.params.postId;
    try {
        const post = await PostModel.findById(postId);
        if (!post) {
            generateError({statusCode: 404, message: 'Could not find post.'});
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