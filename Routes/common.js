const express = require("express");
const router = express.Router();
const controller = require("../Controllers");

// router.get('/verify-email', controller.AuthController.verifyEmail);

router.get("/getList", controller.commonController.getList);
router.get("/getOfficeSrNo", controller.commonController.getOfficeSrno);
// router.post('/register-verify', controller.AuthController.verifyRegister);
// router.post('/login', controller.AuthController.login);
// router.post('/social-login', controller.AuthController.socialLogin);
// router.post('/logout', authentication, controller.AuthController.logout);

module.exports = router;
