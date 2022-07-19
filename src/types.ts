interface BaseComment {
  value: string
  start?: number
  end?: number
  loc?: SourceLocation
  // generator will skip the comment if ignore is true
  ignore?: boolean
  type: 'CommentBlock' | 'CommentLine'
}

export interface CommentBlock extends BaseComment {
  type: 'CommentBlock'
}

export interface CommentLine extends BaseComment {
  type: 'CommentLine'
}

export type Comment = CommentBlock | CommentLine

export interface SourceLocation {
  start: {
    line: number
    column: number
  }

  end: {
    line: number
    column: number
  }
}

export type Node = NumericLiteral

export interface BaseNode {
  type: Node['type']
  leadingComments?: Comment[] | null
  innerComments?: Comment[] | null
  trailingComments?: Comment[] | null
  start?: number | null
  end?: number | null
  loc?: SourceLocation | null
  range?: [number, number]
  extra?: Record<string, unknown>
}

export interface NumericLiteral extends BaseNode {
  type: 'NumericLiteral'
  value: number
}
