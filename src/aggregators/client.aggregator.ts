import chalk from 'chalk';
import * as fs from 'fs-extra';

export interface Client {
  name: string;
  path: string;
  projects?: {
    [projectName: string]: any;
  };
}

export class ClientAggregator {
  options = {};
  projectsPath: string;
  store: {
    [key: string]: any;
  };

  constructor(projectsPath: string, store: object) {
    this.projectsPath = projectsPath;
    this.store = store;
  }

  public async run() {
    console.info(process.env.HOME);
    let pathContents = await fs.readdir(this.projectsPath);

    this.store.clients = pathContents
      .filter(item => {
        const stats = fs.lstatSync(`${this.projectsPath}/${item}`);

        return stats.isDirectory();
      })
      .map(
        (item): Client => {
          return {
            name: item,
            path: `${this.projectsPath}/${item}`,
          };
        }
      );
  }
}
