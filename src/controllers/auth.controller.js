const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const { APP_KEY } = process.env;
const jwt = require("jsonwebtoken");
const status = require("../helpers/response.helper");
const { validationResult } = require("express-validator");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await userModel.getUsersByCondition({ email });
    this.checkValidation(req, res);
    if (existingUser.length > 0) {
      const compare = await bcrypt.compare(password, existingUser[0].password);
      if (compare) {
        const { id } = existingUser[0];
        const token = jwt.sign({ id }, APP_KEY);
        return res.json({
          status: true,
          message: "Login successfully",
          token,
        });
      } else {
        return status.ResponseStatus(res, 401, "Wrong email or password");
      }
    } else {
      return status.ResponseStatus(res, 401, "Email is not registered");
    }
  } catch (error) {
    return status.ResponseStatus(res, 400, "Bad request");
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password, nama } = req.body;
    this.checkValidation(req, res);
    const isExist = await userModel.getUsersByCondition({ email });
    if (isExist.length < 1) {
      const salt = await bcrypt.genSalt();
      const encryptedPassword = await bcrypt.hash(password, salt);
      const createUser = await userModel.createUser({
        nama,
        email,
        password: encryptedPassword,
      });
      if (createUser.insertId > 0) {
        return status.ResponseStatus(res, 200, "Register Success");
      } else {
        return status.ResponseStatus(res, 400, "Register Failed");
      }
    } else {
      return status.ResponseStatus(
        res,
        400,
        "Register Failed, Email is already exist"
      );
    }
  } catch (error) {
    return status.ResponseStatus(res, 400, error.message);
  }
};

exports.checkValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return status.ResponseStatus(res, 400, "Validation Failed", errors);
  }
};
