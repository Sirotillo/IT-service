const {
  addNewProduct,
  findAllProducts,
  findByIdProducts,
  updateProduct,
  deleteProduct,
  getRentedProductsInRange,
} = require("../controllers/products.controller");

const router = require("express").Router();

router.post("/", addNewProduct);
router.get("/", findAllProducts);
router.get("/:id", findByIdProducts);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/rented", getRentedProductsInRange);

module.exports = router;
