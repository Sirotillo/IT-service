const {
  addNewAdmin,
  findAllAdmins,
  findByIdAdmins,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
  logoutAdmin,
  refreshToken,
  registerAdmin,
} = require("../controllers/admins.controller");
const is_creatorGuard = require("../Middlewares/guard/is_creator.guard");
const adminSelfGuard = require("../Middlewares/guard/admin.self.guard");
const adminGuard = require("../Middlewares/guard/admin.guard");

const router = require("express").Router();

router.post("/", is_creatorGuard, addNewAdmin);
router.get("/", is_creatorGuard, findAllAdmins);
router.get("/:id", adminGuard, adminSelfGuard, is_creatorGuard, findByIdAdmins);
router.put("/:id", adminGuard, adminSelfGuard, is_creatorGuard, updateAdmin);
router.delete("/:id", is_creatorGuard, adminSelfGuard, deleteAdmin);

router.post("/registr", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.post("/refreshToken", refreshToken);

module.exports = router;
