'use strict'

async function * yieldify (arg) {
  if (arg === null || typeof arg !== 'object') {
    yield arg
    return
  }
  if (Array.isArray(arg)) {
    for (const item of arg) {
      if (item === arg) continue // break circular array refs
      yield * yieldify(item)
    }
  } else if (typeof arg[Symbol.asyncIterator] === 'function') {
    yield * arg
  } else {
    yield await arg
  }
}

async function * render (strings, ...args) {
  let counter = -1
  const end = strings.length - 1
  while (counter++ < end) {
    yield strings[counter]
    if (end === counter) break
    yield * yieldify(args[counter])
  }
}

async function * prostamp (template, locals) {
  const args = []
  const strings = []
  template += ''
  let last = 0
  for (const result of template.matchAll(/__([a-zA-Z/\\.:]*?)__/g)) {
    const [match, def] = result
    const { index } = result
    const [ key, ...meta ]  = def.split(':').map((s) => s.trim())
    const local = typeof locals[key] === 'function' ? locals[key](key, meta) : locals[key]
    args.push(local)
    strings.push(template.slice(last, index))
    last = index + match.length
  }
  strings.push(template.slice(last))
  yield * render(strings, ...args)
}

module.exports = prostamp
module.exports.render = render
