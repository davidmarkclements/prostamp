import prostamp from '../index.js'

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

// Node 14 required for this line:
for await (const output of prostamp(template, locals)) process.stdout.write(output)
