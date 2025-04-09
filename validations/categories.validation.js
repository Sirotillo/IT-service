const Joi = require("joi");

exports.categorieValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "any.required": "Categorie nomi majburiy",
      "string.base": "Categrie nomi matn bo‘lishi kerak",
    }),
    description: Joi.string(),
    is_active: Joi.boolean().default(false),
    icon: Joi.string(),
  });

  return schema.validate(body, { abortEarly: false });
};
