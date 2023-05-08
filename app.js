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
      "UPDATE an EMPLOYEE MANAGER",
      "VIEW EMPLOYEES by MANAGER",
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
      addEmployee();
      break;
    case "UPDATE an EMPLOYEE ROLE":
      updateEmployeeRole();
      break;
    case "UPDATE an EMPLOYEE MANAGER":
      updateEmployeeManager();
      break;
    case "VIEW EMPLOYEES by MANAGER":
      viewEmployeesByManager();
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

  let query = `INSERT INTO departments (name) VALUES (?)`;
  let values = newDepartment;
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

  let query = `INSERT INTO roles (title, salary, department_id) VALUES (? ? ?)`;
  let values = response;
  db.query(query, values, (err, res) => {
    if (err) console.log("error", err);
    console.log("New role added successfully!");
    viewAllRoles();
  });
};

// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

const addEmployee = async () => {
  const getRoles = async () => {
    let query = "SELECT id, title FROM roles";
    let rolesObj = await db.query(query);

    let roles = rolesObj[0].map((role) => role.title);
    console.log(roles);
    return roles;
  };

  const getManagerIDs = async () => {
    let query = `SELECT id, CONCAT(first_name, ' ', last_name) AS manager FROM employees WHERE manager_id IS NULL`;
    let managerObj = await db.query(query);

    let managers = managerObj[0].map((m) => m.id);
    console.log(managers);
    return managers;
  };

  let { first_name, last_name, role, manager } = await inquirer.prompt([
    {
      name: "first_name",
      type: "input",
      message: "Employee first name",
    },
    {
      name: "last_name",
      type: "input",
      message: "Employee last name",
    },
    {
      name: "role",
      type: "list",
      message: "Employee role",
      choices: await getRoles(),
    },
    {
      name: "manager",
      type: "list",
      message: "Employee manager",
      choices: async () => {
        let ids = await getManagerIDs();
        let options = [...ids, "null"];
        return options;
      },
    },
  ]);

  if (manager === "null") {
    manager = null;
  }

  let query = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ( ?, ?, (SELECT id FROM roles WHERE title=?), ?)`;
  try {
    const data = await db.query(query, [first_name, last_name, role, manager]);
    console.log("Employee successfully added to database.");
    viewAllEmployees();
  } catch (err) {
    console.log("error: ", err);
  }
};

// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database

const updateEmployeeRole = async () => {
  const getEmployees = async () => {
    let query = `SELECT CONCAT(id, ': ', last_name, ', ', first_name) AS employee FROM employees`;
    let employeeObj = await db.query(query);
    console.log(employeeObj);
    let employees = employeeObj[0].map((e) => e.employee);
    console.log("employees: ", employees);
    return employees;
  };

  const getRoles = async () => {
    let query = "SELECT CONCAT(id, ': ', title) AS roles FROM roles";
    let rolesObj = await db.query(query);

    let roles = rolesObj[0].map((role) => role.roles);
    return roles;
  };

  const { employee, newRole } = await inquirer.prompt([
    {
      name: "employee",
      type: "list",
      message: `Which employee's role would you like to change?`,
      choices: await getEmployees(),
    },
    {
      name: "newRole",
      type: "list",
      message: `What is the employee's new role?`,
      choices: await getRoles(),
    },
  ]);

  let employeeID = employee.split(":")[0];
  let newRoleID = newRole.split(":")[0];

  try {
    let query = `UPDATE employees SET role_id = ? WHERE id = ?`;
    const data = db.query(query, [newRoleID, employeeID]);
    console.log(`Employee role updated!`);
    viewAllEmployees();
  } catch (err) {
    console.log("error: ", err);
  }
};

// BONUS:

// Update employee managers.
const updateEmployeeManager = async () => {
  const getEmployees = async () => {
    let query = `SELECT CONCAT(id, ': ', last_name, ', ', first_name) AS employee FROM employees`;
    let employeeObj = await db.query(query);
    console.log(employeeObj);
    let employees = employeeObj[0].map((e) => e.employee);
    console.log("employees: ", employees);
    return employees;
  };

  const getManagers = async () => {
    let query = "SELECT CONCAT(id, ': ', last_name, ', ', first_name) AS manager FROM employees WHERE manager_id IS NULL";
    let managerObj = await db.query(query);

    let managers = managerObj[0].map(m => m.manager);
    return managers;
  };

  const { employee, newManager } = await inquirer.prompt([
    {
      name: "employee",
      type: "list",
      message: `Which employee's manager would you like to change?`,
      choices: await getEmployees(),
    },
    {
      name: "newManager",
      type: "list",
      message: `Who is the employee's new manager?`,
      choices: await getManagers(),
    },
  ]);

  let employeeID = employee.split(":")[0];
  let newManagerID = newManager.split(":")[0];

  try {
    let query = `UPDATE employees SET manager_id = ? WHERE id = ?`;
    const data = db.query(query, [newManagerID, employeeID]);
    console.log(`Employee manager updated!`);
    viewAllEmployees();
  } catch (err) {
    console.log("error: ", err);
  }
};


// View employees by manager.

const viewEmployeesByManager = async () => {

  // I wasn't sure if this meant view all employees ordered by manager, or if you should be able to select a manager and then view their employees. I decided to try to do both and this inital prompt is just to determine which method to use. 

  const { method } = await inquirer.prompt([{
    name: 'method',
    type: 'list',
    message: 'How would you like the data presented?',
    choices: ['All employees ordered by manager.', 'Select a manager and only view their employees.']
  }])
console.log(method)
  switch (method) {

    case 'All employees ordered by manager.':

      query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department_name, r.salary, CONCAT(e2.first_name, ' ', e2.last_name) AS manager FROM employees AS e INNER JOIN roles AS r ON e.role_id = r.id INNER JOIN departments AS d ON d.id = r.department_id LEFT JOIN employees AS e2 ON e.manager_id = e2.id ORDER BY manager`;
      const data = await db.query(query);
      console.table(data[0]);
      continuePrompt();

    break;

    case 'Select a manager and only view their employees.':

    const getManagers = async () => {
      let query = "SELECT CONCAT(id, ': ', last_name, ', ', first_name) AS manager FROM employees WHERE manager_id IS NULL";
      let managerObj = await db.query(query);
  
      let managers = managerObj[0].map(m => m.manager);
      return managers;
    };

    const { manager } = await inquirer.prompt([{
      name: 'manager',
      type: 'list',
      message: `Which manager's employees would you like to view?`,
      choices: await getManagers()
    }]);

    let managerID = parseInt(manager.split(':')[0]);
    console.log(managerID)
    try {
      let query = `SELECT * FROM employees WHERE manager_id = ?`
    const data = await db.query(query, managerID);
      console.table(data[0]);
      continuePrompt()
    } catch (err) {
      console.log('error :', err)
    }
    break;
  }
  

}

// View employees by department.

// Delete departments, roles, and employees.

// View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.

init();
