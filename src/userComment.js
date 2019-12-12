class UserComment {
    constructor(name, place, comment, address) {
        this.name = name ? name : '';
        this.date = this.CurDate();
        this.place = place ? place : '';
        this.comment = comment ? comment : '';
        this.address = address ? address : '';
    }

    CurDate() {
        var date = new Date().toJSON().slice(0, 10);
        var time = new Date().toJSON().slice(11, 19);

        return date + ' ' +time;
    }

    get Name() {
        return this.name;
    }

    get Place() {
        return this.place;
    }

    get Comment() {
        return this.comment;
    }
    
    get Address() {
        return this.address;
    }

    set Name(val) {
        this.name = val;
    }

    set Place(val) {
        this.place = val;
    }

    set Comment(comment) {
        this.comment = comment;
    }

    set Addres(val) {
        this.comment = val;
    }
    
    get HtmlShowString() {
        return '<b>' + this.name + '</b>: ' + this.place + '<br>' + this.comment;
    }
}

export { UserComment };