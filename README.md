# TipoCambio

Permite cambiar un monto de una moneda a otra moneda

<br>

### Ejemplos

1.- Obtener la moneda actual

La moneda actual se almacena en la variable moneda del objecto **document** y lo mismo en la función **TipoCambio**

```js
var moneda = document.moneda;
```

<br>

2.- Convertir 10 Dolares a la moneda actual

```js
var dolares = TipoCambio(10, 'USD');
```

<br>

3.- Convertir 10 Dolares a la moneda actual basado en la conversión del día **21/FEB/2019**

> La información del día requerido debe haber sido descargado primero

```js
var dolares = TipoCambio(10, 'USD', '2019-02-21');
```

<br>

4.- Cambiar la fecha de conversión

```js
TipoCambio.day = '2019-02-20';
TipoCambio.CambiarDay('2019-02-20'); // Retorna el mismo objeto
```

<br>

5.- Descargar información de conversión de una fecha en específico

> Se empezó a reciclar la información desde el día **20/FEB/2019**

```js
TipoCambio.loadDay('2019-02-20', function(){
  // Función a ejecutar despues de leer la información del día
}); // Retorna un objeto PROMISE por tanto puede ejecutarse la función THEN
```

<br>

6.- Cambiar la moneda de conversión

> Las moneda debe estar habilitada en los *currencies*

```js
TipoCambio.moneda = 'EUR';
TipoCambio.CambiarMoneda('EUR'); // Retorna el mismo objeto
```

<br>

7.- Convertir 10 Dolares a Soles

```js
var soles = TipoCambio(10, 'USD', 'PEN');
```

<br>

8.- Convertir 10 Dolares a Soles basado en la conversión del día **21/FEB/2019**

```js
var soles = TipoCambio(10, 'USD', 'PEN', '2019-02-21');
```

<br>

9.- Crear nueva instancia de **_TipoCambio_**

Permite tener todas las funcionalidades del TipoCambio en un nuevo objeto con distintos atributos (moneda, día)

```js
var TC = new TipoCambio();
```

10.- Usando objetos *JQuery*

> El valor resultante de la conversión varía automáticamente al modificar el día y la moneda de la instancia **TipoCambio**

```js
/**
 * $(obj).TipoCambio(val, from, TC);
 *
 * Se prioriza el valor a cambiar en el sgte. orden:
 * - El parametro val
 * - Atributo de obj: data-val
 * - Atributo de obj: data-valor
 * - Atributo de obj: data-amount
 * - Atributo de obj: data-monto
 * - Valor del INPUT
 *
 * Se prioriza la moneda origen a cambiar en el sgte. orden:
 * - El parametro from
 * - Atributo de obj: data-moneda
 * - Atributo de obj: data-currencie
 * - Atributo de obj: data-from
 *
 * Se prioriza la cantidad de decimales a poner en el sgte. orden:
 * - Atributo de obj: data-dec
 * - Atributo de obj: data-decimals
 * - Atributo de obj: data-decimales
 *
 * Se prioriza el signo de los miles a poner en el sgte. orden:
 * - Atributo de obj: data-mil
 * - Atributo de obj: data-million
 * - Atributo de obj: data-millions
 *
 * Se prioriza la instancia TC en el sgte. orden:
 * - El parametro TC
 * - Función Global TipoCambio
 */
$('[data-toogle="TipoCambio"]').TipoCambio();
```


