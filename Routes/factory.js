const express = require("express");
const router = express.Router();
const controller = require("../Controllers");

// // router.get('/verify-email', controller.AuthController.verifyEmail);

router.post("/create", controller.factoryCreate.create);
router.get("/view", controller.factoryCreate.factoryView);
router.get("/subpacket/view", controller.factoryCreatePacket.factoryPacketView);
router.post("/create/packet", controller.factoryCreatePacket.create);
router.post("/return", controller.factoryCreate.returnPacket);
router.post("/subpacket/return", controller.factoryCreatePacket.factorySubPacketReturn)

// // router.post('/register-verify', controller.AuthController.verifyRegister);
// // router.post('/login', controller.AuthController.login);
// // router.post('/social-login', controller.AuthController.socialLogin);
// // router.post('/logout', authentication, controller.AuthController.logout);

module.exports = router;