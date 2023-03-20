// const router = require("express").Router();
// const verifyJWT = require("../../middlewares/verifyJWT");
// const verifyRoles = require("../../middlewares/verifyRoles");
// const ROLES_LIST = require("../../config/roles_list");

// const {
//   getAllEmployees,
//   createSingleEmployee,
//   updateSingleEmployee,
//   deleteSingleEmployee,
//   getSingleEmployee,
// } = require("../../controllers/employeesController");

// router
//   .route("/")
//   .get(verifyJWT, verifyRoles(ROLES_LIST.User), getAllEmployees)
//   .post(verifyJWT, verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), createSingleEmployee)
//   .put(verifyJWT, verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), updateSingleEmployee)
//   .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin), deleteSingleEmployee);

// router.route("/:id").get(verifyJWT, getSingleEmployee);

// module.exports = router;
