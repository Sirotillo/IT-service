const Joi = require("joi");

exports.adminValidation = (body) => {
  const schema = Joi.object({
    username: Joi.string().required().messages({
      "any.required": "Ism majburiy",
    }),
    phone: Joi.string()
      .pattern(/^\+998\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/)
      .required()
      .messages({
        "string.pattern.base": "Telefon raqam formati notog'ri",
        "any.required": "Telefon raqam majburiy",
      }),
    email: Joi.string().email().required().messages({
      "string.email": "Iltimos, to‘g‘ri email formatini kiriting",
      "any.required": "Email majburiy",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Parol kamida 6 ta belgidan iborat bo‘lishi kerak",
      "any.required": "Parol majburiy",
    }),
    is_creator: Joi.boolean(),
    status: Joi.boolean(),
  });

  return schema.validate(body, { abortEarly: false });
};
