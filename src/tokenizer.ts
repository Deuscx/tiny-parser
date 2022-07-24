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

    // Numbers:
    if (!Number.isNaN(Number(string[0]))) {
      let number = ''
      while (!Number.isNaN(Number(string[this.cursor])))
        number += string[this.cursor++]

      return {
        type: 'number',
        value: Number(number),
      }
    }

    // String:
    if (string[0] === '"') {
      let str = ''
      this.cursor++
      while (string[this.cursor] !== '"' && !this.isEOF())
        str += string[this.cursor++]

      // 将结束的双引号加上
      this.cursor++
      return {
        type: 'string',
        value: str,
      }
    }
  }

  isEOF() {
    return this.cursor >= this.string.length
  }
}
