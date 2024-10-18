// ## Функциональные типы

/**
 * Perfect forwarding как в C++
 * Как получить функциональный тип у функции, у которой много перегрузок? Как этот тип связать с переменной типа в generic?
 */

/*


На входе функциональный тип, возвращающий void, может принимать функции, возвращающие что-то. Всё равно void означает, что результат будет проигнорирован, а значит тип результата передаваемой функции может быть любым. Типы функций, возвращающих void, являются надтипами любых других функций.

Типы функций с аргументами являются надтипами функций с меньшим числом аргументов. В сочетании с типом результата void может быть много ошибок неправильного использования функций.

Union-тип, состоящий их функциональных типов, не имеет смысла, так как невозможно в javascript различать функции по сигнатурам в runtime (по крайней мере, просто). Есть только typeof === 'function'. Из-за этого для таких значений требуются объекты-обёртки с тэгами для различения конкретных функциональных типов.
