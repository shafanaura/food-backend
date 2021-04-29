const routes = require("express").Router();
const produkController = require("../controllers/produk.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const uploadImage = require("../middlewares/uploads/produk.upload");

routes
  .route("/produk")
  .post(authMiddleware.authCheck, uploadImage, produkController.createProduk)
  .put(authMiddleware.authCheck, produkController.createProduk)
  .get(authMiddleware.authCheck, produkController.listProduks);
routes.route("/produk/:id").get(produkController.detailProduk);

module.exports = routes;
