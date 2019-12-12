import { UserComment } from './userComment';

class yandexElementBuilder {
    constructor(currentMap, objectManager, geoCoord, address, placeHistory) {
        this.geoCoord = geoCoord;
        this.saved = false;
        this.address = address;
        this.history = placeHistory;
        this.map = currentMap;
        this.objectManager = objectManager;
        this.balloonLayout = '';
        this.contentLayout = '';
        this.placemark = null;
    }

    ClosedWithoutSave(balloon) {
        return new Promise((resolve)=>{
            balloon.close = () => {
                resolve(this.saved);
            }
        });
    }

    BuildPlaceMark() {
        this.ReCreateLayout();

        this.placemark = new ymaps.Placemark ( this.geoCoord, {
            balloonHeader: this.address,
        }, {
            balloonShadow: false,
            balloonLayout: this.balloonLayout,
            balloonContentLayout: this.contentLayout
        } );

        this.objectManager.add(this.placemark);
        this.placemark.balloon.open(this.geoCoord);

        this.placemark.balloon.events.add('close', ()=>{
            console.log(this.saved);
        });
    }

    /*
       https://tech.yandex.ru/maps/jsbox/2.1/balloon_autopan
     */
    closeBalloonFunc(addedComment){
        this.saved = true;
        this.placemark.balloon.close();
    }

    ReCreateLayout() {
        let MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="popover top" >' +
            '<a class="close" href="#">&times;</a>' +
            '<div class="arrow" ></div>' +
            '<div class="popover-inner" style="background: #FAECEA" >' +
            '$[[options.contentLayout observeSize minWidth=276 maxWidth=256 maxHeight=1000]]' +
            '</div>' +
            '</div>', {
                /**
                 * Строит экземпляр макета на основе шаблона и добавляет его в родительский HTML-элемент.
                 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#build
                 * @function
                 * @name build
                 */
                build: function () {
                    this.constructor.superclass.build.call(this);

                    this._$element = $('.popover', this.getParentElement());

                    this.applyElementOffset();

                    this._$element.find('.close')
                        .on('click', $.proxy(this.onCloseClick, this));
                },

                /**
                 * Удаляет содержимое макета из DOM.
                 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#clear
                 * @function
                 * @name clear
                 */
                clear: function () {
                    this._$element.find('.close')
                        .off('click');

                    this.constructor.superclass.clear.call(this);
                },

                /**
                 * Метод будет вызван системой шаблонов АПИ при изменении размеров вложенного макета.
                 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
                 * @function
                 * @name onSublayoutSizeChange
                 */
                onSublayoutSizeChange: function () {
                    MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);

                    if(!this._isElement(this._$element)) {
                        return;
                    }

                    this.applyElementOffset();

                    this.events.fire('shapechange');
                },

                /**
                 * Сдвигаем балун, чтобы "хвостик" указывал на точку привязки.
                 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
                 * @function
                 * @name applyElementOffset
                 */
                applyElementOffset: function () {
                    this._$element.css({
                        left: -(this._$element[0].offsetWidth / 2),
                        top: -(this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight)
                    });
                },

                /**
                 * Закрывает балун при клике на крестик, кидая событие "userclose" на макете.
                 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
                 * @function
                 * @name onCloseClick
                 */
                onCloseClick: function (e) {
                    e.preventDefault();

                    this.events.fire('userclose');
                },

                /**
                 * Используется для автопозиционирования (balloonAutoPan).
                 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ILayout.xml#getClientBounds
                 * @function
                 * @name getClientBounds
                 * @returns {Number[][]} Координаты левого верхнего и правого нижнего углов шаблона относительно точки привязки.
                 */
                getShape: function () {
                    if(!this._isElement(this._$element)) {
                        return MyBalloonLayout.superclass.getShape.call(this);
                    }

                    var position = this._$element.position();

                    return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
                        [position.left, position.top], [
                            position.left + this._$element[0].offsetWidth,
                            position.top + this._$element[0].offsetHeight
                                + this._$element.find('.arrow')[0].offsetHeight
                        ]
                    ]));
                },

                /**
                 * Проверяем наличие элемента (в ИЕ и Опере его еще может не быть).
                 * @function
                 * @private
                 * @name _isElement
                 * @param {jQuery} [element] Элемент.
                 * @returns {Boolean} Флаг наличия.
                 */
                _isElement: function (element) {
                    return element && element[0] && element.find('.arrow')[0];
                }
            });



        let body = document.createElement('DIV');
        let list = document.createElement('DIV');

        list.style.minHeight = '100px';
        list.style.maxHeight = '180px';
        list.style.overflowY = 'auto';
        for (let comment of this.history) {
            let record = document.createElement('DIV');

            record.innerHTML = '<b>' + comment.name + '</b> ' + comment.place + ' ' + comment.date + '<br/>';

            record.appendChild(document.createTextNode(comment.comment));
            list.appendChild(record);
        }

        body.appendChild(list);

        let editForm = document.createElement('DIV');

        editForm.innerHTML = '<h5 style="color: #C21F39">Ваш отзыв:</h5>';

        let nameInput = document.createElement('INPUT');

        nameInput.placeholder = 'Ваше имя';
        nameInput.type = 'text';
        editForm.appendChild(nameInput);

        let placeInput = document.createElement('INPUT');

        placeInput.placeholder = 'Укажите место';
        placeInput.type = 'text';
        editForm.appendChild(placeInput);

        let commentInput = document.createElement('TEXTAREA');

        commentInput.placeholder = 'Поделитесь впечатлениями';
        editForm.appendChild(commentInput);

        let submitButton = document.createElement('BUTTON');

        submitButton.classList.add('btn');
        submitButton.id = 'btnSubmit';
        submitButton.classList.add('btn-secondary');
        submitButton.style.float = 'right';
        submitButton.style.marginRight = '25px';
        submitButton.style.marginBottom = '5px';
        submitButton.innerText = 'Добавить';
/*
        this.MapChangeAccepted(submitButton).then(()=>{
            let newComment = new UserComment();

            newComment.place = placeInput.value;
            newComment.name = nameInput.value;
            newComment.comment = commentInput.value;
            newComment.address = this.address;

            this.saved = true;

            this.placemark.balloon.close();
        });*/

        submitButton.onclick = () => {
            let newComment = new UserComment();

            console.log('222');

            newComment.place = placeInput.value;
            newComment.name = nameInput.value;
            newComment.comment = commentInput.value;
            newComment.address = this.address;

            console.log('222');

            this.saved = true;

            this.placemark.balloon.close();
        };

        editForm.appendChild(submitButton);

        body.appendChild(editForm);
        body.style.paddingBottom = '15px';

        console.log(this.placemark, 2);

        this.balloonLayout = MyBalloonLayout;
        let BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<label class="popover-title" style="background: #DA715B">$[properties.balloonHeader]</label>' +
            '<div class="popover-content">' + body.outerHTML + '</div>', {
                // Переопределяем функцию build, чтобы при создании макета начинать
                // слушать событие click на кнопке-счетчике.
                build: function () {
                    // Сначала вызываем метод build родительского класса.
                    BalloonContentLayout.superclass.build.call(this);
                    // А затем выполняем дополнительные действия.
                    $('#btnSubmit').bind('click', ()=>{
                        console.log(this.closeBalloonFunc);
                        this.onSubmitClick(this.closeBalloonFunc);
                    });
                },

                // Аналогично переопределяем функцию clear, чтобы снять
                // прослушивание клика при удалении макета с карты.
                clear: function () {
                    // Выполняем действия в обратном порядке - сначала снимаем слушателя,
                    // а потом вызываем метод clear родительского класса.
                    $('#btnSubmit').unbind('click', this.onSubmitClick);
                    BalloonContentLayout.superclass.clear.call(this);
                },

                onSubmitClick: function (closeAction) {
                    console.log(closeAction);
                    let newComment = new UserComment();

                    newComment.place = placeInput.value;
                    newComment.name = nameInput.value;
                    newComment.comment = commentInput.value;
                    newComment.address = this.address;

                    closeAction(newComment);
                }
            }
        );

        this.contentLayout = BalloonContentLayout;
    }

    MapChangeAccepted( button ) {
        return new Promise((resolve) => {
            button.onclick = () => {
                console.log("alert");
                resolve();
            };
        });
    }
}

export {
    yandexElementBuilder
}