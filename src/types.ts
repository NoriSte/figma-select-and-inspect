// --------------------------------------------------
// TYPES
// --------------------------------------------------

export interface LogOptions {
  enabled: boolean
  expressionsToEvaluate: string
  hideExpressionErrors: boolean
  altoStringifyEvaluatedExpressions: boolean
}

export interface UiOptions {
  enabled: boolean
  expandedUi: boolean
  expressionsToEvaluate: string
  hideExpressionErrors: boolean
  altoStringifyEvaluatedExpressions: boolean
}

export type UiEvents = {
  type: 'resetToDefaultUiOptions'
} | {
  type: 'enabledChanged'
  value: boolean
}
| {
  type: 'expandedUiChanged'
  value: boolean
}
| {
  type: 'expressionsToEvaluateChanged'
  value: string
}
| {
  type: 'altoStringifyEvaluatedExpressionsChanged'
  value: string
}
| {
  type: 'hideExpressionErrorsChanged'
  value: boolean
}
