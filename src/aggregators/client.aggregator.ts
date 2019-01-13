import chalk from 'chalk';
import * as fs from 'fs-extra';

export class ClientAggregator {
    options = {};

    public async run() {
        let list = await fs.readdir('../../');

        list = list.filter(item => {
            const stats = fs.lstatSync(`../../${item}`);

            console.log('item', stats.isDirectory());

            return stats.isDirectory();
        });

        console.log(list);
    }
}
