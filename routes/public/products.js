const express = require("express");
const router = express.Router();
const { Product } = require("../../models/product");
const validatePagination = require("../../utils/pagination");

const productFields =
  "title category owner featuredImage description questions images";
//get all products
router.get("/", async (req, res) => {
  const { page, limit, skip } = validatePagination(req);

  //exclude products with specific tag and unpublished products
  const query = {
    status: "AVAILABLE",
  };
  const products = await Product.find(query)
    .select(productFields)
    .skip(skip)
    .limit(limit)
    .sort({ title: 1 });

  const totalCount = await Product.countDocuments(query);

  const data = {
    products,
    totalCount,
    page,
    limit,
  };

  return res.send(data);
});

//get product by id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const product = await Product.findOne({ _id: id }).select(productFields);
  if (!product) return res.status(400).send("Product Not Found");

  return res.send(product);
});

module.exports = router;
