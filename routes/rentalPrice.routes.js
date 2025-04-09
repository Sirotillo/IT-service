const {
  addNewRentalPrice,
  findAllRentalPrices,
  findByIdRentalPrices,
  updateRentalPrice,
  deleteRentalPrice,
} = require("../controllers/rentalPrice.controller");

const router = require("express").Router();

router.post("/", addNewRentalPrice);
router.get("/", findAllRentalPrices);
router.get("/:id", findByIdRentalPrices);
router.put("/:id", updateRentalPrice);
router.delete("/:id", deleteRentalPrice);

module.exports = router;
