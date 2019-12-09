/* eslint-disable indent */
/* eslint-disable space-before-blocks */
/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответсвует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

filterNameInput.addEventListener('keyup', function () {
  let search = filterNameInput.value;
  
  fillTable(search);
});
document.addEventListener('DOMContentLoaded', ()=>{fillTable("")});

function clearAllCookie(){
  let cookiesSet = getAllCookie();

  for (let cookie in cookiesSet)
     deleteCookie(cookie);
}

function fillTable(filter){
  let cookiesSet = getAllCookie();
  listTable.innerHTML = '';

  for (let cookie in cookiesSet){
    if(isMatching(cookiesSet[cookie], filter) || isMatching(cookie, filter)){
      let row = document.createElement('TR');
      let cName = document.createElement('TD');
      let cValue = document.createElement('TD');
      let cDel = document.createElement('TD');
      let delButton = document.createElement('BUTTON');

      cName.innerText = cookie;
      cValue.innerText = cookiesSet[cookie];
      delButton.innerText = 'Удалить';
      cDel.appendChild(delButton);

      delButton.onclick = ()=>{
          deleteCookie(cookie);
          listTable.removeChild(row);

      };

      row.appendChild(cName);
      row.appendChild(cValue);
      row.appendChild(cDel);
      
      listTable.appendChild(row);
    }
  }
}

addButton.addEventListener('click', () => {
  // здесь можно обработать нажатие на кнопку "добавить cookie"

  document.cookie = `${addNameInput.value}=${addValueInput.value}`;

  let search = filterNameInput.value;

  fillTable(search);
});

function isMatching(full, chunk) {
  return full.toLowerCase().indexOf(chunk.toLowerCase()) !== -1;
}

function getAllCookie() {
  var pairs = document.cookie.split(';').reduce((prev, current) => {
    const [name, value] = current.split('=');
    prev[name] = value;
    return prev;
  }, {});
  return pairs;
}

function deleteCookie(name){
  document.cookie = `${name}=""; max-age=-1`;
}