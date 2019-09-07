import chalk from 'chalk';
import * as fs from 'fs-extra';

import { Store } from './../index';

interface ProfileFileObject {
  projectGroupNamesByDirectory: {
    [path: string]: string;
  };
  [property: string]: any;
}

export class GitKrackenGenerator {
  config = {
    path: `${process.env.HOME}/.gitkraken/profiles`,
  };
  options: fs.WriteOptions = {
    spaces: 2,
  };
  store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  public async run() {
    const groups = this.process(this.store);
    const profiles = await fs.readdir(this.config.path);

    const promises = profiles.map(async profile => {
      const path = `${this.config.path}/${profile}/profile`;
      const data = await fs.readJSON(path);

      data.projectGroupNamesByDirectory = groups;

      await fs.writeJson(path, data, this.options).catch(err => {
        console.error(err);
      });
    });

    await Promise.all(promises);
  }

  private process(
    rawData: Store
  ): ProfileFileObject['projectGroupNamesByDirectory'] {
    return rawData.clients.reduce(
      (accumulator, client) => {
        accumulator[`${process.env.HOME}/projects/${client.name}`] =
          client.name;
        return accumulator;
      },
      {} as ProfileFileObject['projectGroupNamesByDirectory']
    );
  }
}
