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
})
