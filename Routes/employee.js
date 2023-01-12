const express = require("express");
const router = express.Router();
const controller = require("../Controllers");


router.post("/add", controller.employeeModel.addEmployee);
router.put("/update",controller.employeeModel.updateEmployee);
router.delete("/delete",controller.employeeModel.deleteEmployee)
router.get("/byid",controller.employeeModel.getEmployeeById)
router.get("/list",controller.employeeModel.getEmployeeList)

module.exports = router;