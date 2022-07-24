import { describe, expect, it } from 'vitest'
import { Parser } from '../src'
describe('should', () => {
  it('exported', () => {
    const parser = new Parser()
    const program = '""100""'
    expect(parser.parse(program)).toMatchInlineSnapshot(`
      {
        "body": {
          "type": "StringLiteral",
          "value": "",
        },
        "type": "Program",
      }
    `)
  })
})
