class DbQuery {
  constructor() {

    /* Maintain these updated lists for the server to use 
      for inquirer - to show as dropdown lists for user to choose from */
    this.departments = [];
    this.roles = [];
    this.employees = [];
    this.managers = [];

    /* set up db connection */
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

  /* get methods - for the server */
  getDepartments = () => this.departments;
  getRoles = () => this.roles;
  getEmployees = () => this.employees;
  getManagers = () => this.managers;

  /* Initial set up to read the seeded database and get all the info 
    - departments, roles, employees, and managers */
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

  /* Query function for 'View all departments' */
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

  /* for View all roles option */
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

  /* for View all Employees option */
  /* This query is the union of two subqueries */
  /* The first subquery retrieves the information for all managers */
  /* The second subquery retrieves the information for all non-managers along
    with the names of their managers - using employee 'a' to refer to the managers.
    Employee 'b' refers to the employee */

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

  /* Add a department option - insert the new department to the db */
  /* First query to insert, second to query the updated list of departments */
  addDepartmentToDb(departmentName, next) {
    this.db.promise().query(`INSERT INTO departments(dep_name) VALUES ("${departmentName}")`)
      .then(([rows, fields]) => {
        console.log("added department");
        this.db.promise().query(`SELECT * FROM departments`)
        .then(([rows, fields])=>{
          console.log("\n");
          console.table(rows);
          this.departments = rows;
          next();
        });
      });
  }
  
  /* Add a new role - with department, salary, title and role id */
  /* First query to insert the new role, second to get the updated list of roles */
  addRoleToDb(role_id, title, salary, department_id, next) {
    this.db.promise().query(`INSERT INTO roles(role_id, title, salary, department_id) VALUES("${role_id}", "${title}", "${salary}", "${department_id}")`)
    .then(([rows, fields])=> {
      this.db.promise().query(`SELECT * FROM roles`)
      .then(([rows, fields]) => {
        console.table(rows);
        this.roles = rows;
        next();
      });
    }); 
  }

  /* Add a new employee - with first and last names, title, department and manager */
  /* first query to insert the employee, second to get the updated list of employees */
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

  /* Update an employee's role */
  /* first query to update the existing record for the employee, 
    the second query to get the updated list of employees */
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

  /* Update and employee's manager */
    /* first query to update the existing record for the employee, 
    the second query to get the updated list of employees */
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
