const express = require("express");
const router = express.Router();
const { Category, validateSchema } = require("../../models/category");
const validateParams = require("../../middleware/validateParams");
const handleize = require("../../utils/handleize");

router.post("/", validateParams(validateSchema, "body"), async (req, res) => {
  try {
    req.body.handle = handleize(req.body.title);

    const category = new Category(req.body);
    await category.save();
    return res.send(category);
  } catch (error) {
    if (error.code == "11000") {
      return res.status(400).send("Duplicate category");
    }

    return res.status(400).send(error.message);
  }
});

router.put("/:id", validateParams(validateSchema, "body"), async (req, res) => {
  const _id = req.params.id;

  const category = await Category.findOneAndUpdate({ _id }, req.body, {
    new: true,
  });

  if (!category) return res.status(400).send("Invalid id");

  return res.send(category);
});

router.delete("/:id", async (req, res) => {
  const _id = req.params.id;

  const category = await Category.findOneAndDelete({ _id });
  if (!category) return res.status(400).send("Invalid Id");

  return res.send(category);
});

module.exports = router;
