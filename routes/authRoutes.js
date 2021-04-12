const { Router } = require("express");
const authController = require("../controllers/authController");

const router = Router();

// router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);
// router.get("/login", authController.login_get);
router.post("/login", authController.login_post);
router.get("/logout", authController.logout_get);
router.get("/auth", authController.auth_test);
router.get("/get_todo", authController.todos_get);
router.post("/update_todo", authController.todos_update);

module.exports = router;
