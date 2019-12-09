/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загрузки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */

 const url = "https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json";

function loadTowns() {
  return new Promise((resolve, rej) => {
    fetch(url).then( response => response.json())
        .then(fetchRes => resolve((fetchRes).sort((e1, e2)=>stringSort(e1.name, e2.name))))
        .catch(e=>rej(e));
    });
}


function stringSort(a, b){
  if (a > b) {
      return 1;
  }
  
  if (a < b) {
      return -1;
  }

  return 0;
}


/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
  return full.toLowerCase().indexOf(chunk.toLowerCase()) !== -1;
}

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');

const errorBlock = homeworkContainer.querySelector('#error-block');
const errorButton = homeworkContainer.querySelector('#reloadOnError');

let townsList = [];

document.addEventListener('DOMContentLoaded', ()=>{

  errorButton.onclick = () => {
    loadingBlock.style.display = "block";
    filterBlock.style.display = "none";
    errorBlock.style.display = "none";
    initData();
  }

  initData();
});

function initData(){
    loadTowns().then(townsLoaded, loadError);
}

function loadError(){
  loadingBlock.style.display = "none";
  filterBlock.style.display = "none";
  errorBlock.style.display = "block";
}

function townsLoaded(towns){
    townsList = towns;
    filterBlock.style.display = "block";
    loadingBlock.style.display = "none";
}

filterInput.addEventListener('keyup', function(e) {
    // это обработчик нажатия кливиш в текстовом поле    
    filterResult.innerHTML = "";

    if(!filterInput.value)return;

    for(let town of townsList){
      if(isMatching(town.name, filterInput.value)){
          filterResult.innerHTML += town.name + "<br/>";
      }
    }
});

export {
    loadTowns,
    isMatching
};
