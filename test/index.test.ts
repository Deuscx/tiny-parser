import { describe, expect, it } from 'vitest'
import { Parser } from '../src'
describe('should', () => {
  it('exported', () => {
    const parser = new Parser()
    const program = '42'
    expect(parser.parse(program)).toMatchInlineSnapshot(`
      {
        "type": "NumericLiteral",
        "value": 42,
      }
    `)
  })
})
