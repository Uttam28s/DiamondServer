const express = require("express");
const router = express.Router();
const controller = require("../Controllers");

// // router.get('/verify-email', controller.AuthController.verifyEmail);

router.post("/mainrough", controller.deleteModel.mainRough);
router.post("/officerough", controller.deleteModel.officeRough);
router.post("/factoryrough", controller.deleteModel.factoryRough);
router.post("/officerough/subpacket", controller.deleteModel.officeSubPacket);
router.post("/factoryrough/subpacket", controller.deleteModel.factorySubPacket);
//router.post("/", controller.factoryCreatePacket.factorySubPacketReturn)

// // router.post('/register-verify', controller.AuthController.verifyRegister);
// // router.post('/login', controller.AuthController.login);
// // router.post('/social-login', controller.AuthController.socialLogin);
// // router.post('/logout', authentication, controller.AuthController.logout);

module.exports = router;