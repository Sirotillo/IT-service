const {
  addNewOwner,
  findAllOwners,
  findByIdOwners,
  updateOwner,
  deleteOwner,
  loginOwner,
  logoutOwner,
  refreshToken,
  registerOwner,
  activateOwner,
  getTopRentingOwners,
} = require("../controllers/owners.controller");

const router = require("express").Router();

router.post("/", addNewOwner);
router.get("/", findAllOwners);
router.get("/:id", findByIdOwners);
router.put("/:id", updateOwner);
router.delete("/:id", deleteOwner);

router.post("/register", registerOwner);
router.get("/activate/:link", activateOwner);
router.post("/login", loginOwner);
router.post("/logout", logoutOwner);
router.post("/refreshToken", refreshToken);
router.get("/top-owners", getTopRentingOwners);

module.exports = router;
