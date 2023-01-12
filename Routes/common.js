const express = require("express");
const router = express.Router();
const controller = require("../Controllers");

// router.get('/verify-email', controller.AuthController.verifyEmail);

router.get("/getList", controller.commonController.getList);
router.get("/getOfficeSrNo", controller.commonController.getOfficeSrno);
router.get("/unused", controller.commonController.unusedList);

router.get("/delete",controller.commonController.clearDatabase);

router.post("/addEmployeetype",controller.commonController.addEmployeeType);
router.get("/getEmployeeType",controller.commonController.getEmployeeType);
router.post("/addPuritytype",controller.commonController.addPurityType);
router.get("/getPurityType",controller.commonController.getPurityType)
// router.post('/register-verify', controller.AuthController.verifyRegister);
// router.post('/login', controller.AuthController.login);
// router.post('/social-login', controller.AuthController.socialLogin);
// router.post('/logout', authentication, controller.AuthController.logout);

module.exports = router;
