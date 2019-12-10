const homeworkContainer = document.querySelector('#yandex-container');

const mainDiv = homeworkContainer.querySelector('#mainDiv');
const map = homeworkContainer.querySelector('#map');

document.addEventListener('DOMContentLoaded', onPageLoad);

function onPageLoad(){
    ymaps.ready(init);
}

function init() {
    let map = new ymaps.Map('map', {
        center:[ 59.94, 30.24 ],
        zoom: 12,
        controls: ['zoomControl'],
        behaviors: ['drag']
    });

    let place = new ymaps.Placemark ( [ 59.94, 30.25 ], {
        hintContent: 'Hint',
        balloonContent: '!!!',
        balloonContentHeader: '!!!!!!!',
        balloonContentBody: '<div>sad</div>',
    } );
    let place1 = new ymaps.Placemark ( [ 59.94, 30.22 ], {
        hintContent: '232',
        balloonContent: '111',
        balloonContentHeader: '222',
        balloonContentBody: '<div>333</div>',
    } );

    let cluster = new ymaps.Clusterer({clusterDisableClickZoom: true});
    cluster.add(place1).add(place);
    map.geoObjects.add(cluster);
}