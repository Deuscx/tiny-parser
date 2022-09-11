import { describe, expect, it } from 'vitest'
import { Parser } from '../src'

describe('binary', () => {
  it.only('test BinaryExpression', () => {
    const parser = new Parser()
    const program = '1 + 2 / 4;'
    const ast = parser.parse(program)
    expect(ast).toMatchInlineSnapshot(`
          {
            "body": [
              {
                "expression": {
                  "left": {
                    "type": "NumericLiteral",
                    "value": 1,
                  },
                  "operator": "+",
                  "right": {
                    "left": {
                      "type": "NumericLiteral",
                      "value": 2,
                    },
                    "operator": "/",
                    "right": {
                      "type": "NumericLiteral",
                      "value": 4,
                    },
                    "type": "BinaryExpression",
                  },
                  "type": "BinaryExpression",
                },
                "type": "ExpressionStatement",
              },
            ],
            "type": "Program",
          }
        `)
  })

  it('test with ( ) ParenthesizedExpression', () => {
    const parser = new Parser()
    const program = '(1 + 2 ) / 4;'
    expect(parser.parse(program)).toMatchInlineSnapshot(`
          {
            "body": [
              {
                "expression": {
                  "left": {
                    "left": {
                      "type": "NumericLiteral",
                      "value": 1,
                    },
                    "operator": "+",
                    "right": {
                      "type": "NumericLiteral",
                      "value": 2,
                    },
                    "type": "BinaryExpression",
                  },
                  "operator": "/",
                  "right": {
                    "type": "NumericLiteral",
                    "value": 4,
                  },
                  "type": "BinaryExpression",
                },
                "type": "ExpressionStatement",
              },
            ],
            "type": "Program",
          }
        `)
  })
})
