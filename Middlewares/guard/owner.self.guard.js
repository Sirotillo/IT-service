const { Owner } = require("../../Models/owners.model");

const ownerSelfGuard = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    const decoded = await jwtService.verifyAccessToken(token);

    const owner = await Owner.findOne({ where: { userId: decoded.id } });

    if (!owner) {
      return res.status(403).json({ message: "Owner not found" });
    }

    if (owner.userId === decoded.id) {
      req.owner = owner;
      return next();
    }

    return res
      .status(403)
      .json({ message: "You can only access your own resources" });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = ownerSelfGuard;
