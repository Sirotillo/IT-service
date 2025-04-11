const { errorHandler } = require("../helpers/error_handler");
const Admins = require("../Models/admins.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const config = require('config');
const { adminValidation } = require("../validations/admin.validation");
const mailService = require("../services/mail.service");

const addNewAdmin = async (req, res) => {
  try {
    const { error, value } = adminValidation(req.body);
    if (error) {
      return errorHandler(error, res);
    }

    const newAdmin = await Admins.create(value);
    res.status(200).send({ message: "New admin added", newAdmin });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAllAdmins = async (req, res) => {
  try {
    const admins = await Admins.findAll();
    res.status(200).send({ admins });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findByIdAdmins = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admins.findByPk(id);
    if (!admin) {
      return res.status(404).send({ message: "Admin not found" });
    }
    res.status(200).send({ admin });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = adminValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }

    const [updated] = await Admins.update(value, {
      where: { id },
      returning: true,
    });

    if (updated) {
      const updatedAdmin = await Admins.findByPk(id);
      res.status(200).send({ message: "Admin updated", updatedAdmin });
    } else {
      res.status(404).send({ message: "Admin not found" });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Admins.destroy({ where: { id } });

    if (deleted) {
      res.status(200).send({ message: "Admin deleted" });
    } else {
      res.status(404).send({ message: "Admin not found" });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admins.findOne({ where: { username } });
  if (!admin) return res.status(400).send("Admin not found");

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).send("Invalid password");

  const token = jwt.sign(
    { id: admin.id, username: admin.username, role: "admin" },
    "your-secret-key",
    { expiresIn: "24h" }
  );

  admin.token = token;
  await admin.save();

  res.send({ token });
};

const logoutAdmin = async (req, res) => {
  res.clearCookie("token");
  res.send("Logged out successfully");
};

const refreshToken = async (req, res) => {
  const refreshToken =
    req.body.refreshToken ||
    req.query.refreshToken ||
    req.headers["x-refresh-token"];

  if (!refreshToken) return res.status(401).send("Refresh token required");

  jwt.verify(refreshToken, "your-secret-key", async (err, admin) => {
    if (err) return res.status(403).send("Invalid refresh token");

    const foundAdmin = await Admins.findByPk(admin.id);

    if (!foundAdmin || foundAdmin.token !== refreshToken) {
      return res.status(403).send("Invalid refresh token");
    }

    const accessToken = jwt.sign(
      { id: foundAdmin.id, username: foundAdmin.username },
      "your-secret-key",
      { expiresIn: "1h" }
    );

    foundAdmin.token = refreshToken;
    await foundAdmin.save();

    res.send({ accessToken });
  });
};

const registerAdmin = async (req, res) => {
  const { username, email, password, phone, is_creator, status } = req.body;

  if (!username || !email || !password || !phone || is_creator === undefined || status === undefined) {
    return res.status(400).send({ message: "All fields are required!" });
  }

  try {
    const existingAdmin = await Admins.findOne({ where: { email } });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists!" });
    }

    const existingPhone = await Admins.findOne({ where: { phone } });
    if (existingPhone) {
      return res
        .status(400)
        .json({ message: "Admin with this phone number already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const activation_link = uuid.v4();

    const newAdmin = await Admins.create({
      username,
      email,
      password: hashedPassword,
      phone,
      is_creator,
      status,
    });

    await mailService.sendActivationMail(
      newAdmin.email,
      `${config.get("api_url")}/api/admins/activate/${activation_link}`
    );

    const payload = {
      id: newAdmin.id,
      email: newAdmin.email,
      phone: newAdmin.phone,
    };

    const token = jwt.sign(payload, config.get("tokenKey"), {
      expiresIn: config.get("tokenTime"),
    });

    newAdmin.token = token;
    await newAdmin.save();

    return res.status(201).json({
      message: "Admin registered successfully!",
      admin: {
        id: newAdmin.id,
        username: newAdmin.username,
        phone: newAdmin.phone,
        email: newAdmin.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error!" });
  }
};

module.exports = {
  addNewAdmin,
  findAllAdmins,
  findByIdAdmins,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
  logoutAdmin,
  refreshToken,
  registerAdmin,
};
