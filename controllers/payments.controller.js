const { errorHandler } = require("../helpers/error_handler");
const Contracts = require("../Models/contracts.model");
const Payments = require("../Models/payments.model");
const { paymentValidation } = require("../validations/payments.validation");

const addNewPayment = async (req, res) => {
  try {
    const { error, value } = paymentValidation(req.body);
    if (error) {
      return errorHandler(error, res);
    }

    const newPayment = await Payments.create(value);
    res.status(200).send({ message: "New payment added", newPayment });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAllPayments = async (req, res) => {
  try {
    const payments = await Payments.findAll({ include: { model: Contracts } });
    res.status(200).send({ payments });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findByIdPayments = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payments.findByPk(id);
    if (!payment) {
      return res.status(404).send({ message: "Payment not found" });
    }
    res.status(200).send({ payment });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = paymentValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }

    const [updated] = await Payments.update(value, {
      where: { id },
      returning: true,
    });

    if (updated) {
      const updatedPayment = await Payments.findByPk(id);
      res.status(200).send({ message: "Payment updated", updatedPayment });
    } else {
      res.status(404).send({ message: "Payment not found" });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Payments.destroy({ where: { id } });

    if (deleted) {
      res.status(200).send({ message: "Payment deleted" });
    } else {
      res.status(404).send({ message: "Payment not found" });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewPayment,
  findAllPayments,
  findByIdPayments,
  updatePayment,
  deletePayment,
};
