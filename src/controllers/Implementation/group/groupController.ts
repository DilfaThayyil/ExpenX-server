import { Request, Response } from 'express'
import { inject, injectable } from "tsyringe";
import { IGroupService } from "../../../services/Interface/group/IGroupService";
import { IGroupController } from "../../Interface/group/IGroupController";
import { HttpStatusCode } from '../../../utils/httpStatusCode';
import { messageConstants } from '../../../utils/messageConstants';
import { IGroupExpense } from '../../../entities/groupEntities';

@injectable()
export default class GroupController implements IGroupController {
  private _groupService: IGroupService

  constructor(@inject('IGroupService') groupService: IGroupService) {
    this._groupService = groupService
  }

  async createGroup(req: Request, res: Response): Promise<Response> {
    try {
      const { userId, name, members, email } = req.body;
      if (!userId || !name || !members || !email) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'All fields are required!' })
      }
      const newGroup = await this._groupService.createGroup(userId, name, members, email)
      return res.status(HttpStatusCode.CREATED).json(newGroup);
    } catch (error) {
      console.error('Error creating group:', error);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: messageConstants.INTERNAL_ERROR });
    }
  }


  async getUserGroups(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'userId is required' });
      }
      const groups = await this._groupService.getUserGroups(userId);
      if (groups.length === 0) {
        return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'No groups found for this _user' });
      }
      return res.status(HttpStatusCode.OK).json({ groups });
    } catch (error) {
      console.error('Error fetching groups:', error);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: messageConstants.INTERNAL_ERROR });
    }
  }

  async addMember(req: Request, res: Response): Promise<void> {
    try {
      const { groupId } = req.params;
      const { memberEmail } = req.body;
      const updatedGroup = await this._groupService.addMember(groupId, memberEmail);
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
      if (!expenseData.title || !expenseData.totalAmount || !expenseData.paidBy) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, error: 'Missing required fields' });
      }
      const updatedGroup = await this._groupService.addExpenseInGroup(groupId, expenseData);
      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: 'Expense added successfully',
        groups: updatedGroup,
      });
    } catch (err) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, error: 'Failed to update group' });
    }
  }


  // async removeMember(req: Request, res: Response): Promise<Response> {
  //   try {
  //     const { groupId } = req.params;
  //     const { memberEmail } = req.body
  //     if (!groupId || !memberEmail) {
  //       return res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: 'Group ID and member email are required' });
  //     }
  //     const result = await this._groupService.removeMember(groupId, memberEmail);
  //     if (result.success) {
  //       return res.status(HttpStatusCode.OK).json(result);
  //     } else {
  //       return res.status(HttpStatusCode.BAD_REQUEST).json(result);
  //     }
  //   } catch (error) {
  //     return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Failed to remove member' });
  //   }
  // }


  // async leaveGroup(req: Request, res: Response): Promise<Response> {
  //   try {
  //     const { groupId } = req.params;
  //     const { userEmail } = req.body;
  //     if (!groupId || !userEmail) {
  //       return res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: 'Group ID and user email are required' });
  //     }
  //     const result = await this._groupService.leaveGroup(groupId, userEmail);
  //     if (result.success) {
  //       return res.status(HttpStatusCode.OK).json(result);
  //     } else {
  //       return res.status(HttpStatusCode.BAD_REQUEST).json(result);
  //     }
  //   } catch (error) {
  //     return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Failed to leave group' });
  //   }
  // }


  // async settleDebt(req: Request, res: Response): Promise<Response> {
  //   try {
  //     const { groupId } = req.params;
  //     const { settlementData } = req.body;
  //     if (!groupId || !settlementData) {
  //       return res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: 'Group ID and settlement details are required' });
  //     }
  //     const result = await this._groupService.settleDebt(groupId, settlementData);
  //     if (result.success) {
  //       return res.status(HttpStatusCode.OK).json(result);
  //     } else {
  //       return res.status(HttpStatusCode.BAD_REQUEST).json(result);
  //     }
  //   } catch (error) {
  //     return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Failed to settle debt' });
  //   }
  // }


  // async groupInvite(req: Request, res: Response): Promise<Response> {
  //   const { groupId } = req.params;
  //   const { email } = req.query;
  //   if (!email || typeof email !== "string") {
  //     return res.status(HttpStatusCode.BAD_REQUEST).json("Email is required");
  //   }
  //   try {
  //     const user = await this._userService.findByEmail(email); 
  //     const encodedRedirectUrl = encodeURIComponent(`/group/${groupId}`);
  //     if (!user) {
  //       res.redirect(`/register?email=${encodeURIComponent(email)}&redirect=${encodedRedirectUrl}`);
  //     }
  //     const isAuthenticated = req.cookies?.accessToken; 
  //     if (!isAuthenticated) {
  //       res.redirect(`/login?email=${encodeURIComponent(email)}&redirect=${encodedRedirectUrl}`);
  //     }
  //     await this._groupService.addUserToGroup(groupId, user); 
  
  //     res.redirect(`/group/${groupId}`);
  //   } catch (err) {
  //     console.error(err);
  //     return res.status(500).json("Something went wrong");
  //   }
  // }
  


}