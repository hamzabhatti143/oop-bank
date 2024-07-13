#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
class bankAccount {
    accountNumber;
    balance;
    owner;
    constructor(accountnumber, initialBalance = 0, owner) {
        this.accountNumber = accountnumber;
        this.balance = initialBalance;
        this.owner = owner;
    }
    deposit(amount) {
        if (amount <= 0) {
            console.log(chalk.magenta(`Please Enter Some Positive Amount`));
        }
        this.balance += amount;
        console.log(chalk.bold.greenBright(`Deposited ${amount}. New balance is ${this.balance}.`));
    }
    withdraw(amount) {
        if (amount <= 0) {
            console.log(chalk.red(`Please Enter Specific Amount for Withdraw`));
        }
        if (this.balance < amount) {
            console.log(chalk.redBright(`Insuficient Balance`));
        }
        if (amount < this.balance) {
            this.balance -= amount;
            console.log(chalk.greenBright(`With Drawal ${amount}. Current balance is ${this.balance}.`));
        }
        else {
            console.log(chalk.redBright(`Please Enter Valid Amount`));
        }
    }
    getBalance() {
        return this.balance;
    }
    getAccountNumber() {
        return this.accountNumber;
    }
    getOwner() {
        return this.owner;
    }
}
class Bank {
    accounts = [];
    createAccount(owner, accountNumber, initialBalance = 0) {
        if (!accountNumber) {
            accountNumber = this.accounts.length + 1;
        }
        else if (this.accounts.find(account => account.getAccountNumber() === accountNumber)) {
            console.log(chalk.redBright(`Account number ${accountNumber} already exists.`));
        }
        const newAccount = new bankAccount(accountNumber, initialBalance, owner);
        this.accounts.push(newAccount);
        console.log(chalk.greenBright(`Account created for ${owner} with account number ${accountNumber}.`));
        return newAccount;
    }
    getAccount(accountNumber) {
        return this.accounts.find(account => account.getAccountNumber() === accountNumber);
    }
    transfer(fromAccountNumber, toAccountNumber, amount) {
        let fromAccount = this.getAccount(fromAccountNumber);
        let toAccont = this.getAccount(toAccountNumber);
        if (!fromAccount || !toAccont) {
            console.log(chalk.red(`Accounts are invalid`));
            return;
        }
        if (fromAccount?.getBalance() < amount) {
            console.log(chalk.red(`Enter a Valid Amount`));
            return;
        }
        fromAccount.withdraw(amount);
        toAccont.deposit(amount);
    }
}
const bank = new Bank();
async function mainMenu() {
    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like ?",
            choices: ["Create Account", "Deposit Ammount", "WithDraw Amount", "Transfer Amount", "Check Balance", "Exit"]
        }
    ]);
    switch (answers.action) {
        case 'Create Account':
            await createAccount();
            break;
        case 'Deposit Ammount':
            await deposit();
            break;
        case 'WithDraw Amount':
            await withdraw();
            break;
        case 'Transfer Amount':
            await transfer();
            break;
        case 'Check Balance':
            await checkBalance();
            break;
        case 'Exit':
            console.log("Good Bye!");
            process.exit();
    }
    await mainMenu();
}
async function createAccount() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'owner',
            message: 'Enter the account owner\'s name:',
        },
        {
            type: 'input',
            name: 'accountNumber',
            message: 'Enter the account number (leave empty for automatic generation):',
            validate: (input) => {
                if (!input)
                    return true;
                return !isNaN(parseInt(input)) || 'Please enter a valid number';
            },
        },
        {
            type: 'input',
            name: 'initialBalance',
            message: 'Enter the initial balance:',
            validate: (input) => !isNaN(parseFloat(input)) || 'Please enter a valid number',
        },
    ]);
    const accountNumber = answers.accountNumber ? parseInt(answers.accountNumber) : undefined;
    const initialBalance = parseFloat(answers.initialBalance);
    bank.createAccount(answers.owner, accountNumber, initialBalance);
}
async function deposit() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'accountNumber',
            message: 'Enter the account number:',
            validate: (input) => !isNaN(parseInt(input)) || 'Please enter a valid number',
        },
        {
            type: 'input',
            name: 'amount',
            message: 'Enter the amount to deposit:',
            validate: (input) => !isNaN(parseFloat(input)) || 'Please enter a valid number',
        },
    ]);
    const accountNumber = parseInt(answers.accountNumber);
    const amount = parseFloat(answers.amount);
    const account = bank.getAccount(accountNumber);
    if (account) {
        account.deposit(amount);
    }
    else {
        console.log('Account not found.');
    }
}
async function withdraw() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'accountNumber',
            message: 'Enter the account number:',
            validate: (input) => !isNaN(parseInt(input)) || 'Please enter a valid number',
        },
        {
            type: 'input',
            name: 'amount',
            message: 'Enter the amount to withdraw:',
            validate: (input) => !isNaN(parseFloat(input)) || 'Please enter a valid number',
        },
    ]);
    const accountNumber = parseInt(answers.accountNumber);
    const amount = parseFloat(answers.amount);
    const account = bank.getAccount(accountNumber);
    if (account) {
        account.withdraw(amount);
    }
    else {
        console.log('Account not found.');
    }
}
async function transfer() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'fromAccountNumber',
            message: 'Enter the sender account number:',
            validate: (input) => !isNaN(parseInt(input)) || 'Please enter a valid number',
        },
        {
            type: 'input',
            name: 'toAccountNumber',
            message: 'Enter the receiver account number:',
            validate: (input) => !isNaN(parseInt(input)) || 'Please enter a valid number',
        },
        {
            type: 'input',
            name: 'amount',
            message: 'Enter the amount to transfer:',
            validate: (input) => !isNaN(parseFloat(input)) || 'Please enter a valid number',
        },
    ]);
    const fromAccountNumber = parseInt(answers.fromAccountNumber);
    const toAccountNumber = parseInt(answers.toAccountNumber);
    const amount = parseFloat(answers.amount);
    bank.transfer(fromAccountNumber, toAccountNumber, amount);
}
async function checkBalance() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'accountNumber',
            message: 'Enter the account number:',
            validate: (input) => !isNaN(parseInt(input)) || 'Please enter a valid number',
        },
    ]);
    const accountNumber = parseInt(answers.accountNumber);
    const account = bank.getAccount(accountNumber);
    if (account) {
        console.log(`The balance for account ${accountNumber} is ${account.getBalance()}.`);
    }
    else {
        console.log('Account not found.');
    }
}
// Start the main menu
mainMenu();
