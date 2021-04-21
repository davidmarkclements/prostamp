import prostamp from '../index.js'

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

// Node 14 required for this line:
for await (const output of prostamp(template, locals)) process.stdout.write(output)
