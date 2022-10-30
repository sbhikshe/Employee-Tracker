const inquirer = require('inquirer');
const mysql2 = require('mysql2');

//const db = mysql2.createConnection();

const topLevelQs = [
  {
    type: 'checkbox',
    message: "Please select from one of the options below:",
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
    console.log("Selected action:" + response.selectedAction);
  });
}
askUser();
