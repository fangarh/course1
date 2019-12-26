import { ChatUser } from './chatUser'

class UserMessage {
    constructor( user ) {
        this.user = user;
        this.systemData = [];
        this.textData = '';
        this.type = 'text';
    }

    ToJson() {
        return JSON.stringify(this);
    }

    IsCommand() {
        return this.type === 'command';
    }

    IsText() {
        return this.type === 'text';
    }

    static FromJson(data) {
        var parsed = JSON.parse(data);

        let elm = new UserMessage(parsed.user);

        elm.systemData = parsed.systemData;
        elm.textData = parsed.textData;
        elm.type = parsed.type;

        return elm;
    }
} 

export { UserMessage }