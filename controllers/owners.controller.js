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
    const authoration = req.headers.authoration;
    if (!authoration) {
      return res.status(403).send({ message: "Authoration token berilmagan" });
    }

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
    // const owner = await Owners.findOne({ where: { email } });
    // if (!owner) {
    //   return res.status(400).send({ message: "Email yoki parol notog'ri" });
    // }

    // const validPassword = bcrypt.compareSync(password, owner.password);
    // if (!validPassword) {
    //   return res.status(400).send({ message: "Email yoki parol notog'ri" });
    // }
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

    const payload = {
      id: newOwner._id,
      email: newOwner.email,
      addres: newOwner.addres,
      role: "owner",
    };

    const token = jwt.sign(payload, config.get("tokenKey"), {
      expiresIn: config.get("tokenTime"),
    });

    newOwner.token = token;
    await newOwner.save();

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
  try {
    const { email, password } = req.body;

    const owner = await Owners.findOne({ where: { email } });

    if (!owner) {
      return res.status(400).send({ message: "Email yoki parol noto‘g‘ri" });
    }

    const validPassword = bcrypt.compareSync(password, owner.password);
    console.log("Body:", req.body);
    console.log("Email:", req.body.email);
    console.log("Password:", req.body.password);
    if (!validPassword) {
      return res.status(400).send({ message: "Email yoki parol noto‘g‘ri" });
    }

    const payload = {
      id: owner.id,
      email: owner.email,
      addres: owner.addres,
      role: "owner",
    };

    const token = jwt.sign(payload, config.get("tokenKey"), {
      expiresIn: config.get("tokenTime"),
    });

    owner.token = token;
    await owner.save();

    res.send({ message: "Tizimga xush kelibsiz", token });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logoutOwner = async (req, res) => {
  try {
    const { email } = req.body;

    const owner = await Owners.findOne({ where: { email } });

    if (!owner) {
      return res.status(400).send({ message: "Foydalanuvchi topilmadi" });
    }

    owner.token = null;
    await owner.save();

    res.clearCookie("token");

    res.send({ message: "Tizimdan chiqdingiz" });
  } catch (error) {
    res.status(500).send({ message: "Xatolik yuz berdi", error });
  }
};

const refreshToken = async (req, res) => {
  const refreshToken =
    req.body.refreshToken || req.query.token || req.headers["x-refresh-token"];

  if (!refreshToken) return res.status(401).send("Refresh token required");

  jwt.verify(refreshToken, "your-secret-key", (err, owner) => {
    if (err) return res.status(403).send("Invalid refresh token");

    const accessToken = jwt.sign(
      { id: owner.id, username: owner.username, role: "owner" },
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
};
