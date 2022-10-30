DROP DATABASE IF EXISTS organization_db;
CREATE DATABASE organization_db;

USE organization_db;


CREATE TABLE departments (
  id INT NOT NULL PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
  id INT NOT NULL PRIMARY KEY,
  title VARCHAR(50) NOT NULL,
  salary INT NOT NULL,
  department_id INT NOT NULL,
  FOREIGN KEY (department_id)
  REFERENCES departments(id)
);

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    title_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (title_id)
    REFERENCES roles(id),
    FOREIGN KEY (manager_id)
    REFERENCES roles(id)
);