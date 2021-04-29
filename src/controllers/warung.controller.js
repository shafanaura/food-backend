const warungModel = require("../models/warung.model");
const status = require("../helpers/response.helper");
const { APP_URL } = process.env;
const qs = require("querystring");

exports.createWarung = async (req, res) => {
  try {
    const data = req.body;
    const warungData = {
      nama_warung: data.nama_warung,
      picture: req.file.filename || null,
    };
    const results = await warungModel.createWarung(warungData);
    if (results.affectedRows > 0) {
      return status.ResponseStatus(res, 200, "Warung successfully created");
    } else {
      return status.ResponseStatus(res, 400, "Failed to create Warung");
    }
  } catch (err) {
    return status.ResponseStatus(res, 400, err.message);
  }
};

exports.listWarungs = async (req, res) => {
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

  const countData = await warungModel.getWarungsCountByCondition(cond);
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
      ? APP_URL.concat(`warung?${nextQuery}`)
      : null;
  pageInfo.prevLink =
    cond.page > 1 ? APP_URL.concat(`warung?${prevQuery}`) : null;

  const results = await warungModel.getWarungsByCondition(cond);
  if (results) {
    return status.ResponseStatus(
      res,
      200,
      "List of all Warungs",
      results,
      pageInfo
    );
  }
};

exports.updateWarung = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const initialResult = await warungModel.getWarungById(id);
  if (initialResult.length > 0) {
    const results = await warungModel.updateWarung(id, data);
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

exports.detailWarung = async (req, res) => {
  const { id } = req.params;
  const results = await warungModel.getWarungById(id);
  if (results.length > 0) {
    return status.ResponseStatus(res, 200, "Details of Warung", results[0]);
  } else {
    return status.ResponseStatus(res, 400, "Warung not exists");
  }
};
