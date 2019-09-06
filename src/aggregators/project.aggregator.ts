import chalk from 'chalk';
import * as fs from 'fs-extra';
const ini = require('ini');

import { Store } from './../index';

export interface Project {
  name: string;
  path: string;
  repository: any;
}

export class ProjectAggregator {
  projectsPath: string;
  store: Store;

  constructor(projectsPath: string, store: Store) {
    this.projectsPath = projectsPath;
    this.store = store;
  }

  public async run() {
    const deffered: Promise<any>[] = this.store.clients.map(
      async (client: any) => {
        let pathContents = await fs.readdir(client.path);

        client.projects = pathContents
          .filter(item => {
            const stats = fs.lstatSync(`${client.path}/${item}`);

            return stats.isDirectory();
          })
          .map(
            (item): Project => {
              const gitPath = `${client.path}/${item}/.git/config`;

              const project = {
                name: item,
                path: `${this.projectsPath}/${client.name}/${item}`,
                repository: 'NONE',
              };

              if (fs.existsSync(`${client.path}/${item}/.git/config`)) {
                const gitConfig = ini.parse(fs.readFileSync(gitPath, 'utf-8'));
                project.repository = gitConfig;
              }

              return project;
            }
          );

        return client;
      }
    );

    this.store.clients = await Promise.all(deffered);
  }
}
