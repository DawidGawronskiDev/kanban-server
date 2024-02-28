const router = require("express").Router();

const auth_controller = require("../controllers/auth-controller");

router.get("/signup", auth_controller.signup_get);
router.post("/signup", auth_controller.signup_post);

router.post("/login", auth_controller.login_post);

module.exports = router;
