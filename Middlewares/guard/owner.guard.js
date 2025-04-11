const { Owner } = require("../../Models/owners.model");

const ownerGuard = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    const decoded = await jwtService.verifyAccessToken(token);

    const owner = await Owner.findOne({ where: { userId: decoded.id } });

    if (!owner) {
      return res.status(403).json({ message: "You are not an owner" });
    }

    req.owner = owner;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = ownerGuard;
