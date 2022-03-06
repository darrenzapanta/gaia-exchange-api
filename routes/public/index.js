const express = require("express");
const products = require("./products");
const categories = require("./categories");
const router = express.Router();

//base path /api/public

router.use("/products", products);
router.use("/categories", categories);
module.exports = router;
