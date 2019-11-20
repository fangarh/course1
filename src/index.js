/* ДЗ 2 - работа с массивами и объектами */

/*
 Задание 1:

 Напишите аналог встроенного метода forEach для работы с массивами
 Посмотрите как работает forEach и повторите это поведение для массива, который будет передан в параметре array
 */
function forEach(array, fn) {
  for( let i = 0; i < array.length; i ++ ){
      fn(array[i], i, array);
    }
}

/*
 Задание 2:

 Напишите аналог встроенного метода map для работы с массивами
 Посмотрите как работает map и повторите это поведение для массива, который будет передан в параметре array
 */
function map(array, fn) {
  let res = [];
  for( let i = 0; i < array.length; i ++ ){
    res.push(fn(array[i], i, array));
  }
  return res;
}

/*
 Задание 3:

 Напишите аналог встроенного метода reduce для работы с массивами
 Посмотрите как работает reduce и повторите это поведение для массива, который будет передан в параметре array
 */
function reduce(array, fn, initial) {
  let res;
  if(typeof initial !== 'undefined')
    res = fn(initial, array[0], 0, array);    
  else
    res = array[0];

  for( let i = 1; i < array.length; i ++ ){
    res = fn(res, array[i], i, array);
  }

  return res;
}

/*
 Задание 4:

 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистр и вернуть в виде массива

 Пример:
   upperProps({ name: 'Сергей', lastName: 'Петров' }) вернет ['NAME', 'LASTNAME']
 */
function upperProps(obj) {
  let result = [];

  for (let prop in obj) {
    if( obj.hasOwnProperty( prop ) ) {
      result.push(prop.toUpperCase());
    } 
  }
  
  return result;
}

/*
 Задание 5 *:

 Напишите аналог встроенного метода slice для работы с массивами
 Посмотрите как работает slice и повторите это поведение для массива, который будет передан в параметре array
 */
function slice(array, from, to) {
  let result = [];
 
  to = typeof to !== 'undefined' ? (to < 0 ? array.length + to : to) : array.length;
  
  from = (from < 0 ?  (array.length + from < 0 ? 0 : array.length + from ) : from) || 0;

  for(;from < to; from ++)
    result.push(array[from]);
  return result;
}

/*
 Задание 6 *:

 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj) {
  return new Proxy({...obj},{
    get(target, prop) {      
      return target[prop];
    },
    set(target, prop, val){
      if(typeof val == 'number')
          target[prop] = val * val;
      else
          target[prop] = val;

      return true;
    }
  });
}

export {
    forEach,
    map,
    reduce,
    upperProps,
    slice,
    createProxy
};
