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
    role: Joi.string().valid("superadmin", "admin").required().messages({
      "any.only": "Role faqat 'superadmin' yoki 'admin' bo‘lishi mumkin",
      "any.required": "Role majburiy",
    }),
    is_creator: Joi.boolean().required().messages({
      "boolean.base": "is_creator faqat true yoki false bo‘lishi mumkin",
      "any.required": "is_creator majburiy",
    }),
    status: Joi.boolean().required().messages({
      "boolean.base": "status faqat true yoki false bo‘lishi kerak",
      "any.required": "status majburiy",
    }),
  });

  return schema.validate(body, { abortEarly: false });
};
