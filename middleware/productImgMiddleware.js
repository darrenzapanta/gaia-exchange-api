const multer = require("multer");
const config = require("config");
const { v4: uuidv4 } = require("uuid");
const maxSize = 3 * 1024 * 1024; // 3mb
const DIR = `./${config.get("uploadDir")}`;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4() + "-" + fileName);
  },
});

const upload = multer({
  storage: storage,
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
}).fields([{ name: "featuredImage", maxCount: 1 }, { name: "images" }]);

module.exports = function (req, res, next) {
  upload(req, res, function (err) {
    if (req.fileValidationError) {
      return res.status(400).send(req.fileValidationError);
    }
    if (err instanceof multer.MulterError) {
      console.log(err);
      let message = err.message;
      if (err.code == "LIMIT_FILE_SIZE") message = "Maxmium image size is 3mb";
      return res.status(400).send(message);
    } else if (err) {
      console.log(err);
      return res.status(400).send("Upload failed");
    }
    if (req.files["images"]) {
      req.body.images = req.files["images"].map((image) => {
        return config.get("uploadDir") + "/" + image.filename;
      });
    }
    if (req.files["featuredImage"]) {
      req.body.featuredImage =
        config.get("uploadDir") + "/" + req.files["featuredImage"][0].filename;
    }

    next();
  });
};
