const Joi = require("joi");
const validateParams = (schemaObj, property, allowUnknown = false) => {
  return (req, res, next) => {
    const schema = Joi.object(schemaObj).unknown(allowUnknown);
    const { error } = schema.validate(req[property]);

    const valid = error == null;
    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      res.status(422).send(message);
    }
  };
};
module.exports = validateParams;
