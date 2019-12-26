'use strict';

class ChatUser {
    constructor(nick, name, logo) {
        this.nick = nick;
        this.name = name;
        this.logo = logo;
    }

    LoadLogo(url) {
        return new Promise((resolve) => {
            let xhr = new XMLHttpRequest();
    
            xhr.open ('GET', url);
        
            xhr.responseType = 'arraybuffer';
            xhr.send();

            xhr.addEventListener('load', () => {
                var bytes = new Uint8Array(xhr.response);
                var str = String.fromCharCode.apply(null, bytes);
                var base64 = btoa(str);
    
                this.logo = 'data:image/gif;base64,' + base64;

                resolve();
            }) 
        });
    }

    LoadDropLogo(file) {
        return new Promise((resolve) => {});
    }
}

export { ChatUser }