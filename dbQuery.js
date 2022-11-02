class DbQuery {
  constructor() {
    this.departments = [];
    this.roles = [];
    this.employees = [];
    this.managers = [];

    this.mysql2 = require('mysql2');
    this.db = this.mysql2.createConnection(
    {
      host: 'localhost',
      user: 'root',
      database: 'organization_db'
    },
    console.log("Connected to organization_db")
    );
  }

  /* get methods */
  getDepartments = () => this.departments;
  getRoles = () => this.roles;
  getEmployees = () => this.employees;
  getManagers = () => this.managers;

  initFromDb() {
    /* read the departments */
    this.db.promise().query(`SELECT * FROM departments`)
    .then (([rows, fields]) => {
      this.departments = rows;
      }
    );
  
    /* read the roles */
    this.db.promise().query(`SELECT * FROM roles`)
    .then(([rows, fields]) => {
      this.roles = rows;
    });
  
    /* read the employees */
    this.db.promise().query(`SELECT employee_id, CONCAT_WS(" ", first_name, last_name) AS name FROM employees`)
    .then(([rows, fields]) => {
      this.employees = rows;
    });
  
     /* read the managers */
     this.db.promise().query(`SELECT employee_id, CONCAT_WS(" ", first_name, last_name) AS name FROM employees WHERE manager_id IS NULL`)
     .then(([rows, fields]) => {
      this.managers = rows;
     });
  }

  getDepartmentsFromDb(next) {
    this.db.promise().query(`SELECT * FROM departments`)
    .then (([rows, fields]) => {
        console.log("\n");
        console.table(rows);
        this.departments = rows;
        next();
      }
    );
  }

  getRolesFromDb(next) {
    this.db.promise().query(`SELECT role_id, title, dep_name, salary
              FROM roles INNER JOIN departments ON roles.department_id = departments.dep_id`)
      .then(([rows, fields]) => {
        console.log("\n");
        console.table(rows);
        this.roles = rows;
        next();
      });
  }

  getEmployeesFromDb(next) {
    let queryStr = `SELECT employee_id, CONCAT_WS(" ", first_name, last_name) as name, title, dep_name, salary, NULL as manager
    FROM employees 
    INNER JOIN roles ON title_id = roles.role_id
    INNER JOIN departments ON roles.department_id = departments.dep_id
    WHERE manager_id IS NULL 
    UNION            
    SELECT b.employee_id, CONCAT_WS(" ", b.first_name, b.last_name) as name, title, dep_name, salary, CONCAT_WS(" ", a.first_name, a.last_name) as manager
    FROM employees a, employees b 
    INNER JOIN roles ON title_id = roles.role_id
    INNER JOIN departments ON roles.department_id = departments.dep_id
    WHERE b.manager_id = a.employee_id`;
  
    this.db.promise().query(queryStr)
      .then(([rows, fields]) => {
        console.log("\n");
        console.table(rows);
        this.employees = rows;
        next();
      });
  }

  addDepartmentToDb(departmentName, next) {
    this.db.query(`INSERT INTO departments(dep_name) VALUES ("${departmentName}")`, (err, results) => {
      console.log("added department");
      this.db.query(`SELECT * FROM departments`, (err, results) => {
        console.log("\n");
        console.table(results);
        this.departments = results;
        next();
      });
    });
  }
  
  addRoleToDb(role_id, title, salary, department_id, next) {
    this.db.promise().query(`INSERT INTO roles(role_id, title, salary, department_id) VALUES("${role_id}", "${title}", "${salary}", "${department_id}")`)
    .then(([rows, fields])=> {
      this.db.query(`SELECT * FROM roles`, (err, results) => {
        console.table(results);
        this.roles = results;
        next();
      });
    }); 
  }

  addEmployeeToDb(first_name, last_name, role_id, manager_id, next) {
    this.db.promise().query(`INSERT INTO employees(first_name, last_name, title_id, manager_id)
    VALUES ("${first_name}", "${last_name}", "${role_id}", ${manager_id})`)
    .then(([rows, fields]) => {
      this.db.promise().query(`SELECT * FROM employees`)
      .then(([rows, fields]) => {
          console.log("\n");
          console.table(rows);
          this.employees = rows;
          next();
      });
    });
  }

  updateEmployeeRoleInDb(role_id, employee_id, next) {
    this.db.promise().query(`UPDATE employees SET title_id = "${role_id}" WHERE employee_id = "${employee_id}"`)
    .then(([rows, fields]) => {
      this.db.promise().query(`SELECT * FROM employees`)
      .then(([rows, fields]) => {
          console.log("\n");
          console.table(rows);
          this.employees = rows;
          next();
      });
    });
  }

  updateEmployeeManagerInDb(manager_id, employee_id, next) {
    this.db.promise().query(`UPDATE employees SET manager_id = ${manager_id} WHERE employee_id = "${employee_id}"`)
    .then(([rows, fields]) => {
      this.db.promise().query(`SELECT * FROM employees`)
      .then(([rows, fields]) => {
          console.log("\n");
          console.table(rows);
          this.employees = rows;
          next();
      });
    });
  }

};

module.exports = DbQuery;
