const jwtService = require("../../services/jwt.service");
const { Client } = require("../../Models/clients.model");

const clientGuard = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    const decoded = await jwtService.verifyAccessToken(token);

    const client = await Client.findOne({ where: { id: decoded.id } });

    if (!client) {
      return res.status(403).json({ message: "Client not found" });
    }

    req.client = client;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = clientGuard;