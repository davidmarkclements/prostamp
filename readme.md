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

A template variable is denoted with `__name__`. Template variables may also contain extra meta data
delimited by `:`. For instance `__name:more:info__`. 

#### Locals

The `locals` argument should be an object that contains keys which correspond to the template variable names.
The values may be strings, numbers, promises or async iterators as returned from `prostamp`, arrays or async functions or plain functions..
Async functions and plain functions are called with `(key, meta)` where `key` is the `name` in `__name:more:info__` and meta is an array
containing any meta data, in the example case it will be `['more', 'info']`. In the case of an async function the returned promise is resolved
to its value before interpolation.

#### Example

```js
import prostamp from './index.js'

const template = `
Some content: __something__

__another__

More things:

__more__

__dynamic:with:metadata__
`

const locals = {
  something: 'here it is',
  another: Promise.resolve('promises are auto resolved before rendering'),
  more: prostamp('Nesting is possible, __items__', { items: ['arrays ', 'are ', Promise.resolve('expanded')] }),
  async dynamic (key, meta) {
    return `Name is "${key}", meta[0] is "${meta[0]}" and meta[1] is "${meta[1]}"`
  }
}

for await (const output of prostamp(template, locals)) process.stdout.write(output)
```

Outputs:

```

Some content: here it is

promises are auto resolved before rendering

More things:

Nesting is possible, arrays are expanded

Name is "dynamic", meta[0] is "with" and meta[1] is "metadata"

```

### ``render `template` ``

The `render` function is a tagged template function that has the same qualities as the `prostamp` function 
when it comes to promise resolution, array expansion and prostamp async renderer nesting but it works with 
native JS template strings.

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
