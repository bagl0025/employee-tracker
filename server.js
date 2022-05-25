const inquirer = require('inquirer');
const mysql = require('mysql2');
const conTab = require('console.table');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'anonymous',
    password: 'anonsqlpass', //this password is useless for anything else
    database: 'company'
  },
  console.log('Connected to the company database.')
);

// maybe try figlet
// banner created at https://manytools.org/hacker-tools/ascii-banner/
console.log('#######                                                 ');
console.log('#       #    # #####  #       ####  #   # ###### ###### ');
console.log('#       ##  ## #    # #      #    #  # #  #      #      ');
console.log('#####   # ## # #    # #      #    #   #   #####  #####  ');
console.log('#       #    # #####  #      #    #   #   #      #      ');
console.log('#       #    # #      #      #    #   #   #      #      ');
console.log('####### #    # #      ######  ####    #   ###### ###### ');
console.log('                                                        ');
console.log('#     #                                                 ');
console.log('##   ##   ##   #    #   ##    ####  ###### #####        ');
console.log('# # # #  #  #  ##   #  #  #  #    # #      #    #       ');
console.log('#  #  # #    # # #  # #    # #      #####  #    #       ');
console.log('#     # ###### #  # # ###### #  ### #      #####        ');
console.log('#     # #    # #   ## #    # #    # #      #   #        ');
console.log('#     # #    # #    # #    #  ####  ###### #    #       ');

// main menu prompts
const mainMenu = () => {
    inquirer.prompt ([
        {
            type: 'list',
            name: 'choices',
            message: 'Please select an option from the list.',
            choices: ['View all departments',
                      'View all roles',
                      'View all employees',
                      'Add a department',
                      'Add a role',
                      'Add an employee',
                      'Update an employee',
                      'View department budget',
                      'Quit'
                    ]
        }
    ])
    .then((answer) => {
        const {choices} = answer; //deconstruct answer
        if (choices === 'View all departments') {
            viewDepartments();
        }
        else if (choices === 'View all roles') {
            viewRoles();
        }
        else if (choices === 'View all employees') {
            viewEmployees();
        }
        else if (choices === 'Add a department') {
            addDepartment();
        }
        else if (choices === 'Add a role') {
            addRole();
        }
        else if (choices === 'Add an employee') {
            addEmployee();
        }
        else if (choices === 'Update an employee') {
            updateEmployee();
        }
        else if (choices === 'View department budget') {
            viewBudget();
        }
        else if (choices === 'Quit') {
            db.end();
        }
    });
};

// functions called above
viewDepartments = () => {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);
        mainMenu();
    })
}

viewRoles = () => {
    const sql = `SELECT role.id, role.title, department.name AS department, role.salary
               FROM role
               INNER JOIN department ON role.department_id = department.id`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);
        mainMenu();
    })
}

viewEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(mgr.first_name, ' ', mgr.last_name) AS manager
               FROM employee
               LEFT JOIN role ON employee.role_id = role.id
               LEFT JOIN department ON role.department_id = department.id
               LEFT JOIN employee mgr ON employee.manager_id = mgr.id`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);
        mainMenu();
    })
}

addDepartment = () => {
    inquirer.prompt ([
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of the department?',
            validate: department => {
                if (!department) {
                    console.log('Please provide a name');
                    return false;
                }
                return true;
            }
        }
    ])
    .then((answer) => {
        const sql = `INSERT INTO department (name)
                     VALUES (?)`;
        db.query(sql, answer.department, (err, result) => {
            if (err) throw err;
            console.log('Added ' + answer.department + ' to the database'); 
            mainMenu();
        });
    })
}

addRole = () => {
    inquirer.prompt ([
        {
            type: 'input', 
            name: 'name',
            message: "What is the name of the role?",
            validate: name => {
            if (!name) {
                console.log('Please provide a name');
                return false;
            }
            return true;
            }
        },
        {
            type: 'input', 
            name: 'salary',
            message: "What is the salary of this role?",
            validate: salary => {
            if (isNaN(salary)) {
                console.log('Please enter a salary');
                return false;
            }
            return true;
            }
        }
    ])
    .then(answer => {
        const newRole = [answer.name, answer.salary];
        const sql = `SELECT name, id FROM department`; 
  
        db.query(sql, (err, deptSelection) => {
            if (err) throw err; 
            const department = deptSelection.map(({ name, id }) => ({ name: name, id: id }));
            inquirer.prompt ([
            {
                type: 'list', 
                name: 'department',
                message: "Which department does the role belong to?",
                choices: department
            }
        ])  
        .then(answer => {
            newRole.push(answer.department);
            const sql = `INSERT INTO role (title, salary, department_id)
                         VALUES (?, ?, ?)`;

            db.query(sql, newRole, (err, result) => {
                if (err) throw err;
                console.log('Added' + newRole[0] + " to the database");
                mainMenu();
            });
        }); 
        });
    });
}

addEmployee = () => {
    inquirer.prompt ([
        {
            type: 'input', 
            name: 'firstName',
            message: "What is the employee's first name?",
            validate: firstName => {
            if (!firstName) {
                console.log('Please provide a name');
                return false;
            }
            return true;
            }
        },
        {
            type: 'input', 
            name: 'lastName',
            message: "What is the employee's last name?",
            validate: lastName => {
            if (!lastName) {
                console.log('Please provide a name');
                return false;
            }
            return true;
            }
        },
        {
            type: 'input', 
            name: 'salary',
            message: "What is the salary of this role?",
            validate: salary => {
            if (isNaN(salary)) {
                console.log('Please enter a salary');
                return false;
            }
            return true;
            }
        }
    ])
    .then(answer => {
        const newEmployee = [answer.firstName, answer.lastName];
        const sql = `SELECT id, title FROM role`; 
        db.query(sql, (err, roleSelection) => {
        if (err) throw err; 
        const role = roleSelection.map(({ title, id }) => ({ name: title, value: id }));
        inquirer.prompt ([
        {
            type: 'list', 
            name: 'role',
            message: "What is the employee's role?",
            choices: role
        }
        ])
        .then(answer => {
            newEmployee.push(answer.role);
            const sqlMan = `SELECT * FROM employee WHERE manager_id IS NULL`;

            db.query(sqlMan, (err, managerSelection) => {
                if (err) throw err; 
                const manager = managerSelection.map(({ id, first_name, last_name }) => ({ name: first_name + ' ' + last_name, value: id })); 
                nobody = {name: "None", value: null};
                manager.push(nobody);
                console.log(manager)
                inquirer.prompt ([
                {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: manager
                }
                ])
                .then(answer => {
                    newEmployee.push(answer.manager);
                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                                VALUES (?, ?, ?, ?)`;
                    db.query(sql, newEmployee, (err, result) => {
                    if (err) throw err;
                    console.log('Added ' + newEmployee[0] + ' ' + newEmployee[1] + ' to the database');
                    mainMenu();
                    });
                });
            });          
        });
      });
    });
}

updateEmployee = () => {
    const sql = `SELECT * FROM employee`;
    db.query(sql, (err, employeeSelection) => {
    if (err) throw err; 
    const employee = employeeSelection.map(({id, first_name, last_name}) => ({name: first_name + ' ' + last_name, value: id}));
    inquirer.prompt([
        {
          type: 'list',
          name: 'name',
          message: "Which employee's role do you want to update?",
          choices: employee
        }
    ])
    .then(answer => {
          const update = []; 
          update.push(answer.name);
          const sql = `SELECT * FROM role`;
  
          db.query(sql, (err, newRole) => {
            if (err) throw err; 
            const updateRole = newRole.map(({id, title}) => ({name: title, value: id}));
            console.log('bcb', updateRole)
            inquirer.prompt([
                {
                  type: 'list',
                  name: 'role',
                  message: "Which role do you want to assign the selected employee?",
                  choices: updateRole
                }
            ])
            .then(answer => {
                update.unshift(answer.role); 
                const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
  
                db.query(sql, update, (err, result) => {
                    if (err) throw err;
                    console.log("Updated employee's role");
                    mainMenu();
                });
             });
        });
      });
    });
};

viewBudget = () => {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, deptSelection) => {
    if (err) throw err; 
    const dept = deptSelection.map(({name, id}) => ({name: name, value: id}));
    inquirer.prompt ([
        {
          type: 'list',
          name: 'name',
          message: "Which department's budget would you like to see?",
          choices: dept
        }
    ])
    .then(answer => {
        const deptName = dept[answer.name - 1].name; 
        console.log(deptName)    
        const sql = `SELECT department_id AS id,
                   SUM(salary) AS budget 
                   FROM role 
                   WHERE department_id = ?;`
    
        db.query(sql, answer.name, (err, result) => {
            if (err) throw err;
            console.log('The budget for ' + deptName + ' is $' + result[0].budget); 
            mainMenu(); 
        });
    });
  });            
};
  
mainMenu();
