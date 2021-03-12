const prostamp = require('..')

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

async function run () {
  for await (const output of prostamp(template, locals)) process.stdout.write(output)
}

run().catch(console.error)
