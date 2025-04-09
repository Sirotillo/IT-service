const { errorHandler } = require("../helpers/error_handler");
const Contracts = require("../Models/contracts.model");
const Invooices = require("../Models/invoices.model");
const { invooiceValidation } = require("../validations/invooices.validation");

const addNewInvooice = async (req, res) => {
  try {
    const { error, value } = invooiceValidation(req.body);
    if (error) {
      return errorHandler(error, res);
    }

    const newInvooice = await Invooices.create(value);
    res.status(200).send({ message: "New invooice added", newInvooice });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAllInvooices = async (req, res) => {
  try {
    const invooices = await Invooices.findAll({ include: Contracts });
    res.status(200).send({ invooices });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findByIdInvooices = async (req, res) => {
  try {
    const { id } = req.params;
    const invooice = await Invooices.findByPk(id);
    if (!invooice) {
      return res.status(404).send({ message: "Invooice not found" });
    }
    res.status(200).send({ invooice });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateInvooice = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = invooiceValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }

    const [updated] = await Invooices.update(value, {
      where: { id },
      returning: true,
    });

    if (updated) {
      const updatedInvooice = await Invooices.findByPk(id);
      res.status(200).send({ message: "Invooice updated", updatedInvooice });
    } else {
      res.status(404).send({ message: "Invooice not found" });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteInvooice = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Invooices.destroy({ where: { id } });

    if (deleted) {
      res.status(200).send({ message: "Invooice deleted" });
    } else {
      res.status(404).send({ message: "Invooice not found" });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewInvooice,
  findAllInvooices,
  findByIdInvooices,
  updateInvooice,
  deleteInvooice,
};
