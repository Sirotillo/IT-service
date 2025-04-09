const {
  addNewPayment,
  findAllPayments,
  findByIdPayments,
  updatePayment,
  deletePayment,
} = require("../controllers/payments.controller");

const router = require("express").Router();

router.post("/", addNewPayment);
router.get("/", findAllPayments);
router.get("/:id", findByIdPayments);
router.put("/:id", updatePayment);
router.delete("/:id", deletePayment);

module.exports = router;
