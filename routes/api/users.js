const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const { NotFound } = require("http-errors");

const { User } = require("../../model");
const { authenticate, upload } = require("../../middlewares");
const Jimp = require("jimp");

const router = express.Router();

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

router.get("/logout", authenticate, async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).send();
});

router.get("/current", authenticate, async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    user: {
      email,
      subscription,
    },
  });
});

router.get("/verify/:verificationToken", async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      throw new NotFound("User not found");
    }
    await User.findByIdAndUpdate(user._id, {
      verificationToken: null,
      verify: true,
    });
    res.json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  async (req, res, next) => {
    const { path: tempUpload, filename } = req.file;
    const [extension] = filename.split(".").reverse();
    const newFileName = `${req.user._id}.${extension}`;
    try {
      const fileUpload = path.join(avatarsDir, newFileName);
      Jimp.read(tempUpload)
        .then((image) => {
          image.resize(250, 250).write(fileUpload);
        })
        .catch((err) => {
          next(err);
        });
      await fs.rename(tempUpload, fileUpload);
      const avatarURL = path.join("avatars", newFileName);
      await User.findByIdAndUpdate(req.user._id, { avatarURL }, { new: true });
      res.json({ avatarURL });
    } catch (error) {
      await fs.unlink(tempUpload);
      next(error);
    }
  }
);

module.exports = router;
