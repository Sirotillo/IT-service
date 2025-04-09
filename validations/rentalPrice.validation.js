const Joi = require("joi");

exports.rentalPriceValidation = (body) => {
  const schema = Joi.object({
    monthly_price: Joi.number().required(),
    yearly_price: Joi.number().required(),
  });

  return schema.validate(body, { abortEarly: false });
};

// const Joi = require("joi");

// exports.rentalPriceValidation = (body) => {
//   const schema = Joi.object({
//     monthly_price: Joi.number().required(),
//     yearly_price: Joi.number().required(),
//   }).unknown(true);

//   const { error, value } = schema.validate(body, { abortEarly: false });
//   if (error) {
//     console.log("Validation error:", error.details); // Xatolikni konsolda tekshirib chiqing
//     return {
//       error: error.details.map((err) => err.message),
//     };
//   }
//   return { value };
// };

