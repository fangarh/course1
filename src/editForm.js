import { YandexStorage } from './yandexStorage';
import { UserComment } from './userComment';
import userComm from './userComment.hbs';

class EditForm {
    constructor(map, cluster, storage) {
        this.map = map;
        this.cluster = cluster;
        this.storage = storage;
        this.reviewStorage = new YandexStorage();
        this.address = '';
        this.coords = [];
        this.balloonForm = document.getElementById('balloonForm');
        this.addressHead = document.getElementById('addressList');
        this.place = document.getElementById('place');
        this.reviewContent = document.getElementById('review_content');
        this.content = document.getElementById('content');
        this.oldComment = document.getElementById('oldCommentList');
        this.username = document.getElementById('username');
        this.commitBtn = document.getElementById('commitBtn');
        this.emptyLabel = document.getElementById('emptyLabel');
        this.head = document.getElementById('balloonForm_head');
        this.closeBtn = document.getElementById('closeBtn');

        this.closeBtn.addEventListener('click', () => { this.CloseForm.call(this); });

        this.head.addEventListener('mousedown', (event) => {
            let moveTo = (event) => {
                this.balloonForm.style.left = event.pageX - shiftX + 'px';
                this.balloonForm.style.top = event.pageY - shiftY + 'px';
            }
            let coordinates = this.balloonForm.getBoundingClientRect();
            let shiftX = event.pageX - coordinates.left;
            let shiftY = event.pageY - coordinates.top;

            this.balloonForm.style.zIndex = 1000;
            document.addEventListener('mousemove', moveTo);

            this.head.addEventListener('mouseup', function mouseUp() {
                document.removeEventListener('mousemove', moveTo);
            });
        });
        this.commitBtn.addEventListener('click', () => { this.AddComment.call(this); });

        let ymap = document.getElementById('ymap');

        ymap.addEventListener('click', e => {
            let target = e.target;

            if (target.className != 'address') {
                return;
            }
            this.map.balloon.close();
            const x = e.clientX;
            const y = e.clientY;

            this.ShowAllPlaceData(target.textContent, [x, y]);
        });
    }

    RestoreFromStorage() {
        for (let newComment of this.storage.AllComments()) {
            let header = '<div>' + newComment.place + '</div><div class="address">' + newComment.address + '</div>';

            let placemark = new ymaps.Placemark(newComment.coords, {
                balloonContentHeader: header,
                balloonContentBody: newComment.comment,
                balloonContentFooter: newComment.date,
                hintContent: '<b>' + newComment.name + '</b> ' + newComment.place
            }, {
                preset: 'islands#redIcon',
                iconColor: '#df6543',
                openBalloonOnClick: false
            });

            placemark.events.add('click', (e) => {
                this.ShowAllPlaceData(newComment.address, e.get('position'));
            });

            this.cluster.add(placemark);
        }
    }

    AddComment() {
        let newComment = new UserComment();

        newComment.Name = this.username.value;
        newComment.Place = this.place.value;
        newComment.Address = this.address;
        newComment.Comment = this.reviewContent.value;
        newComment.coords = this.coords;

        this.ClearFormData();

        this.storage.AddComment(newComment);

        this.emptyLabel.style.display = 'none';
        this.oldComment.innerHTML += userComm( { userDataComment: newComment } );

        let header = '<div>' + newComment.place + '</div><div class="address">' + this.address + '</div>';

        let placemark = new ymaps.Placemark(newComment.coords, {
            balloonContentHeader: header,
            balloonContentBody: newComment.comment,
            balloonContentFooter: newComment.date,
            hintContent: '<b>' + newComment.name + '</b> ' + newComment.place
        }, {
            preset: 'islands#redIcon',
            iconColor: '#df6543',
            openBalloonOnClick: false
        });

        let addr = this.address;

        placemark.events.add('click', (e) => {
            this.coords = newComment.coords;
            this.ShowAllPlaceData(addr, e.get('position'));
        });

        this.cluster.add(placemark);
        this.CloseForm();
    }

    ShowForm( pos, coords, address ) {
        this.map.balloon.close();
        this.balloonForm.style.zIndex = 0;
        this.balloonForm.style.display = 'block';

        this.coords = coords;

        let x = pos[0];
        let y = pos[1];

        if (x + this.balloonForm.offsetWidth > document.documentElement.clientWidth) {
            x = document.documentElement.clientWidth - this.balloonForm.offsetWidth - 10;
        }
        if (x < 0) {
            x = 0;
        }
        if (y + this.balloonForm.offsetHeight > document.documentElement.clientHeight) {
            y = document.documentElement.clientHeight - this.balloonForm.offsetHeight - 10;
        }
        if (y < 0) {
            y = 0;
        }

        this.balloonForm.style.left = x +'px';
        this.balloonForm.style.top = y + 'px';
        this.address = address;
        this.addressHead.textContent = address;
        this.balloonForm.style.zIndex = '10';
    }

    CloseForm() {
        this.ClearFormData();
        this.ClearPlaceData();
        this.balloonForm.style.display = 'none';
    }

    ClearPlaceData() {
        this.oldComment.innerHTML = '<span id="emptyLabel" style="display: block">Отзывов пока нет...</span>';
        this.emptyLabel = document.getElementById('emptyLabel');
    }

    ShowAllPlaceData(address, position) {
        this.ClearFormData();
        this.ClearPlaceData();
        this.address = address;
        this.addressHead.textContent = address;

        for (let current of this.storage.AddressComments(address)) {
            this.emptyLabel.style.display = 'none';

            this.coords = current.coords;

            this.oldComment.innerHTML += userComm( { userDataComment: current } );

        }

        if (this.oldComment.children.length > 1) {
            this.emptyLabel.style.display = 'none';
            this.ShowForm(position, this.coords, this.address);
        }
    }

    ClearFormData() {
        this.username.value = '';
        this.place.value = '';
        this.reviewContent.value = '';
    }
}

export { EditForm };