const db = require("../connection");

const viewAllDepartments = async () => {
  query = `SELECT * FROM departments`;
  db.query(query, (err, res) => {
    if (err) console.log("error", err);
    console.table(res);
  });
};

module.exports = { viewAllDepartments };
