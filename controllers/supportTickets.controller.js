const { errorHandler } = require("../helpers/error_handler");
const Clients = require("../Models/clients.model");
const SupportTicketss = require("../Models/supportTickets.model");
const {
  supportTicketsValidation,
} = require("../validations/supportTickets.validation");

const addNewSupportTickets = async (req, res) => {
  try {
    const { error, value } = supportTicketsValidation(req.body);
    if (error) {
      return errorHandler(error, res);
    }

    const newSupportTickets = await SupportTicketss.create(value);
    res.status(200).send({ message: "New category added", newSupportTickets });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAllSupportTicketss = async (req, res) => {
  try {
    const categorys = await SupportTicketss.findAll({ include: Clients });
    res.status(200).send({ categorys });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findByIdSupportTicketss = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await SupportTicketss.findByPk(id);
    if (!category) {
      return res.status(404).send({ message: "SupportTickets not found" });
    }
    res.status(200).send({ category });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateSupportTickets = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = supportTicketsValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }

    const [updated] = await SupportTicketss.update(value, {
      where: { id },
      returning: true,
    });

    if (updated) {
      const updatedSupportTickets = await SupportTicketss.findByPk(id);
      res
        .status(200)
        .send({ message: "SupportTickets updated", updatedSupportTickets });
    } else {
      res.status(404).send({ message: "SupportTickets not found" });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteSupportTickets = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SupportTicketss.destroy({ where: { id } });

    if (deleted) {
      res.status(200).send({ message: "SupportTickets deleted" });
    } else {
      res.status(404).send({ message: "SupportTickets not found" });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewSupportTickets,
  findAllSupportTicketss,
  findByIdSupportTicketss,
  updateSupportTickets,
  deleteSupportTickets,
};
