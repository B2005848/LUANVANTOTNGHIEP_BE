const express = require("express");
const router = express.Router();
const handleStaffController = require("../Controllers/handle.staff.controller");
router.get("/getListAccount", handleStaffController.getStaffList);

module.exports = router;
