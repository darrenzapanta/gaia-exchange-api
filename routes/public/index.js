const express = require("express");
const products = require("./products");

const router = express.Router();

//base path /api/public

router.use("/products", products);

module.exports = router;
