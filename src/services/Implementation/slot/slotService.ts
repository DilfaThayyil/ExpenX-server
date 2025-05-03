import { inject, injectable } from "tsyringe";
import { ISlotRepository } from "../../../repositories/Interface/ISlotRepository";
import { ISlotService } from "../../Interface/slot/ISlotService";
import { Slot } from "../../../models/slotSchema";
import { IUserRepository } from "../../../repositories/Interface/IUserRepository";
import { Types } from "mongoose";
import { IAdvisorRepository } from "../../../repositories/Interface/IAdvisorRepository";
import { IWalletRepository } from "../../../repositories/Interface/IWalletRepository";
import { sendBookingConfirmationEmail } from "../../../utils/email/slotBookingConfirmEmail";

@injectable()
export default class SlotService implements ISlotService {
  private _slotRepository: ISlotRepository
  private _userRepository: IUserRepository
  private _advisorRepository: IAdvisorRepository
  private _walletRepository: IWalletRepository

  constructor(
    @inject('ISlotRepository') slotRepository: ISlotRepository,
    @inject('IUserRepository') userRepository: IUserRepository,
    @inject('IAdvisorRepository') advisorRepository: IAdvisorRepository,
    @inject('IWalletRepository') walletRepository: IWalletRepository
  ) {
    this._slotRepository = slotRepository
    this._userRepository = userRepository
    this._advisorRepository = advisorRepository
    this._walletRepository = walletRepository
  }

  async bookslot(slotId: string, userId: string): Promise<Slot> {
    const slot = await this._slotRepository.findSlot(slotId);
    if (!slot) throw new Error("Slot not found");
    const user = await this._userRepository.findUserById(userId);
    if (!user) throw new Error("User not found");
    const slotData: Partial<Slot> = {
      bookedBy: new Types.ObjectId(user._id),
      status: 'Booked'
    };
    const bookedSlot = await this._slotRepository.bookSlot(slotId, slotData as Slot);
    if (!bookedSlot) {
      throw new Error("This slot has already been booked by someone else.");
    }
    await sendBookingConfirmationEmail(user.email, user.username, slot.date, slot.startTime);
    return bookedSlot;
  }

  async fetchSlotsByUser(userId: string, page: number, limit: number,search:string): Promise<{ slots: Slot[], totalPages: number }> {
    const result = await this._slotRepository.fetchSlotsByUser(userId, page, limit,search);
    return result
  }

  async createSlot(id: string, slotData: Slot): Promise<Slot> {
    try {
      const isExist = await this._slotRepository.findExistingSlot(slotData.date, slotData.startTime);
      if (isExist) {
        throw new Error("A slot already exists for the given date and time.");
      }
      const advisor = await this._advisorRepository.findUserById(id);
      if (!advisor) throw new Error('Advisor not found');
      
      const creatingSlot: Partial<Slot> = {
        advisorId: new Types.ObjectId(advisor._id),
        date: slotData.date,
        startTime: slotData.startTime,
        fee: slotData.fee,
        duration: slotData.duration,
        maxBookings: slotData.maxBookings,
        status: slotData.status,
        bookedBy: null,
        location: slotData.location,
        locationDetails: slotData.locationDetails,
        description: slotData.description
      };
      const slot = await this._slotRepository.createSlot(creatingSlot as Slot);
      return slot;
    } catch (err) {
      console.error('Error creating slot:', err);
      throw err;
    }    
  }


  async fetchSlots(advisorId: string, page: number, limit: number, search: string): Promise<{ slots: Slot[] | Slot, totalPages: number }> {
    // eslint-disable-next-line no-useless-catch
    try {
      const { slots, totalSlots } = await this._slotRepository.fetchSlots(advisorId, page, limit, search)
      const totalPages = Math.ceil(totalSlots / limit)
      return { slots, totalPages }
    } catch (err) {
      throw err
    }
  }

  async updateSlot(slotId: string, slot: Slot): Promise<Slot | null> {
    try {
      const existingSlot = await this._slotRepository.findSlotById(slotId)
      if (!existingSlot) {
        throw new Error('slot is not found')
      }
      const updatedSlot = await this._slotRepository.updateSlot(slotId, slot)
      return updatedSlot
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async deleteSlot(slotId: string): Promise<boolean> {
    try {
      const isDeleted = await this._slotRepository.deleteSlot(slotId)
      if (!isDeleted) {
        throw new Error('Cant found or delete the slot')
      }
      return isDeleted
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async getBookedSlotsForAdvisor(advisorId: string, page: number, limit: number, search: string): Promise<{ bookedSlots: Slot[] | Slot; totalPages: number }> {
    try {
      const { bookedSlots, totalSlots } = await this._slotRepository.getBookedSlotsForAdvisor(advisorId, page, limit, search)
      if (!bookedSlots) {
        throw new Error('No slots found')
      }
      const totalPages = Math.ceil(totalSlots / limit)
      return { bookedSlots, totalPages }
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async cancelBookedSlot(slotId: string, advisorId: string, userId: string): Promise<Slot | null> {
    const slot = await this._slotRepository.findSlotById(slotId);
    if (!slot) throw new Error("Slot not found");
    const slotAmount = slot.fee;
    await this._walletRepository.updateWallet(userId, slotAmount);
    await this._walletRepository.updateWallet(advisorId, -slotAmount);
    return await this._slotRepository.updateSlotStatus(slotId);
  }
}