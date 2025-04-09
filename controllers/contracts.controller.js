const { errorHandler } = require("../helpers/error_handler");
const Clients = require("../Models/clients.model");
const Contracts = require("../Models/contracts.model");
const Products = require("../Models/products.model");
const { contractValidation } = require("../validations/contracts.validation");

const addNewContract = async (req, res) => {
  try {
    const { error, value } = contractValidation(req.body);
    if (error) {
      return errorHandler(error, res);
    }

    const newContract = await Contracts.create(value);
    res.status(200).send({ message: "New contract added", newContract });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAllContracts = async (req, res) => {
  try {
    const contracts = await Contracts.findAll({
      include: [{ model: Clients }, { model: Products }],
    });
    res.status(200).send({ contracts });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findByIdContracts = async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await Contracts.findByPk(id);
    if (!contract) {
      return res.status(404).send({ message: "Contract not found" });
    }
    res.status(200).send({ contract });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateContract = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = contractValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }

    const [updated] = await Contracts.update(value, {
      where: { id },
      returning: true,
    });

    if (updated) {
      const updatedContract = await Contracts.findByPk(id);
      res.status(200).send({ message: "Contract updated", updatedContract });
    } else {
      res.status(404).send({ message: "Contract not found" });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteContract = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Contracts.destroy({ where: { id } });

    if (deleted) {
      res.status(200).send({ message: "Contract deleted" });
    } else {
      res.status(404).send({ message: "Contract not found" });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewContract,
  findAllContracts,
  findByIdContracts,
  updateContract,
  deleteContract,
};
