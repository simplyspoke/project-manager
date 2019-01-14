import chalk from 'chalk';
import * as fs from 'fs-extra';

export class MainGenerator {
  projectsPath: string;
  options: fs.WriteOptions = {
    spaces: 2,
  };
  store: {
    [key: string]: any;
  };

  constructor(projectsPath: string, store: object) {
    this.projectsPath = projectsPath;
    this.store = store;
  }

  public async run() {
    const data = this.store;

    await fs.ensureDir(`${process.env.HOME}/.projects`).catch(err => {
      console.error('Could not creat directory:', err);
    });

    await fs
      .writeJson(
        `${process.env.HOME}/.projects/projects.json`,
        data,
        this.options
      )
      .catch(err => {
        console.error(err);
      });
  }
}
