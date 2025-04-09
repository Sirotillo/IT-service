const { errorHandler } = require("../helpers/error_handler");
const Categorys = require("../Models/categories.model");
const { categorieValidation } = require("../validations/categories.validation");

const addNewCategory = async (req, res) => {
  try {
    const { error, value } = categorieValidation(req.body);
    if (error) {
      return errorHandler(error, res);
    }

    const newCategory = await Categorys.create(value);
    res.status(200).send({ message: "New category added", newCategory });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAllCategorys = async (req, res) => {
  try {
    const categorys = await Categorys.findAll();
    res.status(200).send({ categorys });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findByIdCategorys = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Categorys.findByPk(id);
    if (!category) {
      return res.status(404).send({ message: "Category not found" });
    }
    res.status(200).send({ category });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = categorieValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }

    const [updated] = await Categorys.update(value, {
      where: { id },
      returning: true,
    });

    if (updated) {
      const updatedCategory = await Categorys.findByPk(id);
      res.status(200).send({ message: "Category updated", updatedCategory });
    } else {
      res.status(404).send({ message: "Category not found" });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Categorys.destroy({ where: { id } });

    if (deleted) {
      res.status(200).send({ message: "Category deleted" });
    } else {
      res.status(404).send({ message: "Category not found" });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewCategory,
  findAllCategorys,
  findByIdCategorys,
  updateCategory,
  deleteCategory,
};
