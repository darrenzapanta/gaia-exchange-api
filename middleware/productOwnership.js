//check if product can be accessed by user

const { Product } = require("../models/product");

module.exports = function (req, res, next) {
  const user = req.user;

  if (user.role === "admin") {
    next();
    return;
  }

  const product_id = req.params.id;

  const product = Product.findOne({ id: product_id });
  if (!product) return res.status(400).send("Product not found");

  if (product.owner.id == user._id) {
    next();
    return;
  } else {
    return res.status(403).send("Access Denied");
  }
};
