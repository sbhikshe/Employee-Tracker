# Employee-Tracker
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

## Table Of Contents
* [Description](#description)
* [Video](#video)
* [Installation](#installation)
* [Usage](#usage)
* [Tests](#tests)
* [Code Snippets](#code-snippets)
* [Technologies](#technologies)
* [License](#license)
* [Author Links](#author-links)

## Description
This application offers the user an interface to create and manage an organization database or a content management system. The Inquirer.js package is used to provide the user with the interface to select the actions they want to do with the database. The application receives the user input and uses the MySQL2 library to immplement the actions on the database. 

## Video

This is a video recording of the options available to manage the database:

[Webm link](https://drive.google.com/file/d/1afEsIx0FwKRmeV_1C24EBxPK71XQOQJC/view) \
[MP4 link](https://drive.google.com/file/d/1jeUy9Ep02-Px3Eujft2184QE6MZLQD_b/view?usp=sharing)


## Installation
The application can be started from the command line.

1. Set up the 'organization_db' database using the following commands: 

Start in the project directory:

``` 
$ cd db
$ mysql -u root -p
mysql> source schema.sql 
mysql> source seeds.sql
^C (to quit the mysql shell)
```

2. Install packages using npm

Return to the project directory from the db directory, and install packages:

```
$ cd ..
$ npm i
```

## Usage

Start the application from the command line with the following command in the project directory:

```
$ node server.js
```

## Tests

The queries were tested on the database using the mysql shell. Some of these are listed in db/query.sql. The server and the dbQuery classes were tested together using the application. The input is validated for the Add Department, Add Role and Add Employee options since they require the user to enter information.


## Code Snippets

#### 1. Server receives user request through Inquirer to view all the roles, and calls on the DbQuery class to get the roles. 

```
 function viewRoles() {
  dbQuery.getRolesFromDb(askUser); 
}
     
```

#### 2. The DbQuery class method uses MySQL query to get the roles and the corresponding departments from the database. This returns a promise for the query action. The query finishes and the results are displayed on the console. The method calls back to the server to prompt for the next user action.

```
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

```

## Technologies
- Javascript
- express.js framework
- MySQL2 library
- Inquirer library

## References
- [MySQL2](https://www.npmjs.com/package/mysql2)
- [Inquirer](https://github.com/SBoudrias/Inquirer.js)

## License
This application is covered under the [MIT License](https://opensource.org/licenses/MIT).

## Author Links
[GitHub](https://github.com/sbhikshe)\
[LinkedIn](https://www.linkedin.com/in/sripriya-bhikshesvaran-8520992/)
