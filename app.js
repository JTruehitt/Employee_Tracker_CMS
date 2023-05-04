const inquirer = require("inquirer");
// const query = require('./employee_db/queries/index')
const mysql = require("mysql2");

// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
const activitySelect = [
  {
    name: "activity",
    type: "list",
    message: "Welcome! What would you like to do?",
    choices: [
      "VIEW all DEPARTMENTS",
      "VIEW all ROLES",
      "VIEW all EMPLOYEES",
      "ADD a NEW DEPARTMENT",
      "ADD a NEW ROLE",
      "ADD a NEW EMPLOYEE",
      "UPDATE an EMPLOYEE ROLE",
    ],
  },
];

const db = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "employee_db",
  })
  .promise();

// db.connect((err) => {
//   if (err) throw err;
//   console.log("Database connection successful.");
//   init();
// });

const init = async () => {
  const { activity } = await inquirer.prompt(activitySelect);

  switch (activity) {
    case "VIEW all DEPARTMENTS":
      viewAllDepartments();
      break;
    case "VIEW all ROLES":
      viewAllRoles();
      break;
    case "VIEW all EMPLOYEES":
      viewAllEmployees();
      break;
    case "ADD a NEW DEPARTMENT":
      addDepartment();
      break;
    case "ADD a NEW ROLE":
      addRole();
      break;
    case "ADD a NEW EMPLOYEE":
      //put redirect here;
      break;
    case "UPDATE an EMPLOYEE ROLE":
      //put redirect here;
      break;
    // case '':
    //     //put redirect here;
    //     break;
  }
};

const continuePrompt = async () => {
  let { response } = await inquirer.prompt({
    name: "response",
    type: "list",
    message: "Anything else?",
    choices: ["yes", "no"],
  });

  if (response === "yes") init();
  else {
    console.log("Bye!");
    process.exit();
  }
};

// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids

const viewAllDepartments = async () => {
  let query = `SELECT * FROM departments`;
  const data = await db.query(query);
  console.table(data[0]);
  continuePrompt();
};

// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role

const viewAllRoles = async () => {
  query = `SELECT roles.title, roles.id, departments.name AS department_name, roles.salary FROM roles INNER JOIN departments ON roles.department_id = departments.id`;
  const data = await db.query(query);
  console.table(data[0]);
  continuePrompt();
};

// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

const viewAllEmployees = async () => {
  query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department_name, r.salary, CONCAT(e2.first_name, ' ', e2.last_name) AS manager FROM employees AS e INNER JOIN roles AS r ON e.role_id = r.id INNER JOIN departments AS d ON d.id = r.department_id LEFT JOIN employees AS e2 ON e.manager_id = e2.id`;
  const data = await db.query(query);
  console.table(data[0]);
  continuePrompt();
};

// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database

const addDepartment = async () => {
  const { newDepartment } = await inquirer.prompt({
    name: "newDepartment",
    type: "input",
    message: "What is the name of the new department?",
  });

  query = `INSERT INTO departments (name) VALUES (?)`;
  values = newDepartment;
  const data = await db.query(query, values);
  console.log("New department added successfully!");
  viewAllDepartments();
};

// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

const addRole = async () => {
  const getDepartments = async () => {
    let departmentsObj = await db.query(
      "SELECT DISTINCT name FROM departments"
    );

    let departments = departmentsObj[0].map((dept) => dept.name);
    return departments;
  };

  const response = await inquirer.prompt([
    {
      name: "newRole",
      type: "input",
      message: "What is the name of the new role?",
    },
    {
      name: "salary",
      type: "input",
      message: "What is the salary of the new role?",
    },
    {
      name: "department",
      type: "list",
      message: "Which department is the new role in?",
      choices: await getDepartments(),
    },
  ]);

  query = `INSERT INTO roles (title, salary, department_id) VALUES (? ? ?)`;
  values = response;
  db.query(query, values, (err, res) => {
    if (err) console.log("error", err);
    console.log("New role added successfully!");
    viewAllRoles();
  });
};

// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database

// BONUS:

// Update employee managers.

// View employees by manager.

// View employees by department.

// Delete departments, roles, and employees.

// View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.

init();
