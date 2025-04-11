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
} = require("../controllers/owners.controller");
const adminGuard = require("../Middlewares/guard/admin.guard");
const isCreatorGuard = require("../Middlewares/guard/is_creator.guard");
const ownerSelfGuard = require("../Middlewares/guard/owner.self.guard");
const ownerGuard = require("../Middlewares/guard/owner.guard");

const router = require("express").Router();

router.post("/", adminGuard, addNewOwner);
router.get("/", isCreatorGuard, findAllOwners);
router.get("/:id", adminGuard, ownerGuard, ownerSelfGuard, findByIdOwners);
router.put("/:id", adminGuard, ownerGuard, ownerSelfGuard, updateOwner);
router.delete("/:id", adminGuard, ownerSelfGuard, deleteOwner);

router.post("/register", registerOwner);
router.get("/activate/:link", activateOwner);
router.post("/login", loginOwner);
router.post("/logout", logoutOwner);
router.post("/refreshToken", refreshToken);

module.exports = router;
