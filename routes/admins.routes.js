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

const router = require("express").Router();


router.post("/", addNewAdmin);
router.get("/", findAllAdmins);
router.get("/:id", findByIdAdmins);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.post("/refreshToken", refreshToken);

module.exports = router;
