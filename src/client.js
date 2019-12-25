const authForm = document.getElementById('authForm');
const chatForm = document.getElementById('chatForm');
const clientData = document.getElementById('authData');

const connectBtn = document.getElementById('btnEnterChat');
const sendMessageBtn = document.getElementById('sendChatMessage');

const host = document.getElementById('server');
const port = document.getElementById('port');
const nick = document.getElementById('nickName');
const name = document.getElementById('userFullName');

import authUserInfo from './clientInfo.hbs'
import { ChatUser } from './chatUser';

let user = new ChatUser();

connectBtn.addEventListener('click', tryConnect);
sendMessageBtn.addEventListener('click', sendMessage);

function tryConnect() {
    if (!host.value || !port.value || !nick.value || !name.value) {
        alert('Не все поля заполнены');

        return;
    }

    user.name = name.value;
    user.nick = nick.value;

    authForm.style.display = 'none'; 
    chatForm.style.display = 'block';
    
    user.LoadLogo('src/logo.gif').then( ()=> { 
        clientData.innerHTML = authUserInfo( { user: { name: user.name, logo: user.logo } } ); 
    });
}

function sendMessage() {

}