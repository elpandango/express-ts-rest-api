import {NextFunction, Request, RequestHandler, Response} from "express";
import {validationResult} from "express-validator";
import {PostModel} from "../../models/post";
import {UserModel} from "../../models/user";
import {generateError} from "../../utils/error";

export const createPost: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const errors: any = validationResult(req);
        if (errors?.errors.length > 0) {
            generateError({statusCode: 422, message: 'Validation failed, entered data is incorrect.'});
        }

        let imageUrl;

        if (!(<any>req).file) {
            imageUrl = 'images/empty-image.png';
        } else {
            const tempUrl = (<any>req).file.path;
            imageUrl = tempUrl.replace('dist/', '');
        }

        const title = req.body.title;
        const content = req.body.content;
        const post = new PostModel({
            title,
            content,
            imageUrl,
            creator: (<any>req).userId.toString(),
        });

        await post.save();
        const user = await UserModel.findById((<any>req).userId);

        if (user) {
            (user as any).posts.push(post);
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