const routes = require("express").Router();
const userController = require("../controllers/user.controller");
const uploadImage = require("../middlewares/uploads/profile.upload");
const validator = require("../middlewares/validator.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

routes
  .route("/user")
  .patch(
    authMiddleware.authCheck,
    uploadImage,
    validator.validationResult,
    userController.updateUser
  )
  .get(authMiddleware.authCheck, userController.getUser);

module.exports = routes;
