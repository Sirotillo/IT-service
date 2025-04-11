const { errorHandler } = require("../helpers/error_handler");
const Clients = require("../Models/clients.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { clientValidation } = require("../validations/client.validation");
const uuid = require("uuid");
const mailService = require("../services/mail.service");
const config = require("config");

const addNewClient = async (req, res) => {
  try {
    const { error, value } = clientValidation(req.body);
    if (error) {
      return errorHandler(error, res);
    }

    const newClient = await Clients.create(value);
    res.status(200).send({ message: "New client added", newClient });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAllClients = async (req, res) => {
  try {
    const clients = await Clients.findAll();
    res.status(200).send({ clients });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findByIdClients = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Clients.findByPk(id);
    if (!client) {
      return res.status(404).send({ message: "Client not found" });
    }
    res.status(200).send({ client });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = clientValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }

    const [updated] = await Clients.update(value, {
      where: { id },
      returning: true,
    });

    if (updated) {
      const updatedClient = await Clients.findByPk(id);
      res.status(200).send({ message: "Client updated", updatedClient });
    } else {
      res.status(404).send({ message: "Client not found" });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Clients.destroy({ where: { id } });

    if (deleted) {
      res.status(200).send({ message: "Client deleted" });
    } else {
      res.status(404).send({ message: "Client not found" });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

const registerClient = async (req, res) => {
  const { full_name, phone_number, email, password } = req.body;

  if (!full_name || !phone_number || !email || !password) {
    return res.status(400).send({ message: "All fields are required!" });
  }

  try {
    const existingClient = await Clients.findOne({ where: { email } });
    if (existingClient) {
      return res
        .status(400)
        .json({ message: "Client with this email already exists!" });
    }

    const existingPhone = await Clients.findOne({ where: { phone_number } });
    if (existingPhone) {
      return res
        .status(400)
        .json({ message: "Client with this phone number already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const activation_link = uuid.v4();

    const newClient = await Clients.create({
      full_name,
      phone_number,
      email,
      password: hashedPassword,
    });

    await mailService.sendActivationMail(
      newClient.email,
      `${config.get("api_url")}/api/clients/activate/${activation_link}`
    );

    const payload = {
      id: newClient._id,
      email: newClient.email,
      addres: newClient.phone_number,
    };

    const token = jwt.sign(payload, config.get("tokenKey"), {
      expiresIn: config.get("tokenTime"),
    });

    return res.status(201).json({
      message: "Client registered successfully!",
      client: {
        id: newClient.id,
        full_name: newClient.full_name,
        phone_number: newClient.phone_number,
        email: newClient.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error!" });
  }
};

const loginClient = async (req, res) => {
  const { email, password } = req.body;

  const client = await Clients.findOne({ where: { email } });
  if (!client) return res.status(400).send("Client not found");

  const isMatch = await bcrypt.compare(password, client.password);
  if (!isMatch) return res.status(400).send("Invalid password");

  const token = jwt.sign(
    { id: client.id, email: client.email, role: "client" },
    "your-secret-key",
    { expiresIn: "24h" }
  );

  res.json({ token });
};

const logoutClient = async (req, res) => {
  res.clearCookie("token");
  res.send("Logged out successfully");
};

const refreshToken = async (req, res) => {
  const refreshToken =
    req.body.token || req.query.token || req.headers["x-refresh-token"];

  if (!refreshToken) return res.status(401).send("Refresh token required");

  jwt.verify(refreshToken, "your-refresh-secret", (err, client) => {
    if (err) return res.status(403).send("Invalid refresh token");

    const accessToken = jwt.sign(
      { id: client.id, email: client.email, role: "client" },
      "your-secret-key",
      { expiresIn: "1h" }
    );

    res.json({ accessToken });
  });
};

const activateClient = async (req, res) => {
  try {
    const client = await Clients.findOne({ activation_link: req.params.link });
    if (!client) {
      return res.status(404).send({ message: "Foydalanuvchi Topilmadi" });
    }
    client.status = true;
    await client.save();

    res.send({ message: "Foydalanuvchi folashtirildi", status: client.status });
  } catch (error) {
    errorHandler(error, res);
  }
};



module.exports = {
  addNewClient,
  findAllClients,
  findByIdClients,
  updateClient,
  deleteClient,
  registerClient,
  loginClient,
  logoutClient,
  refreshToken,
  activateClient,
};
