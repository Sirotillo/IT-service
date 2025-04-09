const { addNewInvooice, findAllInvooices, findByIdInvooices, updateInvooice, deleteInvooice } = require("../controllers/invoices.controller");

const router = require("express").Router();

router.post("/", addNewInvooice);
router.get("/", findAllInvooices);
router.get("/:id", findByIdInvooices);
router.put("/:id", updateInvooice);
router.delete("/:id", deleteInvooice);

module.exports = router;
