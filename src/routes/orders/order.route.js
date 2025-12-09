const express = require("express");
const multer = require("multer");
const { authentication,updateOrderStatus } = require("../../middlewares/Auth/auth");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

router.post("/upload", authentication, upload.single("image"), (req, res) => {
  res.status(200).json({
    status: true,
    message: "File uploaded successfully",
    filePath: `/uploads/${req.file.filename}`,
  });
});

module.exports = router;
