#!/usr/bin/env node

import chalk from 'chalk';
import * as figlet from 'figlet';
import * as inquirer from 'inquirer';

import { Client, ClientAggregator, ProjectAggregator } from './aggregators';
import {
  GitKrackenGenerator,
  MainGenerator,
  VSCodeGenerator,
} from './generators';

export interface Store {
  clients: Client[];
}

const store: Store = { clients: [] };
const projectsPath = `${process.env.HOME}/projects`;

const aggregators = {
  client: new ClientAggregator(projectsPath, store),
  project: new ProjectAggregator(projectsPath, store),
};

const generators = {
  gitKracken: new GitKrackenGenerator(store),
  main: new MainGenerator(store),
  vsCode: new VSCodeGenerator(store),
};
const init = () => {
  // Clear the screen and reset the cursor
  process.stdout.write('\x1B[2J\x1B[0f');
  console.log(
    chalk.green(
      figlet.textSync('Project Manager', {
        horizontalLayout: 'default',
        verticalLayout: 'default',
      })
    )
  );
};

const askQuestions = (): Promise<{ [k: string]: any }> => {
  const questions = [
    {
      type: 'list',
      name: 'question',
      message: 'What would you like to do?',
      choices: [
        {
          name: 'Generate Config',
          value: 'generate',
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
  let running = true;

  init();
  while (running) {
    running = await ask();
  }

  console.log('Exiting...');
};

const ask = async (): Promise<boolean> => {
  // used to determine if the tool should keep running.
  let running = true;
  try {
    // ask questions
    const answers = await askQuestions();

    switch (answers.question) {
      case 'generate':
        await aggregators.client.run();
        await aggregators.project.run();
        await generators.main.run();
        await generators.vsCode.run();
        await generators.gitKracken.run();
        break;
      case 'exit':
        running = false;
    }
  } catch (error) {
    console.error(error);
    running = false;
  } finally {
    return running;
  }
};

void run();
