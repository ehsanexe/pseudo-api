const { Router } = require("express");
const authController = require("../controllers/authController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads");
  },
  filename: function (req, file, callback) {
    console.log("file", file);
    callback(
      null,
      file.fieldname + "-" + Date.now() + "." + file.mimetype.split("/")[1]
    );
  },
});
const upload = multer({ storage });
const router = Router();

// router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);
// router.get("/login", authController.login_get);
router.post("/login", authController.login_post);
router.get("/logout", authController.logout_get);
router.get("/auth", authController.auth_test);
router.get("/get_todo", authController.todos_get);
router.post("/update_todo", authController.todos_update);
router.post("/delete_todo", authController.todos_delete);
router.post("/create_todo", authController.todos_create);
router.post("/post_image", upload.single("file"), authController.post_image);
router.get("/get_image", authController.get_image);

module.exports = router;
