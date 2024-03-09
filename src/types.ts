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
