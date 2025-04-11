const { errorHandler } = require("../helpers/error_handler");
const Categories = require("../Models/categories.model");
const Products = require("../Models/products.model");
const Owners = require("../Models/owners.model");
const RentalPrice = require("../Models/rentalPrice.model");
const { productValidation } = require("../validations/products.validation");

const addNewProduct = async (req, res) => {
  try {
    const { error, value } = productValidation(req.body);
    if (error) {
      return errorHandler(error, res);
    }

    const newProduct = await Products.create(value);
    res.status(200).send({ message: "New product added", newProduct });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAllProducts = async (req, res) => {
  try {
    const products = await Products.findAll({
      include: [
        { model: Categories },
        { model: Owners },
        { model: RentalPrice },
      ],
    });
    res.status(200).send({ products });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findByIdProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Products.findByPk(id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.status(200).send({ product });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { error, value } = productValidation(req.body);

    if (error) {
      return errorHandler(error, res);
    }

    const [updated] = await Products.update(value, {
      where: { id },
      returning: true,
    });

    if (updated) {
      const updatedProduct = await Products.findByPk(id);
      res.status(200).send({ message: "Product updated", updatedProduct });
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Products.destroy({ where: { id } });

    if (deleted) {
      res.status(200).send({ message: "Product deleted" });
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};


module.exports = {
  addNewProduct,
  findAllProducts,
  findByIdProducts,
  updateProduct,
  deleteProduct,
};
