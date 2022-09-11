import type {
  BinaryExpression,
  BlockStatement,
  EmptyStatement,
  ExpressionStatement,
  NumericLiteral,
  StringLiteral,
} from '@babel/types'
import { blockStatement } from '@babel/types'
import { LiteralExpression } from 'typescript'
import { Tokenizer } from './tokenizer'

/**
 * Default AST node type.
 */
const DefaultFactory = {
  Program(body: any) {
    return {
      type: 'Program',
      body,
    }
  },
  EmptyStatement() {
    return {
      type: 'EmptyStatement',
    }
  },
  BlockStatement(body: any) {
    return {
      type: 'BlockStatement',
      body,
    }
  },
  ExpressionStatement(expression: any) {
    return {
      type: 'ExpressionStatement',
      expression,
    }
  },
  NumericLiteral(value: any) {
    return {
      type: 'NumericLiteral',
      value,
    }
  },
  StringLiteral(value: any) {
    return {
      type: 'StringLiteral',
      value,
    }
  },
}

const SExpressionFactory = {
  Program(body: any) {
    return ['begin', body]
  },
  EmptyStatement() {
    return ['empty']
  },
  BlockStatement(body: any) {
    return ['block', body]
  },
  ExpressionStatement(expression: any) {
    return ['expression', expression]
  },
  NumericLiteral(value: any) {
    return ['NumericLiteral', value]
  },
  StringLiteral(value: any) {
    return ['StringLiteral', value]
  },
}
const AST_MODE = 'default'
const factory = AST_MODE === 'default' ? DefaultFactory : SExpressionFactory
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
   *  : StatementList
   */
  program() {
    return factory.Program(this.StatementList())
  }

  /**
   * StatementList
   *  : Statement
   *  | Statement StatementList
   * @returns
   */
  StatementList(stopLookahead: string | null = null): any[] {
    const statements = []
    while (this._lookahead !== null && stopLookahead !== this._lookahead.type)
      statements.push(this.Statement())

    return statements
  }

  /**
   * Statement
   *  : ExpressionStatement
   *  | BlockStatement
   *  ;
   */
  Statement() {
    switch (this._lookahead.type) {
      case ';':
        return this.EmptyStatement()
      case '{':
        return this.BlockStatement()
      default:
        return this.ExpressionStatement()
    }
  }

  EmptyStatement(): EmptyStatement {
    this._eat(';')
    return factory.EmptyStatement() as any
  }

  /**
   * BlockStatement
   *  : '{' OptStatementList '}'
   */
  BlockStatement(): BlockStatement {
    this._eat('{')
    // 通过传入"}"提供结束的标记
    const body = this._lookahead.type === '}' ? [] : this.StatementList('}')
    this._eat('}')
    return factory.BlockStatement(body) as any
  }

  /**
   * ExpressionStatement
   * : Expression ';'
   */
  ExpressionStatement(): ExpressionStatement {
    const expression = this.Expression() as any
    this._eat(';')
    return factory.ExpressionStatement(expression) as any
  }

  /**
   * Expression
   * : AdditiveExpression
   */
  Expression() {
    return this.AdditiveExpression()
  }

  /**
   * AdditiveExpression
   * :Literal
   * | MultiplicativeExpression First
   * :AdditiveExpression '+' Literal
   * :AdditiveExpression '-' Literal
   *
   */
  AdditiveExpression() {
    return this._BinaryExpression(
      'MultiplicativeExpression',
      'ADDITIVE_OPERATOR',
    )
  }

  MultiplicativeExpression() {
    return this._BinaryExpression(
      'PrimaryExpression',
      'MULTIPLICATIVE_OPERATOR',
    )
  }

  _BinaryExpression(
    builderName: 'PrimaryExpression' | 'MultiplicativeExpression',
    operatorType: 'ADDITIVE_OPERATOR' | 'MULTIPLICATIVE_OPERATOR',
  ): any {
    let left = this[builderName]()

    while (this._lookahead.type === operatorType) {
      // Operator: + - * /
      const operator = this._eat(operatorType)

      const right = this[builderName]()
      //
      left = {
        type: 'BinaryExpression',
        left,
        operator: operator.value,
        right,
      } as BinaryExpression as any
    }
    return left
  }

  PrimaryExpression() {
    switch (this._lookahead.type) {
      case '(':
        return this.ParenExpression()
      default:
        return this.Literal()
    }
  }

  /**
   * ParenthesizedExpression
   * : '(' Expression ')'
   */
  ParenExpression() {
    this._eat('(')
    const expression = this.Expression() as any
    this._eat(')')
    return expression
  }

  /**
   * Literal
   * : NumericLiteral
   * | StringLiteral
   */
  Literal() {
    if (this._lookahead === null)
      return null

    switch (this._lookahead.type) {
      case 'number':
        return this.NumericLiteral()
      case 'string':
        return this.StringLiteral()
    }
  }

  /**
   * NumericLiteral
   *  : NUMBER
   */
  NumericLiteral(): NumericLiteral {
    const token = this._eat('number')
    return factory.NumericLiteral(Number(token.value)) as any
  }

  StringLiteral(): StringLiteral {
    const token = this._eat('string')
    return factory.StringLiteral(token.value) as any
  }

  private _eat(tokenType: string) {
    const token = this._lookahead
    if (token === null)
      throw new Error(`Unexpected end of input ${tokenType}`)

    if (token.type !== tokenType)
      throw new Error(`Unexpected token ${token.type}, expected ${tokenType}`)

    // Advanced to next token
    this._lookahead = this._tokenizer.getNextToken()
    return token
  }
}

export default Parser
