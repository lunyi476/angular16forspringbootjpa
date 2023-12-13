import Promise from "es6-promise";
//import XMLHttpRequest from "http";
//import fs from 'fs'; 

//import internal from 'internal';

// C:\angular_springboot_jpa\angular16forspringbootjpa\node_modules\rxjs\dist\cjs\internal


import { of, switchMap, Subscription, interval, take, Observable} from 'rxjs';


function HTMLData ()  {
  this.name = _name;

  this.fun = _inter;
  
  var _name = "aaa";

  function _inter () {
    console.log("999");
  }
}

let ty = new HTMLData();

console.log(ty.fun());


let animal = {
  eats: true
};
let rabbit = {
  jumps: true
};

rabbit.__proto__ = animal; // sets rabbit.[[Prototype]] = animal

console.log(rabbit.animal);


/* let sayHi = function(who) {
  if (who) {
    alert(`Hello, ${who}`);
  } else {
    sayHi("Guest"); // Error: sayHi is not a function
  }
};

let welcome = sayHi;
sayHi = null;

welcome(); // Error, the nested sayHi call doesn't work any more!


let sayHi2 = function func(who) {
  if (who) {
    alert(`Hello, ${who}`);
  } else {
    func("Guest"); // Now all fine
  }
};

let welcome2 = sayHi2;
sayHi2 = null;

welcome2();  */


/* const readBooks = [
  { bookId: 1, title: 'Clean code', auther: 'Robert Cecil Martin' },
  { bookId: 1, title: 'First rate of madness', auther: 'Nassir Ghaemi' },
  { bookId: 2, title: 'The acheivement habits', auther: ' Bernard Roth' },
  { bookId: 3, title: 'Conscious Capitalism', author: 'John Mackey and Rajendra Sisodia'},
  { bookId: 3, title: 'The richest man in Babylon', author: 'George Samuel Clason'},
  { bookId: 3, title: 'Rich dad poor dad', author: 'Robert Kiyosaki and Sharon Lechter'},
];

console.log("Observable from sratch");

function subscribe(subscriber) {
  
  for (let book of readBooks) {
      subscriber.next(book);
  }
}

//document.getElementsByName("DIV");  document undefined

let readBooks$ = new Observable(subscribe);
// book => console.log(book.title)  converted to one Subscriber (also type of Observer)
// Then passing to function subscribe(subscriber)
// Then inside function,  subscriber.next(book); will notify Observer 
// which launchs "book => console.log(book.title)"
readBooks$.subscribe(book => console.log(book.title)); */

/* // accumulating add function
function closuredfunc (x) {  // setup base value
  let y =x;  // bundled together (enclosed) with references to its surrounding state 
 
  function insidefunc (z) {  // real operation
    y = y+z; // keep the current number
    return y;
  }

  return insidefunc; // function reference to real operation
}

let gu = closuredfunc (4) ;  // setup base value: 4  and return function reference
console.log(gu(1) + "     "+gu(5)); // increase by calling function */


/* const observablew = of(10, 20, 30);
// subscription is observablew which implemented Subscription
const subscription = observablew.subscribe((x) => console.log(x));
// Later:
subscription.unsubscribe();

observablew.forEach(element => {
  Console.log(element);  // nothing left
});


const observable = new Observable(
  //  constructor(subscribe?: (this: Observable<T>, subscriber: Subscriber<T>) => TeardownLogic)
  // subscribe function which take Subscriber(implemented Observer)/Observer as parameter
  // This parameter is:
  /*{
    next(x) {
      console.log('got value ' + x);
    },
    error(err) {
      console.error('something wrong occurred: ' + err);
    },
    complete() {
      console.log('done');
    },
  }*/
  /* (observer) => {
  // subscriber or observer  Produce data:
  observer.next(1);  // call  console.log('got value ' + x);
  observer.next(2);
  observer.next(3);
  setTimeout(() => {
    observer.next(4);
    observer.complete();
  }, 0);
}
); */


//observable.forEach((next) => console.log(" first   " + next)); 

// observable.subscribe is:
/*
 {
  // subscriber or observer  Produce data:
  observer.next(1);  // call  console.log('got value ' + x);
  observer.next(2);
  observer.next(3);
  setTimeout(() => {
    observer.next(4);
    observer.complete();
  }, 0);
  */
/* observable.subscribe({
  next(x) {
    console.log('got value ' + x);
  },
  error(err) {
    console.error('something wrong occurred: ' + err);
  },
  complete() {
    console.log('done');
  },
});

console.log('just after subscribe');  */
//observable.forEach((next) => console.log(" first" + next));

 
/* const switched = of(1, 2, 3).pipe(switchMap(x => of(x, x ** 2, x ** 3)));
const  yu = switched.subscribe();
yu.unsubscribe();
switched.forEach (next => console.log(next));
 
const numbers = interval(1000);
 
const takeFourNumbers = numbers.pipe(take(5));
 
takeFourNumbers.subscribe(x => console.log('Next: ', x)); */


/* const observable1 = interval(400);
const observable2 = interval(300);
 
const subscription = observable1.subscribe(x => console.log('first: ' + x));
const childSubscription = observable2.subscribe(x => console.log('second: ' + x));
 
//subscription.add(childSubscription);
 
 setTimeout(() => {
  // Unsubscribes BOTH subscription and childSubscription
  subscription.unsubscribe();
}, 1000);  */


 function myDisplayer(some) {
  console.log("AAAA");
}

let myPromise = new Promise(function(myResolve, myReject) {
  let x = 0;

// some code (try to change x to 5)

  if (x == 0) {
    myResolve("OKS");  // actual call static resolve
  } else {
    myReject("Error"); // actual call static reject
  }
});

myPromise.then(
  function(value) {myDisplayer(value);},
  function(error) {myDisplayer(error);}
);

console.log("AAA");



/* function myDisplayer(some) {
  //document.getElementById("demo").innerHTML = some;
  Console.log(some);
} */
// executor as passed function parameter
/* let myPromise = new Promise(function(myResolve, myReject) {
  let req = new XMLHttpRequest();
  req.open('GET', "https://www.w3schools.com/js/tryit.asp?filename=tryjs_promise1");
 
  req.onload = function() {
    if (req.status == 200) {
      myResolve(req.response);
    } else {
      myReject("File not Found");
    }
  };
  req.send();

});


myPromise.then(
  function(value) {myDisplayer(value);},
  function(error) {myDisplayer(error);}
);


console.log('start reading a file...'); */

/* fs.readFile('file.md', 'utf-8', function (err, content) {
  if (err) {
    console.log('error happened during reading the file')
    return console.log(err)
  }

  console.log(content)
});

console.log('end of the file'); */