const jwtService = require("../../services/jwt.service");
const { Admin } = require("../../Models/admins.model");

const adminGuard = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token required" });
    }

    const decoded = await jwtService.verifyAccessToken(token);

    const admin = await Admin.findOne({ where: { id: decoded.id } });

    if (!admin) {
      return res.status(403).json({ message: "Access denied, not an admin" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = adminGuard;
