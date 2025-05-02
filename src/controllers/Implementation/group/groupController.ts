import { Request, Response } from 'express'
import { inject, injectable } from "tsyringe";
import { IGroupService } from "../../../services/Interface/group/IGroupService";
import { IGroupController } from "../../Interface/group/IGroupController";
import { HttpStatusCode } from '../../../utils/httpStatusCode';
import { messageConstants } from '../../../utils/messageConstants';
import { IGroupExpense } from '../../../entities/groupEntities';
import { IUserService } from '../../../services/Interface/user/IUserService';
import { ACCESSTOKEN_SECRET, BACKENDENDPOINT, CLIENTURL } from '../../../config/env';
import jwt, { JwtPayload } from "jsonwebtoken";


const BASEURL = `${BACKENDENDPOINT}/user`
@injectable()
export default class GroupController implements IGroupController {
  private _groupService: IGroupService
  private _userService: IUserService

  constructor(
    @inject('IGroupService') groupService: IGroupService,
    @inject('IUserService') userService: IUserService
  ) {
    this._groupService = groupService
    this._userService = userService
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
        return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'No groups found for this user' });
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
        return res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: 'Missing required fields' });
      }
      const updatedGroup = await this._groupService.addExpenseInGroup(groupId, expenseData);
      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: 'Expense added successfully',
        groups: updatedGroup,
      });
    } catch (err:any) {
      console.error('error adding expense in group - contrller : ',err.message)
      return res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: err.message||'Failed to update group' });
    }
  }


  async removeMember(req: Request, res: Response): Promise<Response> {
    try {
      const { groupId } = req.params;
      const { memberEmail } = req.body
      if (!groupId || !memberEmail) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: 'Group ID and member email are required' });
      }
      const result = await this._groupService.removeMember(groupId, memberEmail);
      if (result.success) {
        return res.status(HttpStatusCode.OK).json(result);
      } else {
        return res.status(HttpStatusCode.BAD_REQUEST).json(result);
      }
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Failed to remove member' });
    }
  }


  async leaveGroup(req: Request, res: Response): Promise<Response> {
    try {
      const { groupId } = req.params;
      const { userEmail,userId } = req.body;
      if (!groupId || !userEmail) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: 'Group ID and user email are required' });
      }
      const result = await this._groupService.leaveGroup(groupId, userEmail,userId);
      if (result.success) {
        return res.status(HttpStatusCode.OK).json(result);
      } else {
        return res.status(HttpStatusCode.BAD_REQUEST).json(result);
      }
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Failed to leave group' });
    }
  }


  async settleDebt(req: Request, res: Response): Promise<Response> {
    try {
      const { groupId } = req.params;
      const { settlementData } = req.body;
      if (!groupId || !settlementData) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: 'Group ID and settlement details are required' });
      }
      const result = await this._groupService.settleDebt(groupId, settlementData);
      if (result.success) {
        return res.status(HttpStatusCode.OK).json(result);
      } else {
        return res.status(HttpStatusCode.BAD_REQUEST).json(result);
      }
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Failed to settle debt' });
    }
  }


  async groupInvite(req: Request, res: Response): Promise<Response> {
    const { groupId } = req.params;
    const { email } = req.query;
  
  
    if (!email || typeof email !== "string") {
      console.warn("⚠️ Missing or invalid email in query:", email);
      return res.status(HttpStatusCode.BAD_REQUEST).json("Email is required");
    }
  
    try {
      const user = await this._userService.findByEmail(email);  
      if (!user) {
        const redirectAfterRegister = encodeURIComponent(`/accept-invite?groupId=${groupId}&email=${email}`);
        const registerRedirect = `${CLIENTURL}/register?redirect=${redirectAfterRegister}`;
        return res.status(HttpStatusCode.OK).json({
          status: 'redirect',
          redirectTo: registerRedirect,
        });
      }
  
      const accessToken = req.cookies?.accessToken;  
      let isAuthenticated = false;
  
      if (accessToken) {
        try {
          const decoded = jwt.verify(accessToken, ACCESSTOKEN_SECRET as string) as JwtPayload;
          isAuthenticated = decoded?.email === email;
        } catch (err) {
          console.error("❌ Token verification failed:", err);
          isAuthenticated = false;
        }
      }
  
      if (!isAuthenticated) {
        const redirectAfterLogin = encodeURIComponent(`/accept-invite?groupId=${groupId}&email=${email}`);
        const loginRedirect = `${CLIENTURL}/login?redirect=${redirectAfterLogin}`;
        return res.status(HttpStatusCode.OK).json({
          status: 'redirect',
          redirectTo: loginRedirect,
        });
      }
      await this._groupService.groupInvite(groupId, email);
      return res.status(HttpStatusCode.OK).json({
        status: 'success'
      });
  
    } catch (err) {
      console.error("💥 Error in groupInvite handler:", err);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json("Something went wrong");
    }
  }
  

}