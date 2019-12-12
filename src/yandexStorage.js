import { UserComment } from './userComment';
import { yandexElementBuilder } from './ymapElementsBuilder'

class YandexStorage {
    constructor(map, objectManager){
        this.map = map;
        this.objectManager = objectManager;
        this.storage = new Map();
    }

    AddObject( coords, address ) {
        var history = [];
        let c = new UserComment();
        c.comment = 'qwe';
        c.name = 'dds';
        c.place = 'Choko';

        history.push(c);
        history.push(c);

        let yeb = new yandexElementBuilder(this.map, this.objectManager, coords, address, history);

        yeb.BuildPlaceMark();
    }
}

export { YandexStorage };