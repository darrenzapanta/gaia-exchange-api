const express = require("express");
const router = express.Router();
const paginationMiddleware = require("../../middleware/paginationMiddleware");
const { Category } = require("../../models/category");
const { Product } = require("../../models/product");

router.get("/", paginationMiddleware, async (req, res) => {
  const { page, skip, limit } = req.query;

  const categories = await Category.find()
    .sort({ title: 1 })
    .skip(skip)
    .limit(limit);

  const totalCount = await Category.countDocuments();

  const data = {
    page,
    skip,
    limit,
    totalCount,
    categories,
  };

  return res.send(data);
});

router.get("/:category", paginationMiddleware, async (req, res) => {
  const { page, skip, limit } = req.query;
  const handle = req.params.category;

  const category = await Category.findOne({ handle });

  if (!category) return res.status(404).send("Category not found");

  const query = { categories: category.title };

  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  const totalCount = await Product.countDocuments(query);

  const data = {
    page,
    skip,
    limit,
    products,
    totalCount,
  };

  return res.send(data);
});

module.exports = router;
