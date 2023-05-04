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
      "ADD a DEPARTMENT",
      "ADD a ROLE",
      "ADD an EMPLOYEE",
      "UPDATE an EMPLOYEE ROLE",
    ],
  },
];

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Database connection successful.");
  init();
});

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
    case "ADD a DEPARTMENT":
      //put redirect here;
      break;
    case "ADD a ROLE":
      //put redirect here;
      break;
    case "ADD an EMPLOYEE":
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
};

}
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids

const viewAllDepartments = async () => {
  let query = `SELECT * FROM departments`;
  // const rows = await db.query(query)
  // console.log(rows)
  db.query(query, (err, res) => {
    if (err) console.log("error", err);
    console.table(res);
    continuePrompt();
  });
  console.log("hellloooo");
  // continuePrompt();
};

// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role

const viewAllRoles = async () => {
  query = `SELECT * FROM roles`;
  db.query(query, (err, res) => {
    if (err) console.log("error", err);
    console.table(res);
  });
};

// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

const viewAllEmployees = async () => {
  query = `SELECT * FROM employees`;
  db.query(query, (err, res) => {
    if (err) console.log("error", err);
    console.table(res);
  });
};

// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database

// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database
