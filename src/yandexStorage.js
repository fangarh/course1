class YandexStorage{
    constructor() {
        this.comments = new Map();
    }

    AddComment( comment ) {
        if (this.comments.has( comment.address )) {

            let arr = this.comments.get( comment.address );

            arr.push(comment);

            this.comments.set(comment.address, arr);
        } else {
            this.comments.set(comment.address, [comment]);
        }

        /*this.SaveToStorage.call(this);*/
    }

    get Comments() {
        return this.comments;
    }

    set Comments(val) {
        this.comments = val;
    }

    AddressComments( address ) {
        let result = [];

        for ( let [adr, comment] of this.comments ) {
            if ( adr == address ){
                result.push(comment);
            }
        }
console.log(result);
        return result;
    }
}

export { YandexStorage };