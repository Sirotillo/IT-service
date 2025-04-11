const Joi = require("joi");

exports.ownerValidation = (body) => {
  const schema = Joi.object({
    company_name: Joi.string().required().messages({
      "any.required": "Kompaniya nomi majburiy",
      "string.base": "Kompaniya nomi matn bo‘lishi kerak",
    }),
    phone_number: Joi.string()
      .pattern(/^\+998\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/)
      .required()
      .messages({
        "string.pattern.base": "Telefon raqam formati notog'ri",
        "any.required": "Telefon raqam majburiy",
      }),
    token: Joi.string(),
    email: Joi.string().email().required().messages({
      "string.email": "Iltimos, to‘g‘ri email formatini kiriting",
      "any.required": "Email majburiy",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Parol kamida 6 ta belgidan iborat bo‘lishi kerak",
      "any.required": "Parol majburiy",
    }),
    status: Joi.boolean().default(false),
    website: Joi.string().uri().required().messages({
      "string.uri": "Website to‘g‘ri URL formatida bo‘lishi kerak",
      "any.required": "Website majburiy",
    }),
    addres: Joi.string().required().messages({
      "any.required": "Manzil majburiy",
      "string.base": "Manzil matn bo‘lishi kerak",
    }),
  });

  return schema.validate(body, { abortEarly: false });
};
