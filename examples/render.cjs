const { render } = require('..')
const something = 'here it is'
const another = Promise.resolve('promises are auto resolved before rendering')
const items = ['arrays ', 'are ', Promise.resolve('expanded')]
const more = render`Nesting is possible, ${items}`

const iterator = render`
  Some content: ${something}

  ${another}

  More things:

  ${more}

`

async function run () {
  for await (const output of iterator) process.stdout.write(output)
}

run().catch(console.error)
