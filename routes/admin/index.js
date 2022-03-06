const express = require("express");
const router = express.Router();
const products = require("./products");
const categories = require("./categories");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");

router.use(auth);
router.use(admin);

router.use("/products", products);
router.use("/categories", categories);

module.exports = router;
