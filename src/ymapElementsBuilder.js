import { UserComment } from './userComment';
let cnt = 0;
class yandexElementBuilder {
    constructor(objectManager, geoCoord, address, placeHistory, commentAddedCallback, storageContext) {
        this.geoCoord = geoCoord;
        this.saved = false;
        this.address = address;
        this.history = placeHistory;

        this.storageContext = storageContext;

        this.objectManager = objectManager;
        this.balloonLayout = '';
        this.contentLayout = '';
        this.placemark = null;
        this.isNew = true;
        this.commentAdded = commentAddedCallback;
    }

    BuildPlaceMark( old ) {
        if (old) {
            this.isNew = false;
            this.saved = true;
        }

        this.ReCreateLayout();

        this.placemark = new ymaps.Placemark ( this.geoCoord, {
            balloonHeader: this.address,
            balloonContentHeader: this.address,
            balloonContentBody : this.BuildBalloonHtml(false).outerHTML
        }, {
            balloonShadow: false,

            balloonLayout: this.balloonLayout,
            balloonContentLayout: this.contentLayout
        } );

        this.objectManager.add(this.placemark);

        if (old !== true ) {
            this.placemark.balloon.open(this.geoCoord);
        }

        this.placemark.balloon.events.add('close', ()=> {
            this.CloseCallback.call(this);
        });
    }

    CloseCallback() {
        if (this.saved) {
            this.objectManager.remove(this.placemark);

            this.ReCreateLayout();

            this.placemark = new ymaps.Placemark ( this.geoCoord, {
                balloonHeader: this.address,
                balloonContentHeader: this.address,
                balloonContentBody : this.BuildBalloonHtml(false).outerHTML
            }, {
                balloonShadow: false,
                balloonLayout: this.balloonLayout,
                balloonContentLayout: this.contentLayout,
                clusterCaption: this.address
            });

            // eslint-disable-next-line consistent-this
            this.placemark.balloon.events.add('close', ()=>{
                this.CloseCallback.call(this);
            });

            this.objectManager.add(this.placemark);
            this.isNew = false;
            this.saved = false;

        } else {
            if (this.isNew){
                this.objectManager.remove(this.placemark);
            }
        }
    }

    BuildBalloonHtml(input = true) {
        let body = document.createElement('DIV');
        let list = document.createElement('DIV');

        list.style.minHeight = '100px';
        list.style.maxHeight = '160px';
        list.style.overflowY = 'auto';

        for (let comment of this.history) {
            let record = document.createElement('DIV');

            record.innerHTML = '<b>' + comment.name + '</b> ' + comment.place + ' ' + comment.date + '<br/>';

            record.appendChild(document.createTextNode(comment.comment));
            list.appendChild(record);
        }

        body.appendChild(list);

        let editForm = document.createElement('DIV');

        editForm.innerHTML = '<h5 style="color: #c23440">Ваш отзыв:</h5>';

        let nameInput = document.createElement('INPUT');

        nameInput.id = 'nameInput';
        nameInput.placeholder = 'Ваше имя';
        nameInput.type = 'text';
        editForm.appendChild(nameInput);

        let placeInput = document.createElement('INPUT');

        placeInput.id = 'placeInput';
        placeInput.placeholder = 'Укажите место';
        placeInput.type = 'text';
        editForm.appendChild(placeInput);

        let commentInput = document.createElement('TEXTAREA');

        commentInput.id = 'commentInput';
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

        editForm.appendChild(submitButton);
        if(input)
            body.appendChild(editForm);
        body.style.paddingBottom = '15px';

        return body;
    }

    /*
       https://tech.yandex.ru/maps/jsbox/2.1/balloon_autopan
     */

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

                    if (!this._isElement(this._$element)) {
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

        let body = this.BuildBalloonHtml();

        var myFunc = this.closeBalloonFunc;
        var oldThis = this;

        let BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<label class="popover-title" style="background: #DA715B">$[properties.balloonHeader]</label>' +
            '<div class="popover-content">' + body.outerHTML + '</div>', {
                // Переопределяем функцию build, чтобы при создании макета начинать
                // слушать событие click на кнопке-счетчике.
                build: function () {
                    // Сначала вызываем метод build родительского класса.
                    BalloonContentLayout.superclass.build.call(this);
                    // А затем выполняем дополнительные действия.
                    $('#btnSubmit').unbind('click');
                    $('#btnSubmit').one('click', ()=>{
                        this.onSubmitClick(myFunc);
                    });
                },
                clear: function () {
                    // Выполняем действия в обратном порядке - сначала снимаем слушателя,
                    // а потом вызываем метод clear родительского класса.
                    $('#btnSubmit').unbind('click', ()=>{
                        this.onSubmitClick(myFunc);
                    });
                    BalloonContentLayout.superclass.clear.call(this);
                },
                onSubmitClick: function (closeAction) {
                    let newComment = new UserComment();

                    newComment.name = $('#nameInput').val();
                    newComment.place = $('#placeInput').val();

                    newComment.comment = $('#commentInput').val();
                    newComment.address = this.address;

                    closeAction.call(oldThis, newComment);
                }
            }
        );

        this.balloonLayout = MyBalloonLayout;
        this.contentLayout = BalloonContentLayout;
    }

    closeBalloonFunc(addedComment){
        this.saved= true;
        addedComment.coords = this.geoCoord;
        addedComment.address = this.address;
        this.commentAdded.call(this.storageContext, addedComment);
        this.placemark.balloon.close();
        this.history.push(addedComment);
    }

    get Saved() {
        return this.saved;
    }

    set Saved(arg){
        this.saved = arg;
    }
}

export {
    yandexElementBuilder
}