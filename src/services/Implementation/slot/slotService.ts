import { inject, injectable } from "tsyringe";
import { ISlotRepository } from "../../../repositories/Interface/ISlotRepository";
import { ISlotService } from "../../Interface/slot/ISlotService";
import { Slot } from "../../../models/slotSchema";
import { IUserRepository } from "../../../repositories/Interface/IUserRepository";

@injectable()
export default class SlotService implements ISlotService{
    private slotRepository: ISlotRepository
    private userRepository: IUserRepository

    constructor(
        @inject('ISlotRepository') slotRepository:ISlotRepository,
        @inject('IUserRepository') userRepository:IUserRepository
    ){
        this.slotRepository = slotRepository
        this.userRepository = userRepository
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
}