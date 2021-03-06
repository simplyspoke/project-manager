import chalk from 'chalk';
import * as fs from 'fs-extra';

export class MainGenerator {
  config = {
    path: `${process.env.HOME}/projects/.config`,
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
      this.config.path = './.projects/.config';
    }
  }

  public async run() {
    const data = this.store;

    await fs.ensureDir(`${this.config.path}`).catch((err) => {
      console.error('Could not create directory:', err);
    });

    await fs
      .writeJson(`${this.config.path}/projects.json`, data, this.options)
      .catch((err) => {
        console.error(err);
      });
  }
}
