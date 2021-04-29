const dbConn = require("../helpers/db.helper");
const table = "warung";

exports.createWarung = (data = {}) => {
  return new Promise((resolve, reject) => {
    dbConn.query(
      `INSERT INTO ${table} (${Object.keys(
        data
      ).join()}) VALUES (${Object.values(data)
        .map((item) => `"${item}"`)
        .join(",")})`,
      (err, res, field) => {
        if (err) reject(err);
        resolve(res);
      }
    );
  });
};

exports.getWarungsCountByCondition = (cond) => {
  return new Promise((resolve, reject) => {
    const query = dbConn.query(
      `
    SELECT COUNT(nama_warung) as totalData FROM
    ${table} WHERE nama_warung LIKE "%${cond.search}%"
    ORDER BY ${cond.sort} ${cond.order}
    `,
      (err, res, field) => {
        if (err) reject(err);
        resolve(res);
      }
    );
    console.log(query.sql);
  });
};

exports.getWarungsByCondition = (cond) => {
  return new Promise((resolve, reject) => {
    dbConn.query(
      `SELECT * FROM ${table} m
			WHERE m.nama_warung LIKE "%${cond.search}%"
			ORDER BY ${cond.sort} ${cond.order} 
			LIMIT ${cond.dataLimit} OFFSET ${cond.offset}`,
      (err, res, field) => {
        if (err) reject(err);
        resolve(res);
      }
    );
  });
};

exports.updateWarung = (id, data) => {
  return new Promise((resolve, reject) => {
    const key = Object.keys(data);
    const value = Object.values(data);
    dbConn.query(
      `UPDATE ${table}
			SET ${key.map((item, index) => `${item}="${value[index]}"`)}
			WHERE id=${id}`,
      (err, res, field) => {
        if (err) reject(err);
        resolve(res);
      }
    );
  });
};

exports.getWarungById = async (id, cb) => {
  return new Promise((resolve, reject) => {
    dbConn.query(
      `
    SELECT * FROM ${table} WHERE id=${id}
    `,
      (err, res, field) => {
        if (err) reject(err);
        resolve(res);
      }
    );
  });
};

exports.checkWarung = (data = []) => {
  return new Promise((resolve, reject) => {
    dbConn.query(
      `
    SELECT * FROM ${table}
    WHERE id IN (${data.map((item) => item).join()})
    `,
      (err, res, field) => {
        if (err) reject(err);
        resolve(res);
      }
    );
  });
};
