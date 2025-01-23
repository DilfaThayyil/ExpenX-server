import { Router } from 'express';
import upload from '../../middleware/multer';
import { container } from 'tsyringe';
import { IUserController } from '../../controllers/Interface/user/IUserController';

const userController = container.resolve<IUserController>('IUserController');
const router = Router();

router.post('/upload', upload.single('profilePic'), (req, res) =>{
  console.log("req file : ",req.file)
  console.log("req body : ",req.body)
  userController.uploadProfileImage(req, res)
});

router.patch('/editProfile', (req, res) =>
  userController.updateUser(req, res)
);

export default router