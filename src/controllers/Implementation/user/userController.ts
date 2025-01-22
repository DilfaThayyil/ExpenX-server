import { inject, injectable } from 'tsyringe';
import { IUserController } from '../../Interface/user/IUserController';
import { IUserService } from '../../../services/Interface/user/IUserService';
import cloudinary from '../../../config/cloudinaryConfig';
import { Request, Response } from 'express';

@injectable()
export default class UserController implements IUserController {
  private userService: IUserService;

  constructor(@inject('IUserService') userService: IUserService) {
    this.userService = userService;
  }


  async uploadProfileImage(req: Request, res: Response): Promise<void> {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ error: 'No file uploaded' });
        return
      }
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'profile_pictures',
      });
      console.log("result : ",result)
      const imageUrl = result.secure_url;
      console.log("imageUrl : ",imageUrl)
      res.status(200).json({ url: imageUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Error uploading image' });
    }
  }
  


  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { profilePic, username, email, phone, country, language } = req.body;
      if (!email || !username) {
         res.status(400).json({ error: 'Email and username are required' });
      }
      const updatedUser = await this.userService.updateUserProfile({
        profilePic,
        username,
        email,
        phone,
        country,
        language,
      });
       res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Error updating user' });
    }
  }
}
