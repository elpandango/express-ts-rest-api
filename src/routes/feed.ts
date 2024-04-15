import {Router} from 'express';
import {body} from 'express-validator';

import {createPost} from '../controllers/feed';

const router = Router();

router.post('/post',
  [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5}),
  ],
  createPost);

// router.get('/', getTodos);
//
// router.patch('/:id', updateTodo);
//
// router.delete('/:id', deleteTodo);

export default router;
