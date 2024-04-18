import {Router} from 'express';

import {getCurrentUser} from '../controllers/userController';
import {isAuth} from "../middleware/is-auth";

const router: Router = Router();

router.get('/get-user', isAuth, getCurrentUser);

export default router;
