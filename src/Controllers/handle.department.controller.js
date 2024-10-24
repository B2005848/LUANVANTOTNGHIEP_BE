const ApiError = require("../api-error");
const handleDepartmentService = require("../Services/handle.department.service");
const handleDepartmentController = {
  //------------------------------------------------------GET LIST DEPARTMENTS FOR PATIENT--------------------------------
  async getDepartmentsForPatient(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const { message, totalPages, itemsPerPage, listDepartments } =
        await handleDepartmentService.getDepartmentsForPatient(page);
      res.json({ page, message, totalPages, itemsPerPage, listDepartments });
      console.log({ message, totalPages, listDepartments });
    } catch (error) {
      next(new ApiError(400, "get all patient fail!"));
    }
  },

  //------------------------------------------------------GET LIST DEPARTMENTS FOR ADMIN--------------------------------
  async getDepartmentsForAdmin(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const { message, totalPages, itemsPerPage, listDepartments } =
        await handleDepartmentService.getDepartmentsForAdmin(page);
      res.json({ page, message, totalPages, itemsPerPage, listDepartments });
      console.log({ message, totalPages, listDepartments });
    } catch (error) {
      next(new ApiError(400, "get all patient fail!"));
    }
  },

  //---------------------------------------------CREATE DEPARTMENT----------------------------------------------------
  async createDepartment(req, res, next) {
    try {
      const { department_id, department_name, description } = req.body;

      const deparmentData = {
        department_id: department_id,
        department_name: department_name,
        description: description,
      };
      const data = await handleDepartmentService.createDepartment(
        deparmentData
      );
      if (data.status === true) {
        res.json({
          message: data.message,
          departmentData: data.departmentData,
        });
      } else {
        res.json({ message: data.message });
      }
    } catch (error) {
      next(new ApiError(400, "get all patient fail!"));
    }
  },

  //------------------------------------- DELETE A DEPARTMENT------------------------------------
  async deleteDepartment(req, res, next) {
    try {
      const department_id = req.params.id;
      const data = await handleDepartmentService.deleteDepartment(
        department_id
      );
      if (data.status === true) {
        res.json({ message: data.message });
      } else {
        res.json({ message: data.message });
      }
    } catch (error) {
      next(new ApiError(400, "get all patient fail!"));
    }
  },

  //-------------------------------- MODIFY INFORMATION DEPARTMENT---------------------------------------
  async modifyDepartment(req, res, next) {
    try {
      const department_id = req.params.id;
      const deparmentData = { ...req.body };

      if (Object.keys(deparmentData).length === 0) {
        return next(new ApiError(400, "No information to update"));
      }

      const resultModify = await handleDepartmentService.modifyDepartment(
        department_id,
        deparmentData
      );
      if (resultModify.status === true) {
        res.json({
          message: resultModify.message,
          departmentData: resultModify.departmentData,
        });
      } else {
        res.json({ message: resultModify.message });
      }
    } catch (error) {
      next(
        new ApiError(
          500,
          `An error occured modify information with ${department_id}`
        )
      );
    }
  },

  //------------------- SEARCH DEPARTMENTS --------------------
  async searchDepartments(req, res, next) {
    try {
      const query = req.query.search;
      const result = await handleDepartmentService.searchDepartments(query);
      if (result.success === true) {
        return res
          .status(200)
          .json({ message: result.message, data: result.data });
      } else {
        return next(new ApiError(404, "Departments not found"));
      }
    } catch (error) {
      console.log(error);
      return next(new ApiError(500, "Internal Server Error"));
    }
  },
};

module.exports = handleDepartmentController;
