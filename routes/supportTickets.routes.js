const {
  addNewSupportTickets,
  findAllSupportTicketss,
  findByIdSupportTicketss,
  updateSupportTickets,
  deleteSupportTickets,
} = require("../controllers/supportTickets.controller");

const router = require("express").Router();

router.post("/", addNewSupportTickets);
router.get("/", findAllSupportTicketss);
router.get("/:id", findByIdSupportTicketss);
router.put("/:id", updateSupportTickets);
router.delete("/:id", deleteSupportTickets);

module.exports = router;
