const routes = require("express").Router();
const warungController = require("../controllers/warung.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const uploadImage = require("../middlewares/uploads/warung.upload");

routes
  .route("/warung")
  .post(authMiddleware.authCheck, uploadImage, warungController.createWarung)
  .put(authMiddleware.authCheck, warungController.createWarung)
  .get(authMiddleware.authCheck, warungController.listWarungs);
routes.route("/warung/:id").get(warungController.detailWarung);

module.exports = routes;
