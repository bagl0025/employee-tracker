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
        else if (choices === 'Quit') {
            db.end();
        }
    });
};

// functions called above
viewDepartments = () => {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        mainMenu();
    })
}

viewRoles = () => {
    const sql = `SELECT role.id, role.title, department.name AS department, role.salary
               FROM role
               INNER JOIN department ON role.department_id = department.id`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        mainMenu();
    })
}

viewEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(mgr.first_name, ' ', mgr.last_name) AS manager
               FROM employee
               LEFT JOIN role ON employee.role_id = role.id
               LEFT JOIN department ON role.department_id = department.id
               LEFT JOIN employee mgr ON employee.manager_id = mgr.id`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
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
                        console.log('man', answer.manager)
                        newEmployee.push(answer.manager);
                    console.log(newEmployee)

                           const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                                    VALUES (?, ?, ?, ?)`;
                        db.query(sql, newEmployee, (err, result) => {
                            if (err) throw err;
                            console.log(result)
                            console.log('Added' + newEmployee[0] + " to the database");
                            mainMenu();
                        });
                    });
                })          
      
            })
    })
    }) 



                }
mainMenu();

// and update an employee role => prompted to select an employee to update and their new role and this information is updated in the database
//bonus points
//refactor - check