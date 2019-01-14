import chalk from 'chalk';
import * as fs from 'fs-extra';

export interface Project {
  name: string;
  path: string;
  repository: string;
}

export class ProjectAggregator {
  projectsPath: string;
  store: {
    [key: string]: any;
  };

  constructor(projectsPath: string, store: object) {
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
              return {
                name: item,
                path: `${this.projectsPath}/${item}`,
                repository: '',
              };
            }
          );

        return client;
      }
    );

    this.store.clients = await Promise.all(deffered);
  }
}
