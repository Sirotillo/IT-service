const Joi = require("joi");

exports.clientValidation = (body) => {
  const schema = Joi.object({
    full_name: Joi.string().required().messages({
      "any.required": "Ism majburiy",
    }),
    phone_number: Joi.string()
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
    password: Joi.string().required(),
    status: Joi.boolean(),
    token: Joi.string(),
  });

  return schema.validate(body, { abortEarly: false });
};
