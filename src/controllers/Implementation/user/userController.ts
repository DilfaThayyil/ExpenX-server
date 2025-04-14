import { inject, injectable } from 'tsyringe';
import { IUserController } from '../../Interface/user/IUserController';
import { IUserService } from '../../../services/Interface/user/IUserService';
import cloudinary from '../../../config/cloudinaryConfig';
import { Request, Response } from 'express';
import { HttpStatusCode } from '../../../utils/httpStatusCode';
import { messageConstants } from '../../../utils/messageConstants';


@injectable()
export default class UserController implements IUserController {
  private _userService: IUserService;

  constructor(@inject('IUserService') userService: IUserService) {
    this._userService = userService;
  }


  async uploadProfileImage(req: Request, res: Response): Promise<void> {
    try {
      const file = req.file;
      if (!file) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'No file uploaded' });
        return
      }
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'profile_pictures',
      });
      const imageUrl = result.secure_url;
      res.status(HttpStatusCode.OK).json({ url: imageUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Error uploading image' });
    }
  }


  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { profilePic, username, email, phone, country, language } = req.body;
      if (!email || !username) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'Email and username are required' });
      }
      const updatedUser = await this._userService.updateUserProfile({
        profilePic,
        username,
        email,
        phone,
        country,
        language,
      });
      res.status(HttpStatusCode.OK).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Error updating user' });
    }
  }

  async getDashboardData(req:Request,res:Response):Promise<Response>{
    try{
      const userId = req.params.userId
      const data = await this._userService.getDashboardData(userId)
      return res.status(HttpStatusCode.OK).json(data)
    }catch(err){
      console.error(err)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({error:'Failed to fetch data for dashboard'})
    }
  }

  async fetchUsers(req: Request, res: Response): Promise<Response> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { users, totalPages } = await this._userService.fetchUsers(page, limit);
      return res.status(HttpStatusCode.OK).json({ success: true, data: { users, totalPages } });
    } catch (error) {
      console.error(error)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: messageConstants.INTERNAL_ERROR    });
    }
  }

  async updateUserBlockStatus(req: Request, res: Response): Promise<Response> {
    try {
      const { action, email } = req.body;
      const result = await this._userService.updateUserBlockStatus(action, email);
      if (result.error) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ error: result.error });
      }
      return res.status(HttpStatusCode.OK).json({ message: result.message });
    } catch (error) {
      console.error(error)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: messageConstants.INTERNAL_ERROR    });
    }
  }
  
}
