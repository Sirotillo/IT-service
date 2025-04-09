const {
  addNewCategory,
  findAllCategorys,
  findByIdCategorys,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories.controller");

const router = require("express").Router();

router.post("/", addNewCategory);
router.get("/", findAllCategorys);
router.get("/:id", findByIdCategorys);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
