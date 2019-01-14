export class ProjectAggregator {
    store: {
        [key: string]: any;
    };

    constructor(store: object) {
        this.store = store;
    }
}
