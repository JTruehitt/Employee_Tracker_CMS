const db = require("../connection");

const viewAllDepartments = async () => {
  query = `SELECT * FROM departments`;
  db.query(query, (err, res) => {
    if (err) console.log("error", err);
    console.table(res);
  });
};

const viewAllRoles = async () => {
  query = `SELECT * FROM roles`;
  db.query(query, (err, res) => {
    if (err) console.log("error", err);
    console.table(res);
  });
};

const viewAllEmployees = async () => {
  query = `SELECT * FROM employees`;
  db.query(query, (err, res) => {
    if (err) console.log("error", err);
    console.table(res);
  });
};

module.exports = { viewAllDepartments, viewAllRoles, viewAllEmployees };
