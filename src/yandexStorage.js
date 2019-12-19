import { UserComment } from './userComment';
import { yandexElementBuilder } from './ymapElementsBuilder'

let storage = new Map();

class YandexStorage {
    constructor(objectManager) {
        this.objectManager = objectManager;

        loadFromStorage();

        for (let [key, place] of storage) {
            let history = place;
            let address = key;
            let coords = place[0].coords;

            let yeb = new yandexElementBuilder(this.objectManager, coords, address, history, this.AppendComment);

            yeb.BuildPlaceMark(true);
        }
    }

    AddObject( coords, address ) {
        let yeb = new yandexElementBuilder(this.objectManager, coords, address, [], this.AppendComment);

        yeb.BuildPlaceMark();
    }

    AppendComment(elm) {
        if (storage.has(elm.address)) {
            let arr = storage.get(elm.address);
            arr.push(elm);
            storage.set(elm.address, arr);
        } else {
            storage.set(elm.address, [elm]);
        }

        saveToStorage();
    }
}

function loadFromStorage( ) {
    if (localStorage.course1){
        let objJson = JSON.parse(localStorage.course1);

        storage = objJson.length > 0 ? new Map(objJson) : new Map();
    } else {
        storage = new Map();
    }

}

function saveToStorage( ) {
    localStorage.course1 = JSON.stringify(Array.from(storage.entries()));
}

export { YandexStorage };