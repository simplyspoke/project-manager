#!/usr/bin/env node

import chalk from 'chalk';
import * as figlet from 'figlet';
import * as inquirer from 'inquirer';

import { ClientAggregator, ProjectAggregator } from './aggregators';
import { MainGenerator } from './generators';

const store = {};

const aggregators = {
    client: new ClientAggregator(store),
    project: new ProjectAggregator(store),
};

const generators = {
    main: new MainGenerator(store),
};
const init = () => {
    console.log(
        chalk.green(
            figlet.textSync('Project Manager', {
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
            message: 'What would you like to do?',
            choices: [
                {
                    name: 'Run Aggregators',
                    value: 'aggregate',
                },
                {
                    name: 'Exit',
                    value: 'exit',
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

    if (answers.question === 'aggregate') {
        await aggregators.client.run();
        await generators.main.run();
    }

    console.log('Exiting!');
};

run();
