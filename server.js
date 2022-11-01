const inquirer = require('inquirer');
const { allowedNodeEnvironmentFlags } = require('process');
//const dbQuery = require('./dbQuery');

const mysql2 = require('mysql2');
const db = mysql2.createConnection(
  {
    host: 'localhost',
    user: 'root',
    database: 'organization_db'
  },
  console.log("Connected to organization_db")
);

let departments = [];
let roles = [];
let employees = [];
let managers = [];

const topLevelQs = [
  {
    type: 'list',
    message: "What would you like to do?",
    choices: [
          'View all departments', 
          'View all roles', 
          'View all employees',
          'Add a department:',
          'Add a role:',
          'Add an employee:',
          'Update existing employee:',
          'Exit'
        ],
    name: 'selectedAction'
  }
];

const addDepartmentQs = [
  {
    type: 'input',
    message: "Enter the name of the department:",
    name: 'departmentName',
    validate (name) {
      if(!name || name == "") {
        return ("Please enter a name");
      }
      return true;
    }
  }
];

const addRoleQs = [
  {
    type: 'number',
    message: "Enter the role id",
    name: 'role_id',
    validate (role_id) {
      // TBD: should check that its not already taken
      if (typeof role_id !== 'number') {
        return ("Please enter a number");
      }
      return true;
    }
  },
  {
    type: 'input',
    message: "Enter the title for this role:",
    name: 'title',
    validate (title) {
      if(!title || title == "") {
        return ("Please enter a title");
      }
      return true;
    }
  },
  {
    type: 'number',
    message: "Enter the salary for this role:",
    name: 'salary',
    validate (salary) {
      if (typeof salary !== 'number') {
        return ("Please enter a number");
      }
      return true;
    }
  },
  {
    type: 'list',
    message: "Please select a department:",
    name: 'department',
    choices: []
  }
];

const addEmployeeQs = [
  {
    type: 'input',
    message: "Enter the first name for the employee:",
    name: 'first_name',
    validate (first_name) {
      if(!first_name || first_name == "") {
        return ("Please enter a valid string for the first name");
      }
      return true;
    }    
  },
  {
    type: 'input',
    message: "Enter the last name for the employee:",
    name: 'last_name',
    validate (last_name) {
      if(!last_name || last_name == "") {
        return ("Please enter a valid string for the last name");
      }
      return true;
    }    
  },
  {
    type: 'list',
    message: "Please select a role:",
    name: 'role',
    choices: []
  },
  {
    type: 'list',
    message: "Please select a manager:",
    name: 'manager',
    choices: []
  }

];

const updateEmployeeQs = [
  {
    type: 'list',
    message: "Choose employee to update:",
    name: 'name',
    choices: []
  },
  {
    type: 'list',
    message: "Please select a role:",
    name: 'role',
    choices: []
  },  
  {
    type: 'list',
    message: "Please select a manager:",
    name: 'manager',
    choices: []
  }
];

function askUser() {
  readDbForSetup();
  inquirer.prompt(topLevelQs)
  .then(response => {
    console.log(response);
    if(response.selectedAction == 'View all departments') {
      getDepartments();
    } else if (response.selectedAction == 'View all roles') {
      getRoles();
    } else if (response.selectedAction == 'View all employees'){
      getEmployees();
    } else if(response.selectedAction == 'Add a department:') {
      addDepartment();
    } else if(response.selectedAction == 'Add a role:') {
      addRole();
    } else if(response.selectedAction == 'Add an employee:') {
      addEmployee();
    } else if(response.selectedAction == 'Update existing employee:') {
      updateEmployee();
    }else {
      console.log("Exiting the system");
      return;
    };
  });
}

function readDbForSetup() {
  /* read the departments */
  db.promise().query(`SELECT * FROM departments`)
  .then (([rows, fields]) => {
      console.log("\n");
      //console.table(rows);
      departments = rows;
    }
  );

  /* read the roles */
  db.promise().query(`SELECT * FROM roles`)
  .then(([rows, fields]) => {
    console.log("\n");
    //console.table(rows);
    roles = rows;
  });

  /* read the employees */
  db.promise().query(`SELECT employee_id, CONCAT_WS(" ", first_name, last_name) AS name FROM employees`)
  .then(([rows, fields]) => {
      console.log("\n");
      //console.table(rows);
      employees = rows;
  });

   /* read the managers */
   db.promise().query(`SELECT employee_id, CONCAT_WS(" ", first_name, last_name) AS name FROM employees WHERE manager_id IS NULL`)
   .then(([rows, fields]) => {
       console.log("\n");
       //console.table(rows);
       managers = rows;
   });
}
function getDepartments(next) {
  console.log("getting departments from the database");

  db.promise().query(`SELECT * FROM departments`)
  .then (([rows, fields]) => {
      console.log("\n");
      console.table(rows);
      departments = rows;
      askUser();
    }
  );
}

function getRoles(next) {
  console.log("getting roles from the database");
    db.promise().query(`SELECT role_id, title, salary, dep_name 
              FROM roles INNER JOIN departments ON roles.department_id = departments.dep_id`)
      .then(([rows, fields]) => {
        console.log("\n");
        console.table(rows);
        roles = rows;
        askUser();
      });
}

function getEmployees(next) {
  console.log("getting employees from the database");
  db.promise().query(`SELECT employee_id, first_name, last_name, title, dep_name, salary 
            FROM employees INNER JOIN roles ON employees.title_id = roles.role_id
            INNER JOIN departments ON roles.department_id = departments.dep_id`)
    .then(([rows, fields]) => {
      console.log("\n");
      console.table(rows);
      employees = rows;
      askUser();
    });
}

function addDepartment() {
  inquirer.prompt(addDepartmentQs)
  .then(response => {
    console.log("Adding department: " + response.departmentName);
    db.query(`INSERT INTO departments(dep_name) VALUES ("${response.departmentName}")`, (err, results) => {
      console.log("added department");
      db.query(`SELECT * FROM departments`, (err, results) => {
        console.log("\n");
        console.table(results);
        departments = results;
        askUser();
      });
    });
  });
}

function addRole() {
  for(const item of departments) {
    addRoleQs[3].choices.push(item.dep_name);
  }
  console.log(addRoleQs[3].choices);
  inquirer.prompt(addRoleQs)
  .then(response => {
    console.log("Adding a role: ");
    console.log("role_id = " + response.role_id);
    console.log("title = " + response.title);
    console.log("salary = " + response.salary);
    console.log("department = " + response.department);

    let department_id;
    for (const item of departments) {
      if(item.dep_name == response.department)
      department_id = item.dep_id;
    }
    db.promise().query(`INSERT INTO roles(role_id, title, salary, department_id) VALUES("${response.role_id}", "${response.title}", "${response.salary}", "${department_id}")`)
    .then(([rows, fields])=> {
      db.query(`SELECT * FROM roles`, (err, results) => {
        console.table(results);
        roles = results;
        askUser();
      });
    });          
  });  
}

function addEmployee() {
  /* get the roles */
  for (const item of roles) {
    addEmployeeQs[2].choices.push(item.title);
  }
  /* get the managers */
  for(const item of managers) {
      addEmployeeQs[3].choices.push(item.name);
  }
  inquirer.prompt(addEmployeeQs)
  .then(response => {
    console.log("Adding an employee: ");
    console.log("first_name = " + response.first_name);
    console.log("last_name = " + response.last_name);
    console.log("role = " + response.role);
    console.log("manager = " + response.manager);

    let role_id;
    for (const item of roles) {
      if(item.title == response.role) {
        role_id = item.role_id;
      }
    }

    let manager_id;
    for(const item of managers) {
      if(response.manager == item.name){
        manager_id = item.employee_id;
      }
    }

    db.promise().query(`INSERT INTO employees(first_name, last_name, title_id, manager_id)
    VALUES ("${response.first_name}", "${response.last_name}", "${role_id}", "${manager_id}")`)
    .then(([rows, fields]) => {
      db.promise().query(`SELECT * FROM employees`)
      .then(([rows, fields]) => {
          console.log("\n");
          console.table(rows);
          employees = rows;
          askUser();
      });
    });
  });
}

function updateEmployee() {
  /* get the employees */
  for (const item of employees) {
    updateEmployeeQs[0].choices.push(item.name);
  }
  /* get the roles */
  for (const item of roles) {
    updateEmployeeQs[1].choices.push(item.title);
  }
  /* get the managers */
  for(const item of managers) {
      updateEmployeeQs[2].choices.push(item.name);
  }
  updateEmployeeQs[2].choices.push("None");

  inquirer.prompt(updateEmployeeQs)
  .then(response => {
    console.log("Adding an employee: ");
    console.log("name = " + response.name);
    console.log("role = " + response.role);
    console.log("manager = " + response.manager);

    let employee_id;
    for(const item of employees) {
      if(item.name == response.name) {
        employee_id = item.employee_id;
      }
    }
    let role_id;
    for (const item of roles) {
      if(item.title == response.role) {
        role_id = item.role_id;
      }
    }

    let manager_id;
    if(response.manager == "None") {
      manager_id = null;
    } else {
      for(const item of managers) {
        if(response.manager == item.name){
          manager_id = item.employee_id;
        }
      }
    }

    db.promise().query(`UPDATE employees SET title_id = "${role_id}", manager_id = ${manager_id} WHERE employee_id = "${employee_id}"`)
    .then(([rows, fields]) => {
      db.promise().query(`SELECT * FROM employees`)
      .then(([rows, fields]) => {
          console.log("\n");
          console.table(rows);
          employees = rows;
          askUser();
      });
    });
  });
}

askUser();
