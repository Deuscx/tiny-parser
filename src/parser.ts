import type { NumericLiteral } from './types'

/**
 * Letter parser
 */
class Parser {
  private _string = ''
  /**
   * Parse a string to AST
   * @param str
   */
  parse(str: string) {
    this._string = str

    return this.program()
  }

  /**
   *
   * Program
   *  : NumericLiteral
   */
  program() {
    return this.NumericLiteral()
  }

  /**
   * NumericLiteral
   *  : NUMBER
   */
  NumericLiteral(): NumericLiteral {
    return {
      type: 'NumericLiteral',
      value: Number(this._string),
    }
  }
}

export default Parser
