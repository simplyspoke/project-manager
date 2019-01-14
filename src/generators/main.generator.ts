import chalk from 'chalk';
import * as fs from 'fs-extra';

export class MainGenerator {
  config = {
    path: `${process.env.HOME}/.projects`,
  };
  options: fs.WriteOptions = {
    spaces: 2,
  };
  store: {
    [key: string]: any;
  };

  constructor(store: object) {
    this.store = store;

    if (process.env.NODE_ENV === 'development') {
      this.config.path = '.';
    }
  }

  public async run() {
    const data = this.store;

    await fs.ensureDir(`${this.config.path}/.projects`).catch(err => {
      console.error('Could not creat directory:', err);
    });

    await fs
      .writeJson(
        `${this.config.path}/.projects/projects.json`,
        data,
        this.options
      )
      .catch(err => {
        console.error(err);
      });
  }
}
