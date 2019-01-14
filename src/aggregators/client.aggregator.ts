import chalk from 'chalk';
import * as fs from 'fs-extra';

export class ClientAggregator {
    options = {};
    store: {
        [key: string]: any;
    };

    constructor(store: object) {
        this.store = store;
    }

    public async run() {
        let list = await fs.readdir('../../');

        list = list.filter(item => {
            const stats = fs.lstatSync(`../../${item}`);

            console.log('item', stats.isDirectory());

            return stats.isDirectory();
        });

        this.store.clients = list;

        console.log(list);
    }
}
