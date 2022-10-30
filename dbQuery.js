const mysql2 = require('mysql2');

const db = mysql2.createConnection(
  {
    host: 'localhost',
    user: 'root',
    database: 'organization_db'
  },
  console.log("Connected to organization_db")
);

function getDepartments() {
  console.log("getting departments from the database");
  db.query(`SELECT * FROM departments`, (err, results) => {
    console.log(results);
  });
}

function getRoles() {
  console.log("getting departments from the database");
  db.query(`SELECT * FROM roles`, (err, results) => {
    console.log(results);
  });
}

function getEmployees() {
  console.log("getting departments from the database");
  db.query(`SELECT * FROM employees`, (err, results) => {
    console.log(results);
  });
}

module.exports = {
  getDepartments,
  getRoles,
  getEmployees
};
