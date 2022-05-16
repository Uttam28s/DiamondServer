const express = require("express");
const router = express.Router();
const controller = require("../Controllers");

// // router.get('/verify-email', controller.AuthController.verifyEmail);

router.post("/mainrough", controller.editModel.editMainRough);
router.post("/mainrough/office/factory", controller.editModel.editOfficeAndFactoryRough);
router.post("/office/officesubpacket", controller.editModel.editOfficeSubPacket);
router.post("/office/returnrough", controller.editModel.editReturnOfficeRough);
//router.post("/factoryrough/subpacket", controller.editModel.factorySubPacket);
//router.post("/", controller.factoryCreatePacket.factorySubPacketReturn)

// // router.post('/register-verify', controller.AuthController.verifyRegister);
// // router.post('/login', controller.AuthController.login);
// // router.post('/social-login', controller.AuthController.socialLogin);
// // router.post('/logout', authentication, controller.AuthController.logout);

module.exports = router;