import {Router} from 'express';
import {body} from 'express-validator';

import {signup} from '../controllers/auth';
import {User} from '../models/user';

const router: Router = Router();

router.put('/signup', [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom(value => {
        return User.findOne({email: value})
          .then(userDoc => {
            if (userDoc) {
              return Promise.reject('E-Mail address already exists!');
            }
          })
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({min: 5}),
    body('name')
      .trim()
      .not()
      .isEmpty()
  ],
  signup);

// router.post('/login', authController.login);

export default router;
