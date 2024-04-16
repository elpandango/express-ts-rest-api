import {Router} from 'express';
import {body} from 'express-validator';

import {isAuth} from "../middleware/is-auth";
import { getPosts, createPost, getPost} from '../controllers/feed';

const router = Router();

router.get('/posts', isAuth, getPosts);

router.post('/post', isAuth,
  [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5}),
  ],
  createPost);

router.get('/post/:postId',
  isAuth, getPost);

// router.put('/post/:postId',
//   isAuth, [
//     body('title').trim().isLength({min: 5}),
//     body('content').trim().isLength({min: 5}),
//   ], feedController.updatePost);
//
// router.delete('/post/:postId',
//   isAuth,
//   feedController.deletePost);

export default router;
