/* ДЗ 6 - Асинхронность и работа с сетью */

/*
 Задание 1:

 Функция должна возвращать Promise, который должен быть разрешен через указанное количество секунду

 Пример:
   delayPromise(3) // вернет promise, который будет разрешен через 3 секунды
 */
function delayPromise(seconds) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000* seconds) ;
    });
}

/*
 Задание 2:

 2.1: Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов можно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json

 2.2: Элементы полученного массива должны быть отсортированы по имени города

 Пример:
   loadAndSortTowns().then(towns => console.log(towns)) // должна вывести в консоль отсортированный массив городов
 */
function loadAndSortTowns() {
  return new Promise((resolve, rej) => {

    const url = "https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json";
    
    fetch(url).then( response => response.json()).then(fetchRes => resolve(Array.from(fetchRes).sort((e1,e2)=>stringSortsort(e1.name, e2.name)))).catch(e=>rej(e));

    //fetch(url).then( response => response.json() ).then(fetchRes => resolve([...fetchRes])).catch(e=>{throw e});

        });
    
}

function stringSortsort(a, b){
  if (a > b) {
      return 1;
  }
  
  if (a < b) {
      return -1;
  }

  return 0;
}

export {
    delayPromise,
    loadAndSortTowns
};
