const status = require("../helpers/response.helper");
const fs = require("fs");
const { validationResult } = require("express-validator");

exports.validationResult = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return status.ResponseStatus(res, 400, errors.array()[0].msg);
  }
  return next();
};
