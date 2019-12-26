import { ChatUser } from './chatUser';
import { UserMessage } from './userMessage';
import { FormActions } from './formActions';

class ChatProcessor {
    constructor ( socket, user ) {
        this.socket = socket;
        this.user = user;
        socket.onmessage = (event) => { 
            this.ReciveMessage.call(this, event); 
        };
    }

    UserLoggedOn() {
        let um = new UserMessage( this.user );

        um.type = 'command';
        um.textData = 'UserLoggedOn';

        this.socket.send(um.ToJson());
    }

    UserImageUpdated() {
        let um = new UserMessage( this.user );

        um.type = 'command';
        um.textData = 'UserImageUpdated';

        this.socket.send(um.ToJson());
    }

    UserImageReloaded() {
        let um = new UserMessage( this.user );

        um.type = 'command';
        um.textData = 'UserImageReloaded';

        this.socket.send(um.ToJson());
    }

    SendMessage( text ) {
        let um = new UserMessage( this.user );

        um.textData = text;

        this.socket.send(um.ToJson());
    }

    ReciveMessage(message) {
        let msg = UserMessage.FromJson(message.data);

        if (msg.IsCommand()) {
            this.ParseCommand(msg);
        } else 
        if (msg.IsText()) {
            FormActions.AddMessage(msg);
        }
    }

    ParseCommand( command ) {
        if (command.textData == 'updateUser') {
            FormActions.UpdateUsersList( command.systemData);
        }

        if (command.textData == 'updateUserImage') {
            FormActions.UpdateAvatars( command.user );
        }
    }
}

export { ChatProcessor }