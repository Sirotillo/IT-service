const Joi = require("joi");

exports.contractValidation = (body) => {
  const schema = Joi.object({
    start_date: Joi.date().required().messages({
      "any.required": "Boshlash vaqti majburiy",
      "string.base": "Boshlash vaqti date bo‘lishi kerak",
    }),
    end_date: Joi.date().required().messages({
      "any.required": "Tugash vaqti majburiy",
      "string.base": "Tugash vaqti date bo‘lishi kerak",
    }),
    status: Joi.boolean(),
    payment_amount: Joi.number(),
    notes: Joi.string(),
    clientId: Joi.number().required(),
    productId: Joi.number().required(),
  });

  return schema.validate(body, { abortEarly: false });
};
