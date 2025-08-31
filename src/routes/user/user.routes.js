const { Router } = require("express");
const {
  register,
  login,
  logout,
  updateProfile,
  deleteProfile,
  updatePassword,
} = require("../../controllers/user/user.controllers");

const { authenticate } = require("../../middlewares/auth.middleware");

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticate, logout);

router.patch("/edit", authenticate, updateProfile);

router.delete("/delete", authenticate, deleteProfile)
router.patch("/update-password", authenticate, updatePassword)

module.exports = router;
