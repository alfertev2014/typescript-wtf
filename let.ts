

// ## let и изменяемые данные

// let-переменные могут оставаться неинициализированными.


let uninitialized: string

// Нельзя использовать переменную до присваивания
const something = uninitialized

uninitialized = "something"


// Если переменные инициализируются в лямбдах, система типов это не отслеживает.

const something2 = uninitialized

const someFunc = (lambda: () => void) => {
  lambda()
}

let uninitialized2: string

someFunc(() => {
  uninitialized2 = "something"
})

// Всё так же нельзя
const something3 = uninitialized2

const someFunc2 = (lambda: () => void) => {
  // Даже вызывать lambda не будем
}

let uninitialized3: string

someFunc(() => {
  // используем без проблем
  const something: string = uninitialized3

  something.split(' '); // TypeError
})

let uninitialized4: string

someFunc(() => {
  uninitialized4 = "something"
});

(() => {
  // А вот так уже нельзя
  const something: string = uninitialized4
})();

(x => x)(() => {
  // А вот так можно
  const something: string = uninitialized4
  
  something.split(' '); // TypeError
})();

interface A {
  type: "A"
  a: string
}

interface B {
  type: "B"
  b: boolean
}

let ab: A | B = { type: 'A', a: "a" }

if (ab.type === 'A') {
  // Здесь ab: A
  const a = ab.a 

  ab = { type: 'B', b: false }

  // Здесь ab: B
  ab.type
}



interface C {
  foo: A | B
}

const c: C = { foo: { type: 'A', a: "bar" }}
const d = c;

if (c.foo.type === 'A') {
  // Здесь c.foo: A
  const a = c.foo.a

  d.foo = { type: 'B', b: false }

  // Здесь всё ещё c.foo: A
  const a1 = c.foo.a

  a1.split(' ') // TypeError
}


interface RC {
  readonly foo: A | B
}

const rc: RC = { foo: { type: 'A', a: "bar" }}
const rd: C = rc;

if (rc.foo.type === 'A') {
  // Здесь c.foo: A
  const a = rc.foo.a

  rd.foo = { type: 'B', b: false }

  // Здесь всё ещё c.foo: A
  const a1 = rc.foo.a

  a1.split(' ') // TypeError
}