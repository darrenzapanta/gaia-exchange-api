const multer = require("multer");
const multerS3 = require("multer-s3");
const config = require("config");
const { v4: uuidv4 } = require("uuid");
const aws = require("aws-sdk");
const winston = require("winston/lib/winston/config");
const handleize = require("../utils/handleize");

const imageMiddleware = (fields) => {
  const maxSize = 3 * 1024 * 1024; // 3mb

  const s3 = new aws.S3({
    accessKeyId: config.get("S3_AWS_ACCESS_KEY_ID"),
    secretAccessKey: config.get("S3_AWS_SECRET_ACCESS_KEY"),
    region: config.get("S3_AWS_REGION"),
    acl: "public-read",
  });

  const storageS3 = multerS3({
    s3: s3,
    bucket: config.get("S3_BUCKET_NAME"),
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const nameArr = file.originalname.split(".");
      const fileName = handleize(nameArr[0]) + "." + nameArr[1];
      cb(null, "public/" + uuidv4() + "-" + fileName);
    },
  });

  const upload = multer({
    storage: storageS3,
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"
      ) {
        cb(null, true);
      } else {
        req.fileValidationError =
          "Only .jpg and .png are accepted format for the photos";
        cb(null, false, new Error("goes wrong on the mimetype"));
      }
    },
    limits: { fileSize: maxSize },
  }).fields(fields);

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }
      if (err instanceof multer.MulterError) {
        winston.error(err);
        let message = err.message;
        if (err.code == "LIMIT_FILE_SIZE")
          message = "Maxmium image size is 3mb";
        return res.status(400).send(message);
      } else if (err) {
        winston.error(err);
        return res.status(400).send("Upload failed");
      }
      if (req.files) {
        fields.forEach((field) => {
          const key = field.name;
          const files = req.files;
          if (files[key]) {
            if (field["maxCount"] !== undefined && field["maxCount"] == 1) {
              req.body[key] = {
                url: files[key][0].key,
                thumbnail: files[key][0].key,
                retina: files[key][0].key,
              };
            } else {
              req.body[key] = files[key].map((file) => {
                return {
                  url: file.key,
                  thumbnail: file.key,
                  retina: file.key,
                };
              });
            }
          }
        });
      }

      next();
    });
  };
};
module.exports = imageMiddleware;
