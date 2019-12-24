class YandexStorage{
    constructor() {
        this.comments = new Map();
        this.LoadFromStorage();
    }

    AddComment( comment ) {
        if (this.comments.has( comment.address )) {

            let arr = this.comments.get( comment.address );

            arr.push(comment);

            this.comments.set(comment.address, arr);
        } else {
            this.comments.set(comment.address, [comment]);
        }

        this.SaveToStorage.call(this);
    }

    get Comments() {
        return this.comments;
    }

    set Comments(val) {
        this.comments = val;
    }

    AddressComments( address ) {
        for ( let [adr, comment] of this.comments ) {
            if ( adr == address ) {
                return comment;
            }
        }

        return [];
    }


    AllComments() {
        let result = [];

        for(let [adr, comment] of this.comments)
            result.push(...comment);

        return result;
    }

    LoadFromStorage( ) {
        if (localStorage.course1) {
            let objJson = JSON.parse(localStorage.course1);

            this.comments = objJson.length > 0 ? new Map(objJson) : new Map();
        } else {
            this.comments = new Map();
        }

    }

    SaveToStorage( ) {
        localStorage.course1 = JSON.stringify(Array.from(this.comments.entries()));
    }
}

export { YandexStorage };