const Joi = require("joi");

exports.paymentValidation = (body) => {
  const schema = Joi.object({
    payment_method: Joi.string().valid("humo", "uzcard", "cash"),
    amount: Joi.number(),
    paid_at: Joi.date(),
    description: Joi.string(),
    contractId: Joi.number(),
  });

  return schema.validate(body, { abortEarly: false });
};
