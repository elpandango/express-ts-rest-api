import {Router} from 'express';
import {body} from 'express-validator';

import {isAuth} from "../middleware/is-auth";
import { postController } from '../controllers/postController/postController';

const router = Router();

router.get('/posts', postController.getPosts);

router.post('/post', isAuth,
  [
    body('title').trim().isLength({min: 1}),
    body('content').trim().isLength({min: 1}),
  ],
    postController.createPost);

router.get('/post/:postId',
  isAuth, postController.getSinglePost);

router.put('/post/:postId',
  isAuth, [
    body('title').trim().isLength({min: 1}),
    body('content').trim().isLength({min: 1}),
  ], postController.updatePost);

router.delete('/post/:postId',
  isAuth,
    postController.deletePost);

export default router;
