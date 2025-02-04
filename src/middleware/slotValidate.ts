import { Request, Response, NextFunction } from "express";
import { slotValidation } from "../utils/slotValidator";

export const validateSlot = (req: Request, res: Response, next: NextFunction) => {
  const { error } = slotValidation.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({ errors: error.details.map((e) => e.message) });
  }

  next();
};
