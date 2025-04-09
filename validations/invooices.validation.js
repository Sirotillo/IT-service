const Joi = require("joi");

exports.invooiceValidation = (body) => {
  const schema = Joi.object({
    paid_date: Joi.date().required().messages({
      "any.required": "Tolash vaqtini kiritish majburiy",
      "string.base": "Tolash vaqti date bo‘lishi kerak",
    }),
    amount: Joi.number(),
    status: Joi.string().valid("paid", "unpaid"),
    payment_method: Joi.string().valid("humo", "uzcard", "cash"),
    contractId: Joi.number(),
  });

  return schema.validate(body, { abortEarly: false });
};
