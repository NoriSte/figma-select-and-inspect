export function signedLog(...args: unknown[]) {
  console.log(
      `%c Select and Inspect `,
      'background: #FF7AAC; color: #121117; padding: 2px; border-radius: 2px;',
      ...args,
  )
}
export function logExpression(expression: string, ...args: unknown[]) {
  console.log(
      `%c └── ${expression}`,
      'color: #FF7AAC; font-style: italic;',
      ...args,
  )
}
export function logStringifiedExpression(expression: string, ...args: unknown[]) {
  console.log(
      `%c     ${expression}`,
      'color: #FF7AAC; font-style: italic;',
      ...args,
  )
}
export function logExpressionError(expression: string, ...args: unknown[]) {
  console.log(
      `%c └── ${expression} 🚨`,
      'color: #A3120A; font-style: italic;',
      ...args,
  )
}

export function logChange(change: string) {
  signedLog(change)
}
