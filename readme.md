# Prostamp

> Incremental asynchronous template rendering

Eager, incremental template rendering with automatic promise resolution and partial support through nested rendering.

Prostamp is an invented contraction of [progressive stamping](https://en.wikipedia.org/wiki/Progressive_stamping), an 
analogy of what this library does.

## API

### `prostamp(template, locals) => AsyncIterator` (default export)

Consume with `for await`:

```js
for await (const output of prostamp(template, locals)) {
  process.stdout.write(output)
}
```

Consume with streams:

```js
import { Readable } from 'stream'
Readable.from(prostamp(template, locals)).pipe(process.stdout)
```

#### Template

The `template` argument should be a string or Buffer that contains content and template variables.

A template variable is denoted with `__name__`. 

#### Locals

The `locals` argument should be an object that contains keys which correspond to the template variable names.
The values may be strings, numbers, promises or async iterators as returned from `prostamp`, or arrays.

#### Example

```js
import prostamp from './index.js'

const template = `
Some content: __something__

__another__

More things:

__more__
`

const locals = {
  something: 'here it is',
  another: Promise.resolve('promises are auto resolved before rendering'),
  more: prostamp('Nesting is possible, __items__', { items: ['arrays ', 'are ', Promise.resolve('expanded')] })
}

for await (const output of prostamp(template, locals)) process.stdout.write(output)
```

Outputs:

```

Some content: here it is

promises are auto resolved before rendering

More things:

Nesting is possible, arrays are expanded

```

### ``render `template` ``

The `render` function is a tagged template function that has the same qualities as the `prostamp` function 
when it comes to promise resolution, array expansion and nesting but it works with native JS template strings. 

```js
import { render } from 'prostamp'
const something = 'here it is'
const another = Promise.resolve('promises are auto resolved before rendering')
const items = ['arrays ', 'are ', Promise.resolve('expanded')]
const more = render `Nesting is possible, ${items}`

const iterator = render `
  Some content: ${something}

  ${another}

  More things:

  ${more}

`

for await (const output of iterator) process.stdout.write(output)
```

## Support

Node 12 and up.

## License

MIT
