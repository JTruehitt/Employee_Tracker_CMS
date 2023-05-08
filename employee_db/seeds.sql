INSERT INTO departments (name)
VALUES
  ('Sales'),
  ('Marketing'),
  ('Human Resources');


INSERT INTO roles (title, salary, department_id)
VALUES
  ('Sales Manager', 95000.00, 1),
  ('Sales Executive', 65000.00, 1),
  ('Marketing Manager', 90000.00, 2),
  ('Marketing Executive', 60000.00, 2),
  ('HR Manager', 100000.00, 3),
  ('HR Executive', 70000.00, 3);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, 1),
  ('Bob', 'Johnson', 2, 1),
  ('Mary', 'Davis', 3, NULL),
  ('Alex', 'Brown', 4, 4),
  ('Sarah', 'Lee', 5, NULL),
  ('James', 'Kim', 6, 6);