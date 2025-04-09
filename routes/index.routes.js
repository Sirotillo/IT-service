const router = require("express").Router();

const clientsRouter = require("./clients.routes");
const adminsRouter = require("./admins.routes");
const ownersRouter = require("./owners.routes");
const categoriesRouter = require("./categories.routes");
const supportTicketsRouter = require("./supportTickets.routes");
const contractsRouter = require("./contracts.routes");
const invoicesRouter = require("./invoices.routes");
const rentalPriceRouter = require("./rentalPrice.routes");
const productsRouter = require("./products.routes");
const paymentsRouter = require("./payments.routes");

// router.use("/clients", clientsRouter);
// router.use("/admins", adminsRouter);
// router.use("/owners", ownersRouter);
// router.use("/catgeories", categoriesRouter);
// router.use("/supportTickets", supportTicketsRouter);
// router.use("/contract", contractsRouter);
// router.use("/invooices", invoicesRouter);
// router.use("/rentalPrice", rentalPriceRouter);
// router.use("/products", productsRouter);

router.use("/clients", clientsRouter);
router.use("/admins", adminsRouter);
router.use("/owners", ownersRouter);
router.use("/categories", categoriesRouter);
router.use("/supportTickets", supportTicketsRouter); 
router.use("/contract", contractsRouter);
router.use("/invoices", invoicesRouter); 
router.use("/rentalPrice", rentalPriceRouter);
router.use("/products", productsRouter);
router.use("/payments", paymentsRouter);

module.exports = router;
