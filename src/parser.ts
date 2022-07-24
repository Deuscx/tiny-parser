import type { NumericLiteral, StringLiteral } from '@babel/types'
import { Tokenizer } from './tokenizer'
/**
 * Letter parser
 */
class Parser {
  private _string = ''
  private _tokenizer: Tokenizer
  private _lookahead: any
  constructor() {
    this._string = ''
    this._tokenizer = new Tokenizer()
  }

  /**
   * Parse a string to AST
   * @param str
   */
  parse(str: string) {
    this._string = str
    this._tokenizer.init(str)

    // 有限自动机
    this._lookahead = this._tokenizer.getNextToken()

    return this.program()
  }

  /**
   *
   * Program
   *  : Literal
   */
  program() {
    return {
      type: 'Program',
      body: this.Literal(),
    }
  }

  /**
   * Literal
   * : NumericLiteral
   * | StringLiteral
   */
  Literal() {
    switch (this._lookahead.type) {
      case 'number':
        return this.NumericLiteral()
      case 'string':
        return this.StringLiteral()
      default:
        break
    }
  }

  /**
   * NumericLiteral
   *  : NUMBER
   */
  NumericLiteral(): NumericLiteral {
    const token = this._eat('number')
    return {
      type: 'NumericLiteral',
      value: Number(token.value),
    }
  }

  StringLiteral(): StringLiteral {
    const token = this._eat('string')
    return {
      type: 'StringLiteral',
      value: token.value,
    }
  }

  private _eat(tokenType: string) {
    const token = this._lookahead
    if (token === null)
      throw new Error('Unexpected end of input', tokenType)

    if (token.type !== tokenType)
      throw new Error(`Unexpected token ${token.type}, expected ${tokenType}`)

    // Advanced to next token
    this._lookahead = this._tokenizer.getNextToken()
    return token
  }
}

export default Parser
