const express = require("express");
const router = express.Router();
const controller = require("../Controllers");

// router.get('/verify-email', controller.AuthController.verifyEmail);

router.post("/create", controller.RoughCreate.create);
router.get("/view", controller.RoughCreate.viewList);
router.post("/sorting/create", controller.RoughCreate.sortingCreate);
router.get("/sorting/view", controller.RoughCreate.sortingList);
// router.post('/register-verify', controller.AuthController.verifyRegister);
// router.post('/login', controller.AuthController.login);
// router.post('/social-login', controller.AuthController.socialLogin);
// router.post('/logout', authentication, controller.AuthController.logout);

module.exports = router;
