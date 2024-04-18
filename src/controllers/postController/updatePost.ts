import {NextFunction, Request, RequestHandler, Response} from "express";
import {validationResult} from "express-validator";
import {PostModel} from "../../models/post";
import {clearImage} from "../../utils/helpers";
import {generateError} from "../../utils/error";

export const updatePost: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const postId: string = req.params.postId;
    const errors: any = validationResult(req);
    if (errors?.errors.length > 0) {
        generateError({statusCode: 422, message: 'Validation failed, entered data is incorrect.'});
    }
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = (<any>req)?.file?.path;

    try {
        const post = await PostModel.findById(postId).populate('creator');
        if (!post) {
            generateError({statusCode: 404, message: 'Could not find post.'});
        }
        if (post?.creator._id.toString() !== (<any>req).userId.toString()) {
            generateError({statusCode: 403, message: 'Not Authorized!'});
        }

        if (imageUrl !== post?.imageUrl) {
            clearImage(post!.imageUrl);
        }

        if (imageUrl) {
            clearImage(post!.imageUrl);
            const tempUrl = imageUrl;
            imageUrl = tempUrl.replace('dist/', '');
            post!.imageUrl = imageUrl;
        }
        post!.title = title;
        post!.content = content;
        const result = await post!.save();

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