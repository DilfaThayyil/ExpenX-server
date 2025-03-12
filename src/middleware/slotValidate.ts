import { Request, Response, NextFunction } from "express";
import { slotValidation } from "../utils/slotValidator";
import { HttpStatusCode } from "../utils/httpStatusCode";

export const validateSlot = (req: Request, res: Response, next: NextFunction) => {
  const { error } = slotValidation.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({ errors: error.details.map((e) => e.message) });
  }

  next();
};
