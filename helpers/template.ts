/**
 * Renders a string template by replacing key value pairs
 *
 * @param {String} string
 * @param {Object} values
 * @returns
 */
export function stringTemplate(string: string, values: Record<string, string>): string {
  if (typeof string !== 'string')
    throw new Error(
      `expected first argument (string) to be of type String but ${typeof string} given`,
    )

  const replacer = (match: string, key: string): string => values[key] || match
  return string.replace(/\{\{([^{}]*)\}\}/g, replacer)
}


export function test(): boolean {
  const template: string =
    'The quick brown {{animal}} {{animal action}} {{fence}}. -,._:;+"*ç%&/()==?`'
  const values: Record<string, string> = {
    animal: 'fox',
    'animal action': 'jumps over',
    other: 'not used here',
  }
  const expected: string =
    'The quick brown fox jumps over {{fence}}. -,._:;+"*ç%&/()==?`'
  const result: string = stringTemplate(template, values)
  const success: boolean = expected === result

  console.log({
    template,
    values,
    expected,
    result,
    success,
  })

  return success
}
