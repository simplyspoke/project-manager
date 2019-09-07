import chalk from 'chalk';
import * as fs from 'fs-extra';

import { Store } from './../index';

interface VSCodeProject {
  name: string;
  description: string;
  icon?: string;
  path: string;
}

interface VSCodeGroup {
  name: string;
  description?: string;
  icon?: string;
  groups?: VSCodeGroup[];
  projects?: VSCodeProject[];
}

interface VSCodeProjectsFile {
  groups?: VSCodeGroup[];
  projects?: VSCodeProject[];
}

export class VSCodeGenerator {
  config = {
    path: `${process.env.HOME}/projects/.config`,
  };
  options: fs.WriteOptions = {
    spaces: 2,
  };
  store: Store;

  constructor(store: Store) {
    this.store = store;

    if (process.env.NODE_ENV === 'development') {
      this.config.path = './.projects';
    }
  }

  public async run() {
    const data = this.process(this.store);

    await fs.ensureDir(`${this.config.path}`).catch(err => {
      console.error('Could not creat directory:', err);
    });

    await fs
      .writeJson(`${this.config.path}/vscode_projects.json`, data, this.options)
      .catch(err => {
        console.error(err);
      });
  }

  private process(rawData: Store): VSCodeProjectsFile {
    return {
      groups: rawData.clients.map(
        (client): VSCodeGroup => {
          return {
            name: client.name,
            projects: client.projects.map(
              (project): VSCodeProject => {
                return {
                  name: project.name,
                  description: '',
                  path: project.path,
                };
              }
            ),
          };
        }
      ),
    };
  }
}
