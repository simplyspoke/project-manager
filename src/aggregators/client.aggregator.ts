import chalk from 'chalk';
import * as fs from 'fs-extra';

import { Store } from './../index';
import { Project } from './project.aggregator';

export interface Client {
  name: string;
  path: string;
  projects: Project[];
}

export class ClientAggregator {
  options = {};
  projectsPath: string;
  store: Store;

  constructor(projectsPath: string, store: Store) {
    this.projectsPath = projectsPath;
    this.store = store;
  }

  public async run() {
    let pathContents = await fs.readdir(this.projectsPath);

    this.store.clients = pathContents
      .filter((item) => {
        const stats = fs.lstatSync(`${this.projectsPath}/${item}`);

        return stats.isDirectory();
      })
      .map(
        (item): Client => {
          return {
            name: item,
            path: `${this.projectsPath}/${item}`,
            projects: [],
          };
        }
      );
  }
}
