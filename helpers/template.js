/**
 * Renders a string template by replacing key value pairs
 *
 * @param {String} string
 * @param {Object} values
 * @returns
 */
export function stringTemplate(string, values) {
  if (typeof string !== 'string')
    throw new Error(
      `expected first argument (string) to be of type String but ${typeof string} given`,
    )

  const replacer = (match, key) => values[key] || match
  return string.replace(/\{\{([^{}]*)\}\}/g, replacer)
}

export function test() {
  const template =
    'The quick brown {{animal}} {{animal action}} the {{fence}}. -,._:;+"*ç%&/()==?`'
  const values = {
    animal: 'fox',
    'animal action': 'jumps over',
    other: 'not used here',
  }
  const expected =
    'The quick brown fox jumps over the {{fence}}. -,._:;+"*ç%&/()==?`'
  const result = stringTemplate(template, values)
  const success = expected === result

  console.log({
    template,
    values,
    expected,
    result,
    success,
  })

  return success
}
