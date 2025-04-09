const Joi = require("joi");

exports.supportTicketsValidation = (body) => {
  const schema = Joi.object({
    clientId: Joi.number(),
    subject: Joi.string().required().messages({
      "any.required": "Mavzu nomi majburiy",
      "string.base": "Mavzu nomi matn bo‘lishi kerak",
    }),
    message: Joi.string().messages({
      "string.base": "Xabar matn bo‘lishi kerak",
    }),
    status: Joi.string().valid("waiting", "answered").default("waiting"),
  });

  return schema.validate(body, { abortEarly: false });
};
