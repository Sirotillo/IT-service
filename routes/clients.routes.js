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
} = require("../controllers/clients.controller");
const adminGuard = require("../Middlewares/guard/admin.guard");
const isCreatorGuard = require("../Middlewares/guard/is_creator.guard");
const clientSelfGuard = require("../Middlewares/guard/client.self.guard");
const clientGuard = require("../Middlewares/guard/client.guard");
const router = require("express").Router();

router.post("/", adminGuard, addNewClient);
router.get("/", isCreatorGuard, findAllClients);
router.get("/:id", clientGuard, clientSelfGuard, adminGuard, findByIdClients);
router.put("/:id", clientGuard, clientSelfGuard, adminGuard, updateClient);
router.delete("/:id", clientSelfGuard, adminGuard, deleteClient);

router.post("/register", registerClient);
router.get("/activate/:link", activateClient);
router.post("/login", loginClient);
router.post("/logout", logoutClient);
router.post("/refreshToken", refreshToken);

module.exports = router;
