const {
  getBrokenProductClients,
  getCanceledClients,
  getClientPayments,
  getRentedProductsInRange,
  getTopRentingOwners,
} = require("../controllers/smartCall.controller");

const router = require("express").Router();

router.get("/broken", getBrokenProductClients);
router.get("/canseled", getCanceledClients);
router.get("/payment", getClientPayments);
router.put("/rented", getRentedProductsInRange);
router.delete("/reyting", getTopRentingOwners);

module.exports = router;
