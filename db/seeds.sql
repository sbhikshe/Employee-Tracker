USE organization_db;

INSERT INTO departments (dep_id, dep_name)
VALUES   
      (1, "Human Resources"),
      (2, "Marketing"),
      (3, "Finance"),
      (4, "Hardware Engineering"),
      (5, "Software Engineering")
;

INSERT INTO roles (role_id, title, salary, department_id )
VALUES (10, "Head of Human Resources", 150000, "001"),
(11, "Recruiter", 100000, "001"),
("020", "Marketing Manager", 200000, "002"),
("021", "Brand Strategist", 125000, "002"),
("022", "Events Coordinator", 75000, "002"),
("030", "Head of Finance", 300000, "003"),
("031", "Accounts Specialist", 125000, "003"),
("032", "Financial Analyst", 125000, "003"),
("040", "Hardware Engineering Manager", 300000, "004"),
("041", "RF Engineer", 150000, "004"),
("042", "Audio Engineer", 150000, "004"),
("043", "PCB Engineer", 150000, "004"),
("050", "Software Engineering Manager", 300000, "005"),
("051", "UI Engineer", 150000, "005"),
("052", "Embedded SW Engineer", 150000, "005"),
("053", "Software Test Engineer", 150000, "005"),
("054", "SW Build Manager", 150000, "005");

INSERT INTO employees(first_name, last_name, title_id, manager_id)
VALUES ("John", "Doe", "010", NULL),
("Jane", "Eyre", "020", NULL),
("Michele", "Dwyer", "030", NULL),
("Lauren", "Graham", "040", NULL),
("Alan", "Pope", "050", NULL),
("Heidi", "Williams", "011", "010"),
("Jennifer", "King", "021", "020"),
("Mark", "Callahan", "031", "030"),
("Peter", "Novak", "041", "040"),
("Matt", "Perry", "051", "050");