#!/usr/bin/env node

import chalk from 'chalk';
import * as figlet from 'figlet';
import * as inquirer from 'inquirer';

const init = () => {
    console.log(
        chalk.green(
            figlet.textSync('CLI Toolkit', {
                horizontalLayout: 'default',
                verticalLayout: 'default',
            })
        )
    );
};

const askQuestions = () => {
    const questions = [
        {
            type: 'list',
            name: 'question',
            message: 'Are you ready to exit?',
            choices: [
                {
                    name: 'Yes',
                    value: 'yes',
                },
            ],
        },
    ];
    return inquirer.prompt(questions);
};

const run = async () => {
    // show script introduction
    init();

    // ask questions
    const answers: { [k: string]: any } = await askQuestions();

    console.log(answers);

    console.log('Exiting!');
};

run();
