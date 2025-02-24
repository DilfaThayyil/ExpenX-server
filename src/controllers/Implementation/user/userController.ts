import { inject, injectable } from 'tsyringe';
import { IUserController } from '../../Interface/user/IUserController';
import { IUserService } from '../../../services/Interface/user/IUserService';
import cloudinary from '../../../config/cloudinaryConfig';
import { Request, Response } from 'express';
import { HttpStatusCode } from '../../../utils/httpStatusCode';
import { GroupMember, IGroupExpense } from '../../../entities/groupEntities';

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
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'No file uploaded' });
        return
      }
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'profile_pictures',
      });
      // console.log("result : ", result)
      const imageUrl = result.secure_url;
      // console.log("imageUrl : ", imageUrl)
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
      const updatedUser = await this.userService.updateUserProfile({
        profilePic,
        username,
        email,
        phone,
        country,
        language,
      });
      // console.log("updatedUser : ",updatedUser)
      res.status(HttpStatusCode.OK).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Error updating user' });
    }
  }


  async getExpenses(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params; 
      const expenses = await this.userService.getExpensesByUserId(userId);
      res.status(HttpStatusCode.OK).json(expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching expenses' });
    }
  }

  async createExpense(req: Request, res: Response): Promise<void> {
    try {
      // console.log('dillll')
      const {userId} = req.params
      const { date, amount, category, description } = req.body;
      if (!date || !amount || !category || !description) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'All fields are required' });
        return;
      }
      const newExpense = await this.userService.createExpense({
        userId: userId,
        date,
        amount,
        category,
        description,
      });
      // console.log("new expense: ",newExpense)
      res.status(HttpStatusCode.CREATED).json(newExpense);
    } catch (error) {
      console.error('Error creating expense:', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Error creating expense' });
    }
  }

  async createGroup(req: Request, res: Response): Promise<Response> {
    try {
      console.log('req.body : ',req.body)
      const {userId, name, members } = req.body;
      if(!userId || !name || !members){
        return res.status(HttpStatusCode.BAD_REQUEST).json({error: 'All fields are required!'})
      }
      const newGroup = await this.userService.createGroup(userId,name,members)
      console.log("newGroup in contrllr : ",newGroup)
      return res.status(HttpStatusCode.CREATED).json(newGroup);
    } catch (error) {
      console.error('Error creating group:', error);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
  }


  async getUserGroups(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'userId is required' });
      }
      const groups = await this.userService.getUserGroups(userId);
      if (groups.length === 0) {
        return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'No groups found for this user' });
      }
      console.log("groups-contrll : ",groups)
      return res.status(HttpStatusCode.OK).json({ groups });
    } catch (error) {
      console.error('Error fetching groups:', error);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
  }

  async addMember(req:Request,res:Response):Promise<void>{
    try {
      const { groupId } = req.params;
      const { memberEmail } = req.body;

      const updatedGroup = await this.userService.addMember(groupId, memberEmail);

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: 'Member added successfully',
        groups: updatedGroup
      });
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to add member'
      });
    }
  }

  async addExpenseInGroup(req: Request, res: Response): Promise<Response> {
    try {
      const { groupId } = req.params;
      const expenseData: IGroupExpense = req.body;
      console.log("expenseData-contrll : ",expenseData)
      if (!expenseData.title || !expenseData.totalAmount || !expenseData.paidBy) {
        console.log("^^^missing required filelds-contllr^^^")
        return res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, error: 'Missing required fields' });
      }
      const updatedGroup = await this.userService.addExpenseInGroup(groupId, expenseData);
      console.log("updatedGroup-contrll : ",updatedGroup)
      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: 'Expense added successfully',
        groups: updatedGroup,
      });
    } catch (err) {
      console.error(err);
      return res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, error: 'Failed to update group' });
    }
  }

  async bookslot(req:Request,res:Response):Promise<void>{
    try{
      const {slotId,userId} = req.body
      // console.log("req.body : ",req.body)
      const bookedSlot = await this.userService.bookslot(slotId,userId)
      // console.log("bookedSlot-contrll :",bookedSlot)
      res.status(HttpStatusCode.OK).json({message:"slot booked successfully",slot:bookedSlot})
    }catch(err){
      console.error(err)
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred' 
      res.status(HttpStatusCode.NOT_FOUND).json({message:errorMessage})
    }
  }

  
}
