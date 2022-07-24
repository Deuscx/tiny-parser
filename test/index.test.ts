import { describe, expect, it } from 'vitest'
import { Parser } from '../src'
describe('should', () => {
  it('test string', () => {
    const parser = new Parser()
    const program = '  100;  '
    expect(parser.parse(program)).toMatchInlineSnapshot(`
      {
        "body": [
          {
            "expression": {
              "type": "NumericLiteral",
              "value": 100,
            },
            "type": "ExpressionStatement",
          },
        ],
        "type": "Program",
      }
    `)
  })

  it('skip comments & whitespace', () => {
    const parser = new Parser()
    const program = `
      //comments
      /* 
      multiline comments
      */
      100;
    `
    expect(parser.parse(program)).toMatchInlineSnapshot(`
      {
        "body": [
          {
            "expression": {
              "type": "NumericLiteral",
              "value": 100,
            },
            "type": "ExpressionStatement",
          },
        ],
        "type": "Program",
      }
    `)
  })

  it('Statement', () => {
    const parser = new Parser()
    const program = `
      100;
      20;
    `
    expect(parser.parse(program)).toMatchInlineSnapshot(`
      {
        "body": [
          {
            "expression": {
              "type": "NumericLiteral",
              "value": 100,
            },
            "type": "ExpressionStatement",
          },
          {
            "expression": {
              "type": "NumericLiteral",
              "value": 20,
            },
            "type": "ExpressionStatement",
          },
        ],
        "type": "Program",
      }
    `)
  })

  it('parse Block Statement', () => {
    const parser = new Parser()
    const program = `
      {
        100;
        "hello";
      }
      {
      }
    `
    expect(parser.parse(program)).toMatchInlineSnapshot(`
      {
        "body": [
          {
            "body": [
              {
                "expression": {
                  "type": "NumericLiteral",
                  "value": 100,
                },
                "type": "ExpressionStatement",
              },
              {
                "expression": {
                  "type": "StringLiteral",
                  "value": "\\"hello\\"",
                },
                "type": "ExpressionStatement",
              },
            ],
            "type": "BlockStatement",
          },
          {
            "body": [],
            "type": "BlockStatement",
          },
        ],
        "type": "Program",
      }
    `)
  })

  it('parse nested Block Statement', () => {
    const parser = new Parser()
    const program = `
      {
        100;
        {
          "hello";
        }
      }
      
    `
    expect(parser.parse(program)).toMatchInlineSnapshot(`
      {
        "body": [
          {
            "body": [
              {
                "expression": {
                  "type": "NumericLiteral",
                  "value": 100,
                },
                "type": "ExpressionStatement",
              },
              {
                "body": [
                  {
                    "expression": {
                      "type": "StringLiteral",
                      "value": "\\"hello\\"",
                    },
                    "type": "ExpressionStatement",
                  },
                ],
                "type": "BlockStatement",
              },
            ],
            "type": "BlockStatement",
          },
        ],
        "type": "Program",
      }
    `)
  })

  it('test BinaryExpression', () => {
    const parser = new Parser()
    const program = '1 + 2  / 4;'
    expect(parser.parse(program)).toMatchInlineSnapshot(`
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
