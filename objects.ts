// ## Структурная типизация объектов


interface A {
  foo: string;
  bar: number;
}

// Объект с тем же составом полей, что и A.
const a: A = { foo: "foo", bar: 42 };

// Объект расширенным составом полей для интерфейса A.
// Ошибка: Object literal may only specify known properties, and 'baz' does not exist in type 'A'.
const a1: A = { foo: "foo", bar: 42, baz: false };
// Хотя, казалось бы, тип объекта является подтипом типа A.
// Ну, ок. Допустим, что это нормально.

({ foo: "foo", bar: 42, baz: false }) satisfies A; // То же самое.
({ foo: "foo", bar: 42, baz: false } as const) satisfies A; // То же самое.
// Типы объектных литералов с лишними полями не будут удовлетворять интерфейсу A.
// Потому что так работает satisfies - пытается приписать точный тип объектному литералу.

// Зато as срабатывает.
({ foo: "foo", bar: 42, baz: false }) as A;
({ foo: "foo", bar: 42, baz: false } as const) as A;
// as намеренно приписывает объектному литералу его выведенный тип и потом проверяет отношение подтипов.

// Объект с расширенным составом полей для интерфейса A.
// Позволим typescript вывести тип объекта.
const a2 = { foo: "foo", bar: 42, baz: false };
/*
Выведенный тип:
const a2: {
  foo: string;
  bar: number;
  baz: boolean;
} 
*/

// WTF?!
const a3: A = a2;
// Почему-то вот так уже можно.
// Почему-то здесь срабатывает правило подтипов.

// Функция, ожидающая параметр интерфейса А
const fa = (pa: A): void => { /* ... */};

// легко принимает объекты типа A,
fa(a);

// легко принимает объектные литералы с тем же составом и типом полей,
fa({ foo: "foo", bar: 42 });

// почему-то не хочет принимать расширенный объектный литерал...
fa({ foo: "foo", bar: 42, baz: false });
// Ну, ок. Это аналогично предыдущему присваиванию в переменную a1.

// WTF?!
fa(a2);
// Легко принимает объект объектного типа с лишними полями,

// даже для случая as const.
const a4 = { foo: "foo", bar: 42, baz: false } as const;
fa(a4);
/*
Выведенный тип:
const a4: {
    readonly foo: "foo";
    readonly bar: 42;
    readonly baz: false;
}
*/

// Видимо, есть разница в обработке объектных литералов и приписывания им типа
//  и проверкой совместимости двух уже известных типов.
// Чтобы явно приписать тип объектному литералу, нужно использовать as.
// В противном случае компилятор старается приписать ему в точности ожидаемый тип.

// Тогда что проверяет satisfies? Не похоже, что правило подтипов.


// Интерфейс, расширяющий A с помощью оператора индексации,
// тем самым оставляя возможность для неопределённого количества других полей.
interface Ae {
  foo: string;
  bar: number;
  [k: string | number | symbol]: unknown;
}

// В такой интерфейс можно присвоить такие объекты. Ок.
const ae: Ae = { foo: "foo", bar: 42, baz: false }

// WTF?!
const a5: A = ae;
// Тот же вопрос. Почему-то здесь правило подтипов срабатывает.

// Даже так можно!
const ae2: Ae = ({ foo: "foo", bar: 42, baz: false }) satisfies Ae;

// А вот так нельзя.
const a7: A = ({ foo: "foo", bar: 42, baz: false }) satisfies Ae;
// satisfies никак не участвует в приписывании типов, зато делает проверку по правилу подтипов
// Компилятор попытался приписать объектному литералу тип А:
// Object literal may only specify known properties, and 'baz' does not exist in type 'A'.

// Зато вот так можно.
const a8: A = ({ foo: "foo", bar: 42, baz: false }) as Ae;

// WTF?!
fa(ae);
// Тот же вопрос. Почему-то здесь правило подтипов срабатывает,

// А вот так нельзя. С объектными литералами не срабатывает.
fa(({ foo: "foo", bar: 42, baz: false }) satisfies Ae);

// А вот так можно
fa(({ foo: "foo", bar: 42, baz: false }) as Ae);

// Кстати, WTF?!
// получается, интерфейс или объектный тип может быть подтипом интерфейса или объектного типа
// с индексатором [k: string | number | symbol]: unknown, и наоборот.
// То есть, A <: Ae и Ae <: A.
// Потому что сам по себе интерфейсный тип предполагает, что могут быть ещё любые properties.


// Интерфейс с теми же полями, что и у A
interface B {
  foo: string;
  bar: number;
}

// Объекты интерфейса A легко передаются туда, где ожидается B.
const b: B = a; 

// И наоборот.
fa(b);


// Интерфейс с теми же полями, что у A и B, но типы полей более узкие.
interface B1 { 
  foo: "bar";
  bar: 0 | 1 | 2;
}

// Нельзя. Что и ожидаемо
const b1: B1 = a;

const b2: B1 = { foo: "bar", bar: 1 };
const b3: B = b2;

// To же, что и в случае интерфейса А.
const b4: B1 = { foo: "bar", bar: 1, baz: false };
// Тип объектного литерала ещё не приписан, поэтому
// пытаемся дать ему точный тип B1, что и не выходит.

// Объектный тип - это то же самое, что интерфейс?
type C = {
  foo: string;
  bar: number;
}
const c1: C = a
const c2: C = b
const c3: C = { foo: "foo", bar: 100500, buzz: "fizz" }

fa(c1);
fa(c2);

const c4 = { foo: "foo", bar: 100500, buzz: "fizz" }
const c5: C = c4;

type Ce = {
  foo: string;
  bar: number;
  [k: string | number | symbol]: unknown;
}

let ce: Ce = { foo: "foo", bar: 100500, buzz: "fizz" };
const c6: C = ce;
ce = c6;
// Объектные типы ведут себя как интерфейсы

// Интерфейсы отличаются от объектов только тем, что они расширяемые

interface D {
  bla: string;
}

interface D {
  hey: number;
}

const d: D = { bla: "bla", hey: 42 };

interface R {
  readonly foo: string;
  readonly bar: number;
}

const r: R = { foo: "foo", bar: 100500 }

const fr = (r: R): void => { /* do something */}

fr(a);

const ar: A = r;

fa(r);


class CR implements R {
  foo: string = "bar";
  bar: number = 42;
}

const cr: CR = new CR();

cr.foo = "buz";

const rc: R = cr;


// Интерфейсы с readonly-полями не позволяют реализации быть не readonly, то есть, readonly-тип не является надтипом не-readonly.