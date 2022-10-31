const mysql2 = require('mysql2');

const db = mysql2.createConnection(
  {
    host: 'localhost',
    user: 'root',
    database: 'organization_db'
  },
  console.log("Connected to organization_db")
);

function getDepartments(next) {
  db.query(`SELECT * FROM departments`, (err, results) => {
    console.log("\n");
    console.table(results);
    next();    
  });
}

function getRoles(next) {
  console.log("getting departments from the database");
    db.query(`SELECT role_id, title, salary, dep_name 
              FROM roles INNER JOIN departments ON roles.department_id = departments.dep_id`,
             (err, results) => { 
      console.log("\n");
      console.table(results);
      next();
    });
}

function getEmployees(next) {
  console.log("getting departments from the database");
  db.query(`SELECT employee_id, first_name, last_name, title, dep_name, salary 
            FROM employees INNER JOIN roles ON employees.title_id = roles.role_id
            INNER JOIN departments ON roles.department_id = departments.dep_id`,
    (err, results) => { 
    console.table(results);
    next();
  });
}

function addDepartment(name, next) {
  console.log(`adding a new department to the database:${name} `);
  db.query(`INSERT INTO departments(dep_name) VALUES ("${name}")`, (err, results) => {
    console.log("added department");
    next();
  });
}

module.exports = {
  getDepartments,
  getRoles,
  getEmployees,
  addDepartment
};
