SELECT * FROM departments;
SELECT * FROM roles;
SELECT * FROM employees;

SELECT role_id, title, salary, dep_name FROM roles 
INNER JOIN departments ON roles.department_id = departments.dep_id;

INSERT INTO departments(dep_name) VALUES ("Sales")

INSERT INTO roles(role_id, title, salary, department_id) VALUES("11", "Senior Engineer", "100000", 4);

INSERT INTO employees(first_name, last_name, title_id, manager_id)
    VALUES ("${response.first_name}", "${response.last_name}", "${role_id}", "${manager_id}");

SELECT role_id AS Id, title AS Title FROM roles;
SELECT employee_id AS Id, CONCAT_WS(" ", first_name, last_name) AS Name FROM employees WHERE manager_id IS NULL;

SELECT employee_id, CONCAT_WS(" ", first_name, last_name) AS name FROM employees;

UPDATE employees SET title_id = 50, manager_id = null WHERE employee_id = 11;

SELECT employee_id, CONCAT_WS(" ", first_name, last_name) as name, title, dep_name, salary 
            FROM employees INNER JOIN roles ON employees.title_id = roles.role_id
            INNER JOIN departments ON roles.department_id = departments.dep_id;

SELECT CONCAT_WS(" ", b.first_name, b.last_name) as manager from employees a, employees b WHERE a.manager_id = b.employee_id;

SELECT employee_id, CONCAT_WS(" ", first_name, last_name) as name, title, dep_name, salary, NULL as manager
            FROM employees 
            INNER JOIN roles ON title_id = roles.role_id
            INNER JOIN departments ON roles.department_id = departments.dep_id
            WHERE manager_id IS NULL 
UNION            
SELECT b.employee_id, CONCAT_WS(" ", b.first_name, b.last_name) as name, title, dep_name, salary, CONCAT_WS(" ", a.first_name, a.last_name) as manager
            FROM employees a, employees b 
            INNER JOIN roles ON title_id = roles.role_id
            INNER JOIN departments ON roles.department_id = departments.dep_id
            WHERE b.manager_id = a.employee_id

