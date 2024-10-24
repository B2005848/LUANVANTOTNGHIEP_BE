const express = require("express");
const router = express.Router();
const handleStaffController = require("../Controllers/handle.staff.controller");

// ==========GET ALL ACCOUNT STAFFS==========
router.get("/getListAccount", handleStaffController.getStaffList);

// ======= GET INFORMATION STAFF BY STAFF_ID=============
router.get("/getInformationDetail/:id", handleStaffController.getStaffInfoById);

// ========== GET DOCTOR BY SPECIALTY_ID================
router.get(
  "/getListDoctorBySpecialtyId/:id",
  handleStaffController.selectDoctorBySpecialtyId
);

// ========SEARCH STAFFS=========================
router.get("/search", handleStaffController.searchStaffs);
module.exports = router;
