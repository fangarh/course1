import userComment from './userComment.hbs';
import { EditForm } from './editForm';
import { YandexStorage } from './yandexStorage';
document.addEventListener('DOMContentLoaded', onPageLoad);

function onPageLoad() {
    ymaps.ready(init);
}

function init() {
    let map = new ymaps.Map('ymap', {
        center: [ 59.94, 30.24 ],
        zoom: 12,
        controls: ['zoomControl'],
        behaviors: ['drag', 'scrollZoom']
    }, {
        searchControlProvider: 'yandex#search'
    });

    let customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        '<div class=ballon_header>{{ properties.balloonContentHeader|raw }}</div>' +
        '<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>' +
        '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
    );

    let clusterer = new ymaps.Clusterer({
        preset: 'islands#invertedDarkOrangeClusterIcons',
        openBalloonOnClick: true,
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterHideIconOnBalloonOpen: false,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonItemContentLayout: customItemContentLayout,
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonContentLayoutWidth: 200,
        clusterBalloonContentLayoutHeight: 130,
        clusterBalloonPagerSize: 5
    });

    map.geoObjects.add(clusterer);
    let storage = new YandexStorage();
    let form = new EditForm(map, clusterer, storage);

    map.events.add('click', e => {
        let coords = e.get('coords');
        let position = e.get('position');

        form.ClearFormData();

        ymaps.geocode(coords).then(res => {
            form.ShowForm(position, coords, res.geoObjects.get(0).getAddressLine());
        }).catch(err => console.log(err));
    });

    map.events.add('balloonopen', () => {
        form.CloseForm();
    });
}