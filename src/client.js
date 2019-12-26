const authForm = document.getElementById('authForm');
const chatForm = document.getElementById('chatForm');
const logoForm = document.getElementById('logoForm');
const loadImgForm = document.getElementById('loadLogoArea');
const loadedImgPreview = document.getElementById('loadedImgPreview');
const clientData = document.getElementById('authData');

const connectBtn = document.getElementById('btnEnterChat');
const sendMessageBtn = document.getElementById('sendChatMessage');
const setImgButton = document.getElementById('uploadImage');
const cancleImgButton = document.getElementById('cancleImage');

const host = document.getElementById('server');
const port = document.getElementById('port');
const nick = document.getElementById('nickName');
const name = document.getElementById('userFullName');

const chatMessageArea = document.getElementById('chatMessage');

let socket, chatProc;

import authUserInfo from './clientInfo.hbs'
import { ChatUser } from './chatUser';
import { UserMessage } from './userMessage';
import { ChatProcessor } from './chatProcessor';

let user = new ChatUser();

connectBtn.addEventListener('click', tryConnect);
sendMessageBtn.addEventListener('click', sendMessage);
setImgButton.addEventListener('click', setImage);
cancleImgButton.addEventListener('click', cancleImage);

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    loadImgForm.addEventListener(eventName, preventDefaults, false)
})
  
  function preventDefaults (e) {
    e.preventDefault()
    e.stopPropagation()
  }

loadImgForm.addEventListener('dragover', () => { loadImgForm.classList.add('dragHover'); return false; }, false);
loadImgForm.addEventListener('dragleave', () => {loadImgForm.classList.remove('dragHover'); return false; }, false);
loadImgForm.addEventListener('drop', handleDrop, false);

function setImage(){
    loadImgForm.style.display = 'none';
    let userLogo = document.getElementById('userLogoImgElm');
    userLogo.src = loadedImgPreview.src;
    user.logo = userLogo.src;
    chatProc.UserImageReloaded();
}

function cancleImage(){
    loadImgForm.style.display = 'none';
}


function handleDrop(e) {    
    loadImgForm.classList.remove('dragHover');    
    let dt = e.dataTransfer;    
    let files = dt.files;
    
    if(files.length > 1) {
        alert('Only one file!');
        return;
    }

    UploadFileForAvatar(files[0]);
}

function UploadFileForAvatar(file){
    if ( file['type'] != 'image/jpeg' && file['type'] != 'image/gif' ) {
        alert('Only GIF and JPG suported!');

        return;
    }

    if( (file['size'] / 1024) > 512) {
        alert('To large file!');

        return;
    }

    var fileReader = new FileReader();

    fileReader.readAsDataURL(file);

    fileReader.addEventListener('load',function(){
        loadedImgPreview.src = (this.result);
    });
}

function userChangeLogo(){
    let userLogo = document.getElementById('userLogoImgElm');
    loadedImgPreview.src = userLogo.src;
    loadImgForm.style.display = 'block';
    
}

function tryConnect() {
    if (!host.value || !port.value || !nick.value || !name.value) {
        alert('Не все поля заполнены');

        return;
    }

    user.name = name.value;
    user.nick = nick.value;

    authForm.style.display = 'none'; 
    chatForm.style.display = 'block';

    (async ()=> {
        socket = new WebSocket(`ws://localhost:${port.value}`);
        const opened = await connection(socket);

        user.LoadLogo('src/logo.gif').then( ()=> { 
            clientData.innerHTML = authUserInfo( { user: { name: user.name, nick: user.nick, logo: user.logo } } ); 
            
            chatProc.UserImageUpdated();
            let userLogo = document.getElementById('userLogoImg');
            userLogo.addEventListener('click', userChangeLogo);
        });
        chatProc = new ChatProcessor(socket, user);

        chatProc.UserLoggedOn();
        
    })();

}

async function connection (socket, timeout = 10000) {
    const isOpened = () => (socket.readyState === WebSocket.OPEN)
  
    if (socket.readyState !== WebSocket.CONNECTING) {
      return isOpened()
    }
    else {
      const intrasleep = 100
      const ttl = timeout / intrasleep // time to loop
      let loop = 0
      while (socket.readyState === WebSocket.CONNECTING && loop < ttl) {
        await new Promise(resolve => setTimeout(resolve, intrasleep))
        loop++
      }
      return isOpened()
    }
  }

function sendMessage() {
    chatProc.SendMessage(chatMessageArea.value);

    chatMessageArea.value = '';
}