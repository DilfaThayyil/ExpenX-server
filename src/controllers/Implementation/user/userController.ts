import { inject, injectable } from 'tsyringe';
import { IUserController } from '../../Interface/user/IUserController';
import { IUserService } from '../../../services/Interface/user/IUserService';
import cloudinary from '../../../config/cloudinaryConfig';
import { Request, Response } from 'express';
import { HttpStatusCode } from '../../../utils/httpStatusCode';
import { IGroupExpense } from '../../../models/groupSchema';

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
      // console.log("result : ", result)
      const imageUrl = result.secure_url;
      // console.log("imageUrl : ", imageUrl)
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
      // console.log("updatedUser : ",updatedUser)
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Error updating user' });
    }
  }


  async getExpenses(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params; 
      const expenses = await this.userService.getExpensesByUserId(userId);
      res.status(200).json(expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).json({ error: 'Error fetching expenses' });
    }
  }

  async createExpense(req: Request, res: Response): Promise<void> {
    try {
      // console.log('dillll')
      const {userId} = req.params
      const { date, amount, category, description } = req.body;
      if (!date || !amount || !category || !description) {
        res.status(400).json({ error: 'All fields are required' });
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
      res.status(201).json(newExpense);
    } catch (error) {
      console.error('Error creating expense:', error);
      res.status(500).json({ error: 'Error creating expense' });
    }
  }

  async createGroup(req: Request, res: Response): Promise<void> {
    try {
      // console.log('req.body : ',req.body)
      const { name, members, splitMethod } = req.body;
      if (!name || !Array.isArray(members) || members.length === 0 || !splitMethod) {
        res.status(400).json({ error: 'All fields are required (name, members, splitMethod).' });
        return;
      }
      const newGroup = await this.userService.createGroup({
        name,
        members,
        splitMethod,
      });
      // console.log("newGroup in contrllr : ",newGroup)
      res.status(201).json(newGroup);
    } catch (error) {
      console.error('Error creating group:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }


  async getUserGroups(req: Request, res: Response): Promise<void> {
    try {
      // console.log("req.parmas: ",req.params)
      const { email } = req.params;
      if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
      }
      const groups = await this.userService.getUserGroups(email);
      if (groups.length === 0) {
        res.status(404).json({ message: 'No groups found for this user' });
        return;
      }
      // console.log("groups: ",groups)
      res.status(200).json({ groups });
    } catch (error) {
      console.error('Error fetching groups:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async addMember(req:Request,res:Response):Promise<void>{
    try {
      const { groupId } = req.params;
      const { memberEmail } = req.body;

      const updatedGroup = await this.userService.addMember(groupId, memberEmail);

      res.status(200).json({
        success: true,
        message: 'Member added successfully',
        data: updatedGroup
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to add member'
      });
    }
  }

  async addExpenseInGroup(req: Request, res: Response): Promise<void> {
    try {
      const { groupId } = req.params;
      const expenseData: IGroupExpense = req.body;
  
      if (!expenseData.description || !expenseData.amount || !expenseData.paidBy) {
         res.status(400).json({ success: false, error: 'Missing required fields' });
      }
  
      const updatedGroup = await this.userService.addExpenseInGroup(groupId, expenseData);
      res.status(200).json({
        success: true,
        message: 'Group updated successfully',
        data: { group: updatedGroup },
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, error: 'Failed to update group' });
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
