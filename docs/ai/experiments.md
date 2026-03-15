# Experimentos

## 📕Descripción📕

Vamos a hacer unos problemas básicos de programación en los que voy a completarlos yo solo y luego con la ayuda de la IA y compararemos resultados, tiempo invertido, etc.

---

## ✏️Ejercicio 1✏️

Reto FizzBuzz, si el número es divisible por 3 escribir fizz si es divisible por 5 escribir buzz y si es divisible por ambos escribir FizzBuzz

### Sin IA

Me ha costado alrededor de 5 minutos. El código es básicamente una variable con el número que usemos en cuestión, un if que lea que el resto de la división entre tu número y el 3 es igual a 0 y a su vez si también su resto es igual a 0 al dividirse entre 5 escribe FizzBuzz, después un else if que compruebe si el resto de su división entre 3 es igual a 0 escribe Fizz y por último otro else if para comprobar la misma división entre 5; si el resto es 0 escribe Buzz.
Es una manera simple y rápida de hacerlo.

### Con IA

El código ha sido prácticamente instantáneo; ha tardado 2 segundos en generar la respuesta y el código es idéntico, con la diferencia de que ha creado un bucle en el que están los if y le da a su variable número valor de 1 y suma uno cada vuelta que da el bucle hasta 100 para que imprima Fizz, Buzz o FizzBuzz hasta que llegue al número 100.

---

## ✏️Ejercicio 2✏️

Inversor de cadenas: en un array de tipo String imprime todas las palabras al revés sin hacerlo con el .reverse() en caso de hacerlo en Python o JavaScript.

### Sin IA

Me ha llevado 15 minutos más o menos. Ha sido crear dos bucles en los que uno recorre la lista y el otro la longitud de la palabra; yo he hecho que imprimiese letra por letra desde atrás hasta formar la palabra y cuando salía del bucle hacer un salto de línea.

### Con IA

La IA lo ha hecho también en 2 segundos y el código es parecido, cambiando que cuando el bucle recorría la longitud de la palabra en una variable recogía los caracteres y luego los imprime al salir del bucle de cada palabra y se resetea cuando empieza el bucle que recorre la lista.

---

## ✏️Ejercicio 3✏️

Contador de vocales: en un String tienes que imprimir el número de vocales que haya en el String, independientemente de si es mayúscula o no.

### Sin IA

Tiempo aprox. 11 minutos. Un bucle que recorre la longitud de la palabra y verifica cada letra con .toLowerCase a través de un if: si la letra es igual a "a", "e", "i", "o" o "u", una variable llamada vocales añade 1 y al acabar el bucle imprime "hay x vocales".

### Con IA

Es lo mismo, tarda 2 segundos y el código es casi idéntico, exceptuando que almacena el char de la palabra en una variable y yo comparo directamente en el if el carácter de la palabra con el índice que va sumando cada vez que el bucle avanza.

---

## ✏️Tareas de mi proyecto✏️

El crear la estructura de los botones de la lista de tareas realmente no tarda mucho tiempo y yo he dejado que la IA me haga el código de los botones de añadir prioridad y fecha y hora de cada tarea porque me iba a tomar mucho más tiempo a mí hacerlo a mano y pensar qué class o id ponerle.

El CSS de diferentes botones también lo he hecho con la IA, ya que al tener todo mi CSS hecho y haberle dado un estilo, la IA te hace instantáneamente un CSS que quede bien con tu proyecto y en relación a tu CSS ya hecho.

Refactorizar el código: cuando tienes una función bien pero puede quedar más limpia o más eficiente, en vez de estar 5 minutos le pides a la IA que refactorice la función y funciona igual pero más legible, más limpia y menos compleja.