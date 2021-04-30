const produkModel = require("../models/produk.model");
const warungModel = require("../models/warung.model");
const status = require("../helpers/response.helper");
const { APP_URL, FILE_URL } = process.env;
const qs = require("querystring");

exports.createProduk = async (req, res) => {
  try {
    const data = req.body;
    const initialResult = await warungModel.getOwner(req.userData.id);
    const produkData = {
      ...data,
      id_warung: initialResult[0].id,
      picture: req.file.filename || null,
    };
    const results = await produkModel.createProduk(produkData);
    if (results.affectedRows > 0) {
      return status.ResponseStatus(res, 200, "Produk successfully created");
    } else {
      return status.ResponseStatus(res, 400, "Failed to create Produk");
    }
  } catch (err) {
    return status.ResponseStatus(res, 400, err.message);
  }
};

exports.listProduks = async (req, res) => {
  const cond = { ...req.query };
  cond.search = cond.search || "";
  cond.page = Number(cond.page) || 1;
  cond.limit = Number(cond.limit) || 5;
  cond.dataLimit = cond.limit * cond.page;
  cond.offset = (cond.page - 1) * cond.limit;
  cond.sort = cond.sort || "id";
  cond.order = cond.order || "ASC";

  const pageInfo = {
    nextLink: null,
    prevLink: null,
    totalData: 0,
    totalPage: 0,
    currentPage: 0,
  };

  const countData = await produkModel.getProduksCountByCondition(cond);
  pageInfo.totalData = countData[0].totalData;
  pageInfo.totalPage = Math.ceil(pageInfo.totalData / cond.limit);
  pageInfo.currentPage = cond.page;
  const nextQuery = qs.stringify({
    ...req.query,
    page: cond.page + 1,
  });
  const prevQuery = qs.stringify({
    ...req.query,
    page: cond.page - 1,
  });
  pageInfo.nextLink =
    cond.page < pageInfo.totalPage
      ? APP_URL.concat(`produk?${nextQuery}`)
      : null;
  pageInfo.prevLink =
    cond.page > 1 ? APP_URL.concat(`produk?${prevQuery}`) : null;
  const results = await produkModel.getProduksByCondition(cond);
  const modified = results.map((item) => ({
    ...item,
    picture:
      item.picture === null
        ? item.picture
        : FILE_URL.concat(`produk/${item.picture}`),
  }));
  if (results) {
    return status.ResponseStatus(
      res,
      200,
      "List of all Produks",
      modified,
      pageInfo
    );
  }
};

exports.updateProduk = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const initialResult = await produkModel.getProdukById(id);
  if (initialResult.length > 0) {
    const results = await produkModel.updateProduk(id, data);
    if (results) {
      return status.ResponseStatus(res, 200, "data successfully updated", {
        ...initialResult[0],
        ...data,
      });
    }
  } else {
    return status.ResponseStatus(res, 400, "Failed to update data");
  }
};

exports.detailProduk = async (req, res) => {
  const { id } = req.params;
  const results = await produkModel.getProdukById(id);
  if (results.length > 0) {
    return status.ResponseStatus(res, 200, "Details of Produk", results[0]);
  } else {
    return status.ResponseStatus(res, 400, "Produk not exists");
  }
};
