const {
  addNewClient,
  findAllClients,
  findByIdClients,
  updateClient,
  deleteClient,
  loginClient,
  logoutClient,
  refreshToken,
  registerClient,
  activateClient,
  getBrokenProductClients,
  getCanceledClients,
  getClientPayments,
} = require("../controllers/clients.controller");

const router = require("express").Router();

router.post("/", addNewClient);
router.get("/", findAllClients);
router.get("/:id", findByIdClients);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

router.post("/register", registerClient);
router.get("/activate/:link", activateClient);
router.post("/login", loginClient);
router.post("/logout", logoutClient);
router.post("/refreshToken", refreshToken);
router.get("/bad-clients", getBrokenProductClients);
router.get("/canseled-clients", getCanceledClients);
router.get("/payment-clients", getClientPayments);
 
module.exports = router;
