import userInfo from './clientInfo.hbs';
import chatMessage from './message.hbs';

class FormActions {
    static UpdateUsersList (users) {
        let usersAre = document.getElementById('usersList');

        usersAre.innerHTML = '';

        users.forEach(element => {
            if (element.logo) {
                usersAre.innerHTML += `<li class='lbi' ><div style='padding-top: 5px;'><img src="${element.logo}" name="${element.nick}" style="width: 32px; height: 32px;"/>
                    &nbsp;&nbsp;&nbsp;<label id="userName">${element.name} [${element.nick}]</label></div></li>`;
            }
        });
    }

    static AddMessage (msg) {
        let msgAre = document.getElementById('chatInnerMessages');
        let body = chatMessage( { message: { nick: msg.user.nick, logo: msg.user.logo, name: msg.user.name, date: FormActions.CurDate(), textData: msg.textData } } );

        msgAre.innerHTML+=(body);
    }

    static CurDate() {
        var date = new Date().toJSON().slice(0, 10);
        var time = new Date().toJSON().slice(11, 19);

        return date + ' ' +time;
    }

    static UpdateAvatars( newUser ) {
        let usersAre = document.getElementById('usersList');
        let elm = usersAre.querySelector(`[name = ${newUser.nick}]`);
        
        elm.src = newUser.logo;

        let chatArea = document.getElementById('chatInnerMessages');

        chatArea.querySelectorAll(`[name = ${newUser.nick}]`).forEach((img)=> { img.src = newUser.logo; });
    }
}

export { FormActions }