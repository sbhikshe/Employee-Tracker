const inquirer = require('inquirer');
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
          'Add an employee:'
        ],
    name: 'selectedAction'
  }
];

function askUser() {
  inquirer.prompt(topLevelQs)
  .then(response => {
    console.log(response);
    if(response.selectedAction == 'View all departments') {
      dbQuery.getDepartments();
    } else if (response.selectedAction == 'View all roles') {
      dbQuery.getRoles();
    } else if (response.selectedAction == 'View all employees'){
      dbQuery.getEmployees();
    };
  });
}
askUser();
