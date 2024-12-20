const e = require("express");
const ApiError = require("../api-error");
const handlePatientService = require("../Services/handle.patient.service");
const moment = require("moment");

const handlePatientController = {
  // ------------------GET LIST ACCOUNT OF ALL PATIENTS---------------------
  async getListAccountPatients(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const { message, patients, totalPages, itemsPerPage } =
        await handlePatientService.getListAccountPatients(page);
      res.status(200).json({ message, totalPages, itemsPerPage, patients });
    } catch (error) {
      next(new ApiError(400, "get all patient fail!"));
    }
  },

  // ---------------GET INFORMATION OF PATIENT WITH PATIENT ID----------------
  async getPatientByUsername(req, res, next) {
    try {
      const username = req.params.username;
      const data = await handlePatientService.getPatientByUsername(username);
      if (data) {
        return res.status(200).json({
          status: 200,
          message: "get data patient success",
          dataInfo: data,
        });
      }
    } catch (error) {
      next(new ApiError(404, "patient not exist!"));
    }
  },

  // ------------------------------------------------UPATE INFORMATION DETAIL CONTROLLER------------------------------
  async updateInformation(req, res, next) {
    try {
      const patient_id = req.params.id;
      let data = { ...req.body };

      //check birthday and format
      if (data.birthday) {
        if (!moment(data.birthday, "DD/MM/YYYY", true).isValid()) {
          return next(new ApiError(400, "Invalid birthday format"));
        }
        data.birthday = moment(data.birthday, "DD/MM/YYYY").format(
          "YYYY-MM-DD"
        );
      }

      if (Object.keys(data).length === 0) {
        return next(new ApiError(400, "No information to update"));
      }

      const resultUpdateInformation =
        await handlePatientService.updateInformation(patient_id, data);

      if (resultUpdateInformation) {
        return res.status(200).json({
          message: "Update information successful",
          data: data,
        });
      } else {
        return next(new ApiError(400, "Update information failed"));
      }
    } catch (error) {
      return next(
        new ApiError(
          500,
          `An error occurred while updating information for patient_id: ${req.params.id}`
        )
      );
    }
  },

  // --------------------- SEARCH PATIENTS-------------------
  async searchPatients(req, res, next) {
    try {
      const query = req.query.search;
      const resultSearch = await handlePatientService.searchPatients(query);
      if (resultSearch.success === true) {
        return res.status(200).json({
          message: "Search patients successful",
          data: resultSearch.data,
        });
      } else {
        return res
          .status(404)
          .json({ message: "Not found any patient with this information" });
      }
    } catch (error) {
      return next(
        new ApiError(500, "An error occurred while searching patients")
      );
    }
  },

  // Tạo hồ sơ bệnh án theo lịch hẹn
  async createPatientRecord(req, res) {
    const {
      patient_id,
      doctor_id,
      appointment_id,
      diagnosis,
      treatment,
      reason,
      weight,
      height,
      blood_pressure,
      heart_rate,
      temperature,
      respiratory_rate,
      blood_sugar,
      cholesterol,
    } = req.body;

    // Kiểm tra thông tin đầu vào
    if (
      !patient_id ||
      !doctor_id ||
      !appointment_id ||
      !diagnosis ||
      !treatment ||
      !reason
    ) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields.",
      });
    }

    try {
      const result = await handlePatientService.createPatientRecord({
        patient_id,
        doctor_id,
        appointment_id,
        diagnosis,
        treatment,
        reason,
        weight,
        height,
        blood_pressure,
        heart_rate,
        temperature,
        respiratory_rate,
        blood_sugar,
        cholesterol,
      });

      if (result.status) {
        console.log("Tạo thành công hồ sơ", result);
        return res.status(200).json(result);
      }

      return res.status(500).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        message: "Error creating patient record.",
        error,
      });
    }
  },

  // --------------------- GET PATIENT LIST RECORDS BY PATIENT ID -------------------
  async getPatientRecordsByPatientId(req, res, next) {
    try {
      const patient_id = req.params.patient_id; // Lấy patient_id từ tham số URL

      // Gọi service để lấy hồ sơ bệnh án
      const result = await handlePatientService.getPatientRecordsByPatientId(
        patient_id
      );

      // Kiểm tra nếu có dữ liệu
      if (result.status) {
        return res.status(200).json({
          status: 200,
          message: "Patient records retrieved successfully",
          data: result.data, // Trả về danh sách hồ sơ bệnh án
        });
      } else {
        // Nếu không tìm thấy hồ sơ bệnh án
        return res.status(404).json({
          status: 404,
          message: result.message, // Trả về thông báo không tìm thấy hồ sơ
        });
      }
    } catch (error) {
      // Nếu có lỗi trong quá trình xử lý
      return next(
        new ApiError(500, "An error occurred while retrieving patient records")
      );
    }
  },

  // --------------------- GET PATIENT RECORDS BY RECORD ID -------------------
  async getPatientRecordsByRecordId(req, res, next) {
    try {
      const record_id = req.params.record_id; // Lấy patient_id từ tham số URL

      // Gọi service để lấy hồ sơ bệnh án
      const result = await handlePatientService.getPatientRecordsByRecordId(
        record_id
      );

      // Kiểm tra nếu có dữ liệu
      if (result.status) {
        return res.status(200).json({
          status: 200,
          message: "Patient records retrieved successfully",
          data: result.data, // Trả về danh sách hồ sơ bệnh án
        });
      } else {
        // Nếu không tìm thấy hồ sơ bệnh án
        return res.status(404).json({
          status: 404,
          message: result.message, // Trả về thông báo không tìm thấy hồ sơ
        });
      }
    } catch (error) {
      // Nếu có lỗi trong quá trình xử lý
      return next(
        new ApiError(500, "An error occurred while retrieving patient records")
      );
    }
  },
};

module.exports = handlePatientController;
