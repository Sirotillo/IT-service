const { Admin } = require("../../Models/admins.model");

const isCreatorGuard = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    const decoded = await jwtService.verifyAccessToken(token);

    const admin = await Admin.findOne({ where: { id: decoded.id } });

    if (!admin) {
      return res.status(403).json({ message: "Admin not found" });
    }

    if (!admin.is_creator) {
      return res.status(403).json({ message: "You are not a creator" });
    }

    req.admin = admin;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = isCreatorGuard;
