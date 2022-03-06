const express = require("express");
const router = express.Router();
const validatePagination = require("../../utils/pagination");
const {
  Product,
  validateProductSchema,
  validate,
} = require("../../models/product");
const auth = require("../../middleware/auth");
const _ = require("lodash");
const imageMiddleware = require("../../middleware/imageMiddleware");
const validateParams = require("../../middleware/validateParams");

//base path /api/user/:displayName/products"

const productFields = "title description categories owner featuredImage status";

router.get("/", async (req, res) => {
  const { page, skip, limit } = validatePagination(req);

  const query = { "owner._id": req.user._id };

  const products = await Product.find(query)
    .select(productFields)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalCount = await Product.countDocuments(query);

  const data = {
    products,
    totalCount,
    page,
    limit,
  };

  return res.send(data);
});

const imageMiddlewareFields = [
  { name: "featuredImage", maxCount: 1 },
  { name: "images" },
];

router.post("/", imageMiddleware(imageMiddlewareFields), async (req, res) => {
  console.log(req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let product = await Product.findOne({
    title: req.body.title,
    "owner._id": req.user._id,
  });
  if (product)
    return res.status(400).send("Cannot Create Product - Duplicate Product");

  const data = req.body;
  data.owner = {
    _id: req.user._id,
    displayName: req.user.displayName,
  };

  product = new Product(
    _.pick(req.body, [
      "title",
      "categories",
      "collections",
      "images",
      "description",
      "owner",
      "tags",
      "featuredImage",
    ])
  );

  await product.save();

  return res.send(product);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const user_id = req.user._id;

  const query = { _id: id, "owner.id": user_id };

  const product = await Product.findOne(query);
  if (!product) return res.status(404).send("Product not found");

  return res.send(product);
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const user_id = req.user._id;
  const product = await Product.findOneAndDelete({
    _id: id,
    "owner.id": user_id,
  });
  if (!product) return res.status(400).send("Product not found");

  return res.send(product);
});

router.put("/:id", imageMiddleware(imageMiddlewareFields), async (req, res) => {
  const id = req.params.id;
  const user_id = req.user._id;

  if (req.body.existingImages) {
    const existingImage = JSON.parse(req.body.existingImages);
    if (req.body.images) {
      req.body.images = [...req.body.images, ...existingImage];
    } else {
      req.body.images = existingImage;
    }

    req.body = _.omit(req.body, ["existingImages"]);
  }

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = await Product.findOneAndUpdate(
    {
      _id: id,
      "owner.id": user_id,
    },
    req.body,
    { new: true }
  );
  if (!product) return res.status(400).send("Product not found");

  return res.send(product);
});

module.exports = router;
