import { UserComment } from './userComment';
import { yandexElementBuilder } from './ymapElementsBuilder'

class YandexStorage {
    constructor(objectManager) {
        this.objectManager = objectManager;
        this.storage = new Map();

        this.LoadFromStorage();

        for (let [key, place] of this.storage) {
            let history = place;
            let address = key;
            let coords = place[0].coords;

            let yeb = new yandexElementBuilder(this.objectManager, coords, address, history, this.AppendComment, this);

            yeb.BuildPlaceMark(true);
        }
    }

    AddObject( coords, address ) {
        let yeb = new yandexElementBuilder(this.objectManager, coords, address, [], this.AppendComment, this);

        yeb.BuildPlaceMark();
    }

    AppendComment(elm) {
        if (this.storage.has(elm.address)) {
            let arr = this.storage.get(elm.address);
            arr.push(elm);
            this.storage.set(elm.address, arr);
        } else {
            this.storage.set(elm.address, [elm]);
        }

        this.SaveToStorage.call(this);
    }

    LoadFromStorage( ) {
        if (localStorage.course1) {
            let objJson = JSON.parse(localStorage.course1);

            this.storage = objJson.length > 0 ? new Map(objJson) : new Map();
        } else {
            this.storage = new Map();
        }

    }

    SaveToStorage( ) {
        localStorage.course1 = JSON.stringify(Array.from(this.storage.entries()));
    }
}

export { YandexStorage };