// --------------------------------------------------
// TYPES
// --------------------------------------------------

import { z } from 'zod'

/**
 * A subset of the global figma object type
 */
export interface FigmaPluginApi {
  currentPage: {
    selection: ReadonlyArray<SceneNode>
  }
  on: (type: 'selectionchange', callback: () => void) => void
  off: (type: 'selectionchange', callback: () => void) => void
}

export type CreateFigmaPluginShowUI<Data extends Record<string, unknown>> = (options: ShowUIOptions, data?: Data) => void

export type LogOptions = z.infer<typeof logOptionsSchema>
export const logOptionsSchema = z.object({
  enabled: z.boolean(),
  expressionsToEvaluate: z.string(),
  hideExpressionErrors: z.boolean(),
  stringifyEvaluatedExpressions: z.boolean(),
  formatStringifiedEvaluatedExpressions: z.boolean(),
})

export type UiEvent = z.infer<typeof uiEventSchema>
export const uiEventSchema = z.union([
  z.object({
    type: z.literal('resetToDefaultUiOptions'),
  }),
  z.object({
    type: z.literal('enabledChanged'),
    value: z.boolean(),
  }),
  z.object({
    type: z.literal('expressionsToEvaluateChanged'),
    value: z.string(),
  }),
  z.object({
    type: z.literal('stringifyEvaluatedExpressionsChanged'),
    value: z.boolean(),
  }),
  z.object({
    type: z.literal('formatStringifiedEvaluatedExpressionsChanged'),
    value: z.boolean(),
  }),
  z.object({
    type: z.literal('hideExpressionErrorsChanged'),
    value: z.boolean(),
  }),
])

type ItemsIterationWildcardExpression = `${string}[*]`
type PropertiesIterationWildcardExpression = `${string}[*].${string}`
export type IterationWildcardExpression = ItemsIterationWildcardExpression | PropertiesIterationWildcardExpression

export function isIterationWildcardExpression(expression: unknown): expression is IterationWildcardExpression {
  if (typeof expression !== 'string')
    return false

  if (!expression.includes('[*]'))
    return false

  if (expression.startsWith('[*]'))
    return false

  if (expression.endsWith('[*]'))
    return true

  if (!expression.includes('[*].'))
    return false

  if (expression.endsWith('[*].'))
    return false

  return true
}

export function getIterationWildcardExpressionError(expression: unknown) {
  if (typeof expression !== 'string')
    return 'notAString'

  if (!expression.includes('[*]'))
    return 'notIncludes[*]'

  if (expression.startsWith('[*]'))
    return 'startsWith[*]'

  if (expression.endsWith('[*].'))
    return 'endsWith[*].'

  return 'noError'
}
