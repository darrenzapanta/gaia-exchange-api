const express = require("express");
const router = express.Router();
const products = require("./products");
const auth = require("../../middleware/auth");

router.use(auth);

router.use("/products", products);

module.exports = router;
