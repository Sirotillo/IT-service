const Joi = require("joi");

exports.productValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    price: Joi.number(),
    status: Joi.boolean(),
    stock_quantity: Joi.number(),
    image_url: Joi.string(),
    categoryId: Joi.number(),
    ownerId: Joi.number(),
    rentalPriceId: Joi.number()
  });

  return schema.validate(body, { abortEarly: false });
};
