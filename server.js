const inquirer = require('inquirer');
const { allowedNodeEnvironmentFlags } = require('process');
const DbQuery = require('./DbQuery');
const dbQuery = new DbQuery();

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
          'Update employee role:',
          'Update employee manager:',
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
      if (!role_id || typeof role_id !== 'number') {
        return ("Please enter a number");
      } else {
      // should check that its not already taken
        let roles = dbQuery.getRoles();
        for (const item of roles) {
          if (role_id == item.role_id) {
            return ("Id already exists, please enter a different number");
          }
        }
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

const updateEmployeeRoleQs = [
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
  }
];

const updateEmployeeManagerQs = [
  {
    type: 'list',
    message: "Choose employee to update:",
    name: 'name',
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
  dbQuery.initFromDb();
  inquirer.prompt(topLevelQs)
  .then(response => {
    if(response.selectedAction == 'View all departments') {
      viewDepartments();
    } else if (response.selectedAction == 'View all roles') {
      viewRoles();
    } else if (response.selectedAction == 'View all employees'){
      viewEmployees();
    } else if(response.selectedAction == 'Add a department:') {
      addDepartment();
    } else if(response.selectedAction == 'Add a role:') {
      addRole();
    } else if(response.selectedAction == 'Add an employee:') {
      addEmployee();
    } else if(response.selectedAction == 'Update employee role:') {
      updateEmployeeRole();
    } else if(response.selectedAction == 'Update employee manager:') {
      updateEmployeeManager();
    } else {
      console.log("Exiting the system");
      process.exit();
    };
  });
}

function viewDepartments() {
  dbQuery.getDepartmentsFromDb(askUser);
}

function viewRoles() {
  dbQuery.getRolesFromDb(askUser); 
}

function viewEmployees() {
  dbQuery.getEmployeesFromDb(askUser);
}

function addDepartment() {
  inquirer.prompt(addDepartmentQs)
  .then(response => {
    console.log("Adding department: " + response.departmentName);
    dbQuery.addDepartmentToDb(response.departmentName, askUser);
  });
}

function addRole() {
  let departments = dbQuery.getDepartments();
  for(const item of departments) {
    addRoleQs[3].choices.push(item.dep_name);
  }
  inquirer.prompt(addRoleQs)
  .then(response => {
    let department_id;
    for (const item of departments) {
      if(item.dep_name == response.department)
      department_id = item.dep_id;
    }
    dbQuery.addRoleToDb(response.role_id, response.title, response.salary, department_id, askUser);         
  });  
}

function addEmployee() {
  /* get the roles */
  let roles = dbQuery.getRoles();
  for (const item of roles) {
    addEmployeeQs[2].choices.push(item.title);
  }
  /* get the managers */
  let managers = dbQuery.getManagers();
  for(const item of managers) {
      addEmployeeQs[3].choices.push(item.name);
  }
  addEmployeeQs[3].choices.push("None");

  inquirer.prompt(addEmployeeQs)
  .then(response => {
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

    dbQuery.addEmployeeToDb(response.first_name, response.last_name, role_id, manager_id, askUser);
  });
}

function updateEmployeeRole() {
  /* get the employees */
  let employees = dbQuery.getEmployees();
  for (const item of employees) {
    updateEmployeeRoleQs[0].choices.push(item.name);
  }
  /* get the roles */
  let roles = dbQuery.getRoles();
  for (const item of roles) {
    updateEmployeeRoleQs[1].choices.push(item.title);
  }

  inquirer.prompt(updateEmployeeRoleQs)
  .then(response => {
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

    dbQuery.updateEmployeeRoleInDb(role_id, employee_id, askUser);
  });
}

function updateEmployeeManager() {
  /* get the employees */
  let employees = dbQuery.getEmployees();
  for (const item of employees) {
    updateEmployeeManagerQs[0].choices.push(item.name);
  }
  /* get the managers */
  let managers = dbQuery.getManagers();
  for(const item of managers) {
      updateEmployeeManagerQs[1].choices.push(item.name);
  }
  updateEmployeeManagerQs[1].choices.push("None");

  inquirer.prompt(updateEmployeeManagerQs)
  .then(response => {
    let employee_id;
    for(const item of employees) {
      if(item.name == response.name) {
        employee_id = item.employee_id;
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

    dbQuery.updateEmployeeManagerInDb(manager_id,employee_id, askUser);
  });
}

askUser();
