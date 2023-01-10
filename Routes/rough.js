const express = require("express");
const router = express.Router();
const controller = require("../Controllers");

router.post("/create", controller.RoughCreate.create);
router.get("/view", controller.RoughCreate.viewList);
router.post("/sorting/create", controller.RoughCreate.sortingCreate);
router.get("/sorting/view", controller.RoughCreate.sortingList);
router.get("/viewbyid", controller.RoughCreate.sortingList);
router.get("/getpolished",controller.RoughCreate.getPolishedRough)
module.exports = router;
