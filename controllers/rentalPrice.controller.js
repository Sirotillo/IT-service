const { log } = require("winston");
const { errorHandler } = require("../helpers/error_handler");
const RentalPrices = require("../Models/rentalPrice.model");
const {
  rentalPriceValidation,
} = require("../validations/rentalPrice.validation");

const addNewRentalPrice = async (req, res) => {
  try {
    const { error, value } = rentalPriceValidation(req.body);
    if (error) {
      return errorHandler(error, res);
    }

    const newRentalPrice = await RentalPrices.create(value);
    res.status(200).send({ message: "New rentalPrice added", newRentalPrice });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAllRentalPrices = async (req, res) => {
  try {
    const rentalPrices = await RentalPrices.findAll();
    res.status(200).send({ rentalPrices });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findByIdRentalPrices = async (req, res) => {
  try {
    const { id } = req.params;
    const rentalPrice = await RentalPrices.findByPk(id);
    if (!rentalPrice) {
      return res.status(404).send({ message: "RentalPrice not found" });
    }
    res.status(200).send({ rentalPrice });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateRentalPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = rentalPriceValidation(req.body);
    console.log(value);
    
    if (error) {
      return errorHandler(error, res);
    }

    const updated = await RentalPrices.update(value, {
      where: { id },
      returning: true,
    });

    if (updated) {
      const updatedRentalPrice = await RentalPrices.findByPk(id);
      res
        .status(200)
        .send({ message: "RentalPrice updated", updatedRentalPrice });
    } else {
      res.status(404).send({ message: "RentalPrice not found" });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteRentalPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await RentalPrices.destroy({ where: { id } });

    if (deleted) {
      res.status(200).send({ message: "RentalPrice deleted" });
    } else {
      res.status(404).send({ message: "RentalPrice not found" });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewRentalPrice,
  findAllRentalPrices,
  findByIdRentalPrices,
  updateRentalPrice,
  deleteRentalPrice,
};
