/*
const mysql2 = require('mysql2');

const db = mysql2.createConnection(
  {
    host: 'localhost',
    user: 'root',
    database: 'organization_db'
  },
  console.log("Connected to organization_db")
);

var departments = [];
let roles = [];
let employees = [];

function getDepartments(next) {
  console.log("getting departments from the database");

  db.promise().query(`SELECT * FROM departments`)
  .then (([rows, fields]) => {
      console.log("\n");
      console.table(rows);
      //departments = rows;
      next(rows);
    }
  );
  
 
    db.query(`SELECT * FROM departments`, (err, results) => {
      console.log("\n");
      console.table(results);
      departments = results;
      console.log("departments[]" + departments);
      next? next(): console.log("updated departments");
    });
    
}

function getRoles(next) {
  console.log("getting roles from the database");
    db.query(`SELECT role_id, title, salary, dep_name 
              FROM roles INNER JOIN departments ON roles.department_id = departments.dep_id`,
             (err, results) => { 
      console.log("\n");
      console.table(results);
      roles = results;
      next();
    });
}

function getEmployees(next) {
  console.log("getting employees from the database");
  db.query(`SELECT employee_id, first_name, last_name, title, dep_name, salary 
            FROM employees INNER JOIN roles ON employees.title_id = roles.role_id
            INNER JOIN departments ON roles.department_id = departments.dep_id`,
    (err, results) => { 
    console.table(results);
    employees = results;
    next();
  });
}

function addDepartment(name, next) {
  console.log(`adding a new department to the database:${name} `);
  db.query(`INSERT INTO departments(dep_name) VALUES ("${name}")`, (err, results) => {
    console.log("added department");
    // do db.query to update departments[]
    db.query(`SELECT * FROM departments`, (err, results) => {
      console.table(results);
      departments = results;
    });
    next();
  });
}

module.exports = {
  getDepartments,
  getRoles,
  getEmployees,
  addDepartment,
  departments,
  roles,
  employees
};
*/
