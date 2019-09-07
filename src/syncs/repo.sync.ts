import { queue, AsyncQueue } from 'async';
import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as sh from 'shelljs';

import { Store } from '../index';

interface ProfileFileObject {
  projectGroupNamesByDirectory: {
    [path: string]: string;
  };
  [property: string]: any;
}

export class RepoSync {
  path = `${process.env.HOME}/projects`;
  options: fs.WriteOptions = {
    spaces: 2,
  };
  queue: AsyncQueue<Promise<void>>;

  constructor() {
    if (process.env.NODE_ENV === 'development') {
      this.path = './.projects';
    }

    this.queue = queue<Promise<void>>(
      async (task: Promise<void>, done: Function) => {
        await task.then(() => done());
      },
      1
    );
    this.queue.pause();
  }

  public async run() {
    const projects: Store = await fs.readJSON(
      `${this.path}/.config/projects.json`
    );
    const lastSync = await fs
      .readJSON(`${this.path}/.config/last-sync.json`)
      .catch(() => undefined);

    if (lastSync === projects.generated) {
      return console.log(chalk.green('File are already up to date.'));
    }

    await this.process(projects);

    this.queue.resume();
    await this.queue.drain();

    await fs.writeJson(
      `${this.path}/.config/last-sync.json`,
      {
        lastSync: projects.generated,
      },
      this.options
    );
  }

  private async process(projects: Store) {
    const promises = projects.clients.map(async (client) => {
      await fs.ensureDir(`${this.path}/${client.name}`).catch();

      const projectPromises = client.projects.map(async (project) => {
        const path = `${this.path}/${client.name}/${project.name}`;
        if (await fs.pathExists(path)) {
          return console.log(chalk.green(`${project.name} already exists!`));
        }

        if (project.repository === 'NONE') {
          return console.log(
            chalk.yellow(`${project.name} doesn't have a repo.`)
          );
        }

        console.log(chalk.yellow(`Cloning ${project.name}...`));

        this.queue.push(
          new Promise((resolve) => {
            sh.exec(`git clone ${project.repository} ${path}`, (error) => {
              if (error) {
                console.error(error);
              }
              resolve();
            });
          })
        );
      });

      await Promise.all(projectPromises);
    });

    await Promise.all(promises);
  }
}
