/**
 * Tokenizer Spec
 */
const spec = {
  // SKIP token
  'whitespace': [/^\s+/],
  'comments': [/^\/\/[^\r\n]*/, /^\/\*[\s\S]*?(?:\*\/|$)/],
  'number': [/^\d+/],
  'string': [/^"[^"]*"/, /^'[^']*'/],
  ';': [/^;/],
  '{': [/^\{/],
  '}': [/^\}/],
  '(': [/^\(/],
  ')': [/^\)/],
  'ADDITIVE_OPERATOR': [/^\+/, /^-/],
  'MULTIPLICATIVE_OPERATOR': [/^\*/, /^\//],
  'binary': [
    /^%/,
    /^&/,
    /^\|/,
    /^\^/,
    /^<</,
    /^>>/,
    /^>>>/,
    /^<=/,
    /^>=/,
    /^<>,/,
  ],
}

export class Tokenizer {
  string!: string
  cursor = 0
  init(str: string) {
    this.string = str
    this.cursor = 0
  }

  hasMoreTokens() {
    return this.cursor < this.string.length
  }

  getNextToken() {
    if (!this.hasMoreTokens())
      return null
    const string = this.string.slice(this.cursor)

    for (const [type, regex] of Object.entries(spec)) {
      for (const r of regex) {
        const tokenValue = this._match(r, string)
        if (tokenValue === null)
          continue

        // skip
        if (['whitespace', 'comments'].includes(type))
          return this.getNextToken()
        return {
          type,
          value: tokenValue,
        }
      }
    }

    throw new Error(`Unexpected token: ${string}`)
  }

  _match(regex: RegExp, str: string) {
    const match = regex.exec(str)
    if (match) {
      this.cursor += match[0].length
      return match[0]
    }
    return null
  }

  isEOF() {
    return this.cursor >= this.string.length
  }
}
