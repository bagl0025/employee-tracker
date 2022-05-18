INSERT INTO department (name)
VALUES
('Human Resources'),
('Accounting'),
('Sales'),
('Information Technology'),
('Legal');

INSERT INTO role (title, salary, department_id)
VALUES
('HR Manager', 90000, 1),
('HR admin', 60000, 1),
('Accounting Manager', 100000, 2),
('Finance Professional 1', 90000, 2),
('Finance Professional 2', 80000, 2),
('Sales Manager', 90000, 3),
('Region 1 sales', 75000, 3),
('Region 2 sales', 75000, 3),
('IT Manager', 110000, 4),
('Software Engineer', 100000, 4),
('Desktop Support', 50000, 4),
('Network Engineer', 90000, 4),
('DBA', 100000, 4),
('Legal Manager', 100000, 5),
('Lawyer', 80000, 5),
('Paralegal', 65000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Rois', 'Feye', 1, null),
('Veronica', 'Friel', 3, null),
('Jonas',	'Feares', 6, null),
('Izaak',	'Taffs', 9, null),
('Kassey', 'Barthrop', 14, null),
('Ninetta',	'Pealing', 2, 1),
('Madge',	'Jorry', 4, 3),
('Janette',	'Esmead', 5, 3),
('Daniele',	'Adriani', 7, 6),
('Heinrik',	'Schiell', 8, 6),
('Curtice',	'Batram', 10, 9),
('Mavra',	'Newcomen', 11, 9),
('Zollie', 'Kubu', 12, 9),
('Maryjane', 'Hugk', 13, 9),
('Jules',	'Froggatt', 15, 14),
('Melvyn', 'Wozencroft', 16, 14),
('Ted',	'Jurasek', 10, 9),
('Leese',	'Ligoe', 12, 9),
('Holden', 'Habard', 2, 1),
('Lynnet', 'McArthur', 16, 14);