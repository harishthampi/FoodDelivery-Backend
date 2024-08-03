import express from 'express';
import userController from '../controller/userController';
import { jwtCheck, jwtParse } from '../middleware/auth';
import { validateMyUserRequest } from '../middleware/validation';

const router = express.Router();

router.post('/', jwtCheck ,userController.createUser);
router.put('/',jwtCheck,jwtParse,validateMyUserRequest,userController.updateUser);
router.get('/',jwtCheck,jwtParse,userController.getUser);

 export default router;