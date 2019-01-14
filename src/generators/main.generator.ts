import chalk from 'chalk';
import * as fs from 'fs-extra';

export class MainGenerator {
    options: fs.WriteOptions = {
        spaces: 2,
    };
    store: {
        [key: string]: any;
    };

    constructor(store: object) {
        this.store = store;
    }

    public async run() {
        const data = this.store;

        await fs.ensureDir('./.projects').catch(err => {
            console.error('Could not creat directory:', err);
        });

        await fs
            .writeJson('./.projects/projects.json', data, this.options)
            .catch(err => {
                console.error(err);
            });
    }
}
