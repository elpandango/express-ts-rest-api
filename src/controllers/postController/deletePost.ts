import {NextFunction, Request, RequestHandler, Response} from "express";
import {PostModel} from "../../models/post";
import {UserModel} from "../../models/user";
import {clearImage} from "../../utils/helpers";
import {generateError} from "../../utils/error";

export const deletePost: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const postId: string = req.params.postId;
    try {
        const post = await PostModel.findById(postId);
        if (!post) {
            generateError({statusCode: 404, message: 'Could not find post'});
        }
        if (post?.creator.toString() !== (<any>req).userId.toString()) {
            generateError({statusCode: 403, message: 'Not Authorized!'});
        }

        clearImage(post!.imageUrl);
        await PostModel.findByIdAndDelete(postId);
        const user = await UserModel.findById((<any>req).userId);

        if (user) {
            (user as any).posts.pull(postId);
            await user.save();
        }

        res.status(200).json({
            status: 200,
            message: 'Deleted postController.'
        });
    } catch (err: any) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};