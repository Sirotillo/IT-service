const jwtService = require("../../services/jwt.service");

const clientSelfGuard = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  try {
    const decoded = jwtService.verifyAccessToken(token);

    // Agar so'rov qilingan mijoz ID'si bilan tokendagi ID mos kelmasa, xato qaytarish
    if (req.params.id !== decoded.id.toString()) {
      return res.status(403).json({ message: "You can only access your own data" });
    }

    req.client = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = clientSelfGuard;
