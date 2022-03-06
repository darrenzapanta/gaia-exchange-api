const express = require("express");
const router = express.Router();
const { Offer, validateSchema, validate } = require("../../models/offer");
const { Product } = require("../../models/product");
const validateParams = require("../../middleware/validateParams");
const paginationMiddleware = require("../../middleware/paginationMiddleware");
const Joi = require("joi");

const checkIfOfferedParams = {
  product_id: Joi.string().required(),
};
//check if user already made an offer
router.get(
  "/checkIfOffered",
  validateParams(checkIfOfferedParams, "query"),
  async (req, res) => {
    const user = req.user;
    const query = {
      "sender._id": req.user._id,
      "product._id": req.query.product_id,
    };

    const offer = await Offer.findOne(query);

    return res.send(offer);
  }
);

router.get("/:id", async (req, res) => {
  const _id = req.params.id;
  const user = req.user;

  const query = {
    $and: [
      { _id: _id },
      { $or: [{ "sender._id": user._id }, { "recipient._id": user._id }] },
    ],
  };

  const offer = await Offer.findOne(query);
  if (!offer) return res.status(404).send("Offer not found");

  return res.send(offer);
});

const offerGetParams = {
  type: Joi.string().valid("sent", "received", "accepted").required(),
};
router.get(
  "/",
  [validateParams(offerGetParams, "query", true), paginationMiddleware],
  async (req, res) => {
    const user = req.user;
    const { skip, page, limit, type } = req.query;
    let query = { "sender._id": user._id };
    if (type === "received") {
      query = { "recipient._id": user._id };
    } else if (type === "accepted") {
      query = { "sender._id": user._id, status: "ACCEPTED" };
    }

    const offers = await Offer.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ notify: 1, createdAt: 1 });

    const totalCount = await Offer.countDocuments(query);

    const data = {
      offers,
      totalCount,
      page,
      limit,
      skip,
    };

    return res.send(data);
  }
);

const changeStatusParams = {
  _id: Joi.string().required(),
  status: Joi.string().valid("ACCEPTED", "REJECTED"),
};
router.post(
  "/changeStatus",
  validateParams(changeStatusParams, "body"),
  async (req, res) => {
    const user = req.user;
    const offer = await Offer.findOne({ _id: req.body._id });
    if (!offer) return res.status(404).send("Offer not found");

    // user doesnt have permission
    if (offer.recipient._id !== user._id) {
      return res.status(400).send("Not authorized to make this change");
    }

    offer.status = req.body.status;

    await offer.save();

    return res.send(offer);
  }
);

router.post("/", validateParams(validateSchema, "body"), async (req, res) => {
  const product = await Product.findOne({ _id: req.body.product._id });
  if (!product) return res.status("400").send("Product not found");

  const sender = {
    _id: req.user._id,
    displayName: req.user.displayName,
  };

  //check if sender is same as recipient
  if (product.owner._id === sender._id)
    return res.status(400).send("You cannot make offer on your own products.");

  //check if user already made an offer
  let offer = await Offer.findOne({
    "product._id": req.body.product._id,
    "sender._id": sender._id,
  });
  if (offer && offer.status === "PENDING")
    return res.status("400").send("You already made an offer.");

  //check all offered products if exists and belongs to the sender
  let offeredProducts = req.body.offeredProducts;
  for (let i = 0; i < offeredProducts.length; i++) {
    const offeredProduct = offeredProducts[i];
    const item = await Product.findOne({
      _id: offeredProduct._id,
      "owner.displayName": sender.displayName,
    });

    if (!item) return res.status(400).send("Offered Product not available");
  }

  const data = {
    offeredProducts,
    product: {
      _id: req.body.product._id,
      title: product.title,
    },
    money: req.body.money,
    sender,
    recipient: {
      _id: product.owner.id,
      displayName: product.owner.displayName,
    },
    additionalDetails: req.body.additionalDetails,
  };

  offer = new Offer(data);

  await offer.save();

  return res.send(offer);
});

module.exports = router;
