import {Request,Response} from 'express'
import { inject, injectable } from "tsyringe";
import { IGroupService } from "../../../services/Interface/group/IGroupService";
import { IGroupController } from "../../Interface/group/IGroupController";
import { HttpStatusCode } from '../../../utils/httpStatusCode';
import { messageConstants } from '../../../utils/messageConstants';
import { IGroupExpense } from '../../../entities/groupEntities';

@injectable()
export default class GroupController implements IGroupController{
    private _groupService: IGroupService

    constructor(@inject('IGroupService') groupService: IGroupService){
        this._groupService = groupService
    }

    async createGroup(req: Request, res: Response): Promise<Response> {
        try {
          const { userId, name, members } = req.body;
          if (!userId || !name || !members) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'All fields are required!' })
          }
          const newGroup = await this._groupService.createGroup(userId, name, members)
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
          console.error(err);
          return res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, error: 'Failed to update group' });
        }
      }
    
}