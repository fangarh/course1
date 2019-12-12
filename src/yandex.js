import { UserComment } from './userComment';
import { YandexStorage } from './yandexStorage';

const homeworkContainer = document.querySelector('#yandex-container');

const mainDiv = homeworkContainer.querySelector('#mainDiv');
const map = homeworkContainer.querySelector('#map');
let objectManager, cluster, storage;

document.addEventListener('DOMContentLoaded', onPageLoad);

function onPageLoad() {
    ymaps.ready(init);
}

function init() {
    let map = new ymaps.Map('map', {
        center: [ 59.94, 30.24 ],
        zoom: 12,
        controls: ['zoomControl'],
        behaviors: ['drag', 'scrollZoom']
    }, {
        searchControlProvider: 'yandex#search'
    });

    cluster = new ymaps.Clusterer({clusterDisableClickZoom: true});

    map.geoObjects.add(cluster);

    storage = new YandexStorage(cluster);

    map.events.add('click', (e)=>{
        getAddress(e.get('coords'), m=>storage.AddObject( e.get('coords'), m ));
    });
}

function getAddress(coords, resolve) {
    ymaps.geocode(coords).then(function (res) {
        let firstGeoObject = res.geoObjects.get(0);
        let addres = firstGeoObject.getAddressLine();
        
        resolve(addres);
    });
}