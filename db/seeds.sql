USE organization_db;

INSERT INTO departments (dep_name)
VALUES   
      ("Human Resources"),
      ("Marketing"),
      ("Finance"),
      ("Hardware Engineering"),
      ("Software Engineering")
;

INSERT INTO roles (role_id, title, salary, department_id )
VALUES (10, "Head of Human Resources", 150000, 001),
(11, "Recruiter", 100000, 1),
(20, "Marketing Manager", 200000, 2),
(21, "Brand Strategist", 125000, 2),
(22, "Events Coordinator", 75000, 2),
(30, "Head of Finance", 300000, 3),
(31, "Accounts Specialist", 125000, 3),
(32, "Financial Analyst", 125000, 3),
(40, "Hardware Engineering Manager", 300000, 4),
(41, "RF Engineer", 150000, 4),
(42, "Audio Engineer", 150000, 4),
(43, "PCB Engineer", 150000, 4),
(50, "Software Engineering Manager", 300000, 5),
(51, "UI Engineer", 150000, 5),
(52, "Embedded SW Engineer", 150000, 5),
(53, "Software Test Engineer", 150000, 5),
(54, "SW Build Manager", 150000, 5);

INSERT INTO employees(first_name, last_name, title_id, manager_id)
VALUES ("John", "Doe", 10, NULL),
("Jane", "Eyre", 20, NULL),
("Michele", "Dwyer", 30, NULL),
("Lauren", "Graham", 40, NULL),
("Alan", "Pope", 50, NULL),
("Heidi", "Williams", 11, 1),
("Jennifer", "King", 21, 2),
("Mark", "Callahan", 31, 3),
("Peter", "Novak", 41, 4),
("Matt", "Perry", 51, 5);