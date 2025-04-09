const { errorHandler } = require("../helpers/error_handler");
const Admins = require("../Models/admins.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { adminValidation } = require("../validations/admin.validation");

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

const registerAdmin = async (req, res) => {
  const { username, email, phone, password, role, is_creator } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    const newAdmin = await Admins.create({
      username,
      email,
      phone,
      password: hashed,
      role,
      is_creator,
      status: true,
    });

    const refreshToken = jwt.sign(
      { id: newAdmin.id, username: newAdmin.username },
      "your-secret-key",
      { expiresIn: "7d" }
    );

    const accessToken = jwt.sign(
      { id: newAdmin.id, username: newAdmin.username },
      "your-secret-key",
      { expiresIn: "1h" }
    );

    newAdmin.token = refreshToken;
    await newAdmin.save();

    res.status(201).send({
      message: "Admin ro‘yxatdan o‘tdi",
      admin: newAdmin,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admins.findOne({ where: { username } });
  if (!admin) return res.status(400).send("Admin not found");

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).send("Invalid password");

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
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

module.exports = {
  addNewAdmin,
  findAllAdmins,
  findByIdAdmins,
  updateAdmin,
  deleteAdmin,
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  refreshToken,
};
