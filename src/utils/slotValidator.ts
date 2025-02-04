import Joi from "joi";

export const slotValidation = Joi.object({
  date: Joi.string().isoDate().required(),
  startTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
  endTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
  duration: Joi.number().valid(30, 60).required(),
  maxBookings: Joi.number().integer().min(1).max(10).required(),
  status: Joi.string().valid("Active", "Inactive").required(),
  location: Joi.string().valid("Virtual", "Physical").required(),
  locationDetails: Joi.string().when("location", {
    is: "Physical",
    then: Joi.string().required(),
    otherwise: Joi.optional(),
  }),
  description: Joi.string().optional().max(300),
});
