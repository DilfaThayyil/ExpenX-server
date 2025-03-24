import { inject, injectable } from "tsyringe";
import { ISlotRepository } from "../../../repositories/Interface/ISlotRepository";
import { ISlotService } from "../../Interface/slot/ISlotService";
import { Slot } from "../../../models/slotSchema";
import { IUserRepository } from "../../../repositories/Interface/IUserRepository";
import { Types } from "mongoose";
import { IAdvisorRepository } from "../../../repositories/Interface/IAdvisorRepository";

@injectable()
export default class SlotService implements ISlotService {
  private slotRepository: ISlotRepository
  private userRepository: IUserRepository
  private advisorRepository: IAdvisorRepository

  constructor(
    @inject('ISlotRepository') slotRepository: ISlotRepository,
    @inject('IUserRepository') userRepository: IUserRepository,
    @inject('IAdvisorRepository') advisorRepository: IAdvisorRepository
  ) {
    this.slotRepository = slotRepository
    this.userRepository = userRepository
    this.advisorRepository = advisorRepository
  }

  async bookslot(slotId: string, userId: string): Promise<Slot | null> {
    try {
      const slot = await this.slotRepository.findSlot(slotId);
      if (!slot) throw new Error("Slot not found");
      if (slot.status === "Booked") throw new Error("Slot is already booked");

      const user = await this.userRepository.findUserById(userId);
      if (!user) throw new Error("User not found");

      slot.status = "Booked";
      slot.bookedBy = {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic
      };

      const bookedSlot = await this.slotRepository.bookSlot(slotId, slot);
      return bookedSlot;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  async fetchSlotsByUser(userId: string, page: number, limit: number): Promise<{ slots: Slot[], totalPages: number }> {
    const result = await this.slotRepository.fetchSlotsByUser(userId, page, limit);
    return result
  }

  async createSlot(id: string, slotData: Slot): Promise<Slot> {
    try {
      const isExist = await this.slotRepository.findExistingSlot(slotData.date, slotData.startTime);
      if (isExist) {
        throw new Error("A slot already exists for the given date and time.");
      }
      const advisor = await this.advisorRepository.findUserById(id);
      if (!advisor) throw new Error('Advisor not found');

      const creatingSlot: Partial<Slot> = {
        advisorId: {
          _id: new Types.ObjectId(advisor._id),
          username: advisor.username,
          email: advisor.email,
          profilePic: advisor.profilePic
        },
        date: slotData.date,
        startTime: slotData.startTime,
        fee: slotData.fee,
        duration: slotData.duration,
        maxBookings: slotData.maxBookings,
        status: slotData.status,
        bookedBy: {}, // Empty object by default
        location: slotData.location,
        locationDetails: slotData.locationDetails,
        description: slotData.description
      };

      const slot = await this.slotRepository.createSlot(creatingSlot as Slot);
      return slot;
    } catch (err) {
      console.error('Error creating slot:', err);
      throw new Error('Error creating slot');
    }
  }


  async fetchSlots(advisorId: string, page: number, limit: number): Promise<{ slots: Slot[] | Slot, totalPages: number }> {
    // eslint-disable-next-line no-useless-catch
    try {
      const { slots, totalSlots } = await this.slotRepository.fetchSlots(advisorId, page, limit)
      const totalPages = Math.ceil(totalSlots / limit)
      return { slots, totalPages }
    } catch (err) {
      throw err
    }
  }

  async updateSlot(slotId: string, slot: Slot): Promise<Slot | null> {
    try {
      const existingSlot = await this.slotRepository.findSlotById(slotId)
      if (!existingSlot) {
        throw new Error('slot is not found')
      }
      const updatedSlot = await this.slotRepository.updateSlot(slotId, slot)
      return updatedSlot
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async deleteSlot(slotId: string): Promise<boolean> {
    try {
      const isDeleted = await this.slotRepository.deleteSlot(slotId)
      if (!isDeleted) {
        throw new Error('Cant found or delete the slot')
      }
      return isDeleted
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async getBookedSlotsForAdvisor(advisorId: string, page: number, limit: number): Promise<{ bookedSlots: Slot[] | Slot; totalPages: number }> {
    try {
      const { bookedSlots, totalSlots } = await this.slotRepository.getBookedSlotsForAdvisor(advisorId, page, limit)
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
}