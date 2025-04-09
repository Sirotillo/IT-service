const { errorHandler } = require("../helpers/error_handler");
const Owners = require("../Models/owners.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { ownerValidation } = require("../validations/owner.validation");
const uuid = require("uuid");
const mailService = require("../services/mail.service");
const config = require("config");

const addNewOwner = async (req, res) => {
  try {
    const { error, value } = ownerValidation(req.body);
    if (error) {
      return errorHandler(error, res);
    }

    const newOwner = await Owners.create(value);
    res.status(200).send({ message: "New owner added", newOwner });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAllOwners = async (req, res) => {
  try {
    const owners = await Owners.findAll();
    res.status(200).send({ owners });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findByIdOwners = async (req, res) => {
  try {
    const { id } = req.params;
    const owner = await Owners.findByPk(id);
    if (!owner) {
      return res.status(404).send({ message: "Owner not found" });
    }
    res.status(200).send({ owner });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = ownerValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }

    const [updated] = await Owners.update(value, {
      where: { id },
      returning: true,
    });

    if (updated) {
      const updatedOwner = await Owners.findByPk(id);
      res.status(200).send({ message: "Owner updated", updatedOwner });
    } else {
      res.status(404).send({ message: "Owner not found" });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Owners.destroy({ where: { id } });

    if (deleted) {
      res.status(200).send({ message: "Owner deleted" });
    } else {
      res.status(404).send({ message: "Owner not found" });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

const registerOwner = async (req, res) => {
  const { company_name, phone_number, email, password, website, addres } =
    req.body;

  if (
    !company_name ||
    !phone_number ||
    !email ||
    !password ||
    !website ||
    !addres
  ) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const existingOwner = await Owners.findOne({ where: { email } });
    if (existingOwner) {
      return res
        .status(400)
        .json({ message: "Owner with this email already exists!" });
    }

    const existingPhone = await Owners.findOne({ where: { phone_number } });
    if (existingPhone) {
      return res
        .status(400)
        .json({ message: "Owner with this phone number already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const activation_link = uuid.v4();

    const newOwner = await Owners.create({
      company_name,
      phone_number,
      email,
      password: hashedPassword,
      website,
      addres,
    });

    await mailService.sendActivationMail(
      newOwner.email,
      `${config.get("api_url")}/api/owners/activate/${activation_link}`
    );

    const token = jwt.sign(
      { id: newOwner.id, company_name: newOwner.company_name },
      "secret_key_jwt",
      { expiresIn: "1h" }
    );

    return res.status(201).send({
      message:
        "Owner royhatdan otildi. Akauntni faolashtirish uchun pochtaga oting.",
      owner: {
        id: newOwner.id,
        company_name: newOwner.company_name,
        phone_number: newOwner.phone_number,
        email: newOwner.email,
        website: newOwner.website,
        addres: newOwner.addres,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error!" });
  }
};

const loginOwner = async (req, res) => {
  const { company_name, password } = req.body;

  const owner = await Owners.findOne({ where: { company_name } });
  if (!owner) return res.status(400).send("Owner not found");

  const isMatch = await bcrypt.compare(password, owner.password);
  if (!isMatch) return res.status(400).send("Invalid password");

  const token = jwt.sign(
    { id: owner.id, username: owner.company_name },
    "your-secret-key",
    { expiresIn: "24h" }
  );

  res.json({ token });
};

const logoutOwner = async (req, res) => {
  res.clearCookie("token");
  res.send("Logged out successfully");
};

const refreshToken = async (req, res) => {
  const refreshToken =
    req.body.refreshToken || req.query.token || req.headers["x-refresh-token"];

  if (!refreshToken) return res.status(401).send("Refresh token required");

  jwt.verify(refreshToken, "your-secret-key", (err, owner) => {
    if (err) return res.status(403).send("Invalid refresh token");

    const accessToken = jwt.sign(
      { id: owner.id, username: owner.username },
      "your-secret-key",
      { expiresIn: "1h" }
    );

    res.json({ accessToken });
  });
};

const activateOwner = async (req, res) => {
  try {
    const owner = await Owners.findOne({ activation_link: req.params.link });
    if (!owner) {
      return res.status(404).send({ message: "Foydalanuvchi Topilmadi" });
    }
    owner.status = true;
    await owner.save();

    res.send({ message: "Foydalanuvchi folashtirildi", status: owner.status });
  } catch (error) {
    errorHandler(error, res);
  }
};

async function getTopRentingOwners() {
  try {
    const result = await sequelize.query(
      `
          SELECT o.id, o.name, COUNT(r.id) AS rental_count
          FROM Owners o
          JOIN Products p ON o.id = p.owner_id
          JOIN Rentals r ON p.id = r.product_id
          WHERE r.status = 'rented'
          GROUP BY o.id
          ORDER BY rental_count DESC
          LIMIT 10;
      `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    console.log(result);
  } catch (error) {
    errorHandler(error, res);
    console.error("Xatolik:", error);
  }
}

module.exports = {
  addNewOwner,
  findAllOwners,
  findByIdOwners,
  updateOwner,
  deleteOwner,
  registerOwner,
  loginOwner,
  logoutOwner,
  refreshToken,
  activateOwner,
  getTopRentingOwners,
};
