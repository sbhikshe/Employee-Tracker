const inquirer = require('inquirer');
const { allowedNodeEnvironmentFlags } = require('process');
const dbQuery = require('./dbQuery');

const topLevelQs = [
  {
    type: 'checkbox',
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

function askUser() {
  inquirer.prompt(topLevelQs)
  .then(response => {
    console.log(response);
    if(response.selectedAction == 'View all departments') {
      dbQuery.getDepartments(askUser);
    } else if (response.selectedAction == 'View all roles') {
      dbQuery.getRoles(askUser);
    } else if (response.selectedAction == 'View all employees'){
      dbQuery.getEmployees(askUser);
    } else if(response.selectedAction == 'Add a department:') {
      addDepartment();
    } else {
      console.log("Exiting the system");
      return;
    };
  });
}

function addDepartment() {
  inquirer.prompt(addDepartmentQs)
  .then(response => {
    console.log("Adding department: " + response.departmentName);
    dbQuery.addDepartment(response.departmentName, askUser);
  });
}



askUser();
