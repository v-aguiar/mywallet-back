import Joi from "joi";

export const user_schema = new Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirm: Joi.string().valid(Joi.ref("password")),
});

export const transaction_schema = new Joi.object({
  type: Joi.string().valid("income", "expense").required(),
  amount: Joi.string().required(),
  description: Joi.string().max(30),
});
