import { on, showUI } from '@create-figma-plugin/utilities'
import type { LogOptions, UiOptions } from './types'

const uiOptions = { width: 480, height: 240 } as const

// TODO:
// - log on selection change
// - log on ui change
// - log on open
// - enable/disable
// - relog current selection
// - show diff?
// - store config

const defaultUiOptions: UiOptions = {
  enabled: true,
  expandedUi: true,
  expressionsToEvaluate: '',
  hideExpressionErrors: false,
  altoStringifyEvaluatedExpressions: false,
  formatStringifiedEvaluatedExpressions: false,
}
const defaultConfiguration: LogOptions = {
  enabled: true,
  expressionsToEvaluate: '',
  hideExpressionErrors: false,
  altoStringifyEvaluatedExpressions: false,
  formatStringifiedEvaluatedExpressions: false,
}
const currentConfiguration: LogOptions = {
  ...defaultConfiguration,
}

function processItems(items: readonly unknown[], logOptions: LogOptions) {
  for (const item of items) {
    processItem(
      item,
      logOptions,
    )
  }
}

// @ts-expect-error TODO:
function evaluateStringOnObject(obj, str) {
  // eslint-disable-next-line no-new-func
  return new Function('obj', `return obj.${str}`)(obj)
}

function processItem(item: unknown, logOptions: LogOptions) {
  console.log(item)

  const expressions = logOptions.expressionsToEvaluate.split(',')

  for (const expression of expressions)
    {
      const trimmedExpression = expression.trim()
      if(expression === '') continue
      processExpression(item, trimmedExpression, logOptions)}
}

function processExpression(
  item: unknown,
  expression: string,
  logOptions: LogOptions,
) {
  const { altoStringifyEvaluatedExpressions, hideExpressionErrors, formatStringifiedEvaluatedExpressions } = logOptions
  let value
  let stringifiedValue = ''
  let errored = false

  try {
    value = evaluateStringOnObject(item, expression)
    logExpression(expression, value)
  }
  catch (e) {
    errored = true
    if (!hideExpressionErrors)
      logExpressionError(expression, stringifyError(e))
  }

  if (altoStringifyEvaluatedExpressions && !errored) {
    try {
      stringifiedValue = formatStringifiedEvaluatedExpressions ? JSON.stringify(value, null, 2) : JSON.stringify(value)
      logExpression(`${expression} (stringified):`, stringifiedValue)
    }
    catch (e) {
      logExpressionError(`${expression} (stringified):`, stringifyError(e))
    }
  }
}

function processCurrentSelection() {
  processItems(
    figma.currentPage.selection,
    currentConfiguration,
  )
}

function createSelectAndInspect() {
  function onSelectionChange() {
    if (!currentConfiguration.enabled)
      return
    signedLog('Selection changed')
    processCurrentSelection()
  }

  function onConfigurationChange() {
    signedLog('Configuration changed')
    processCurrentSelection()
  }

  function start() {
    signedLog('Plugin opened')
    showUI(uiOptions, { uiOptions: defaultUiOptions })
    figma.on('selectionchange', onSelectionChange)
    processCurrentSelection()
  }

  function cleanup() {
    figma.off('selectionchange', onSelectionChange)
  }

  return {
    start,
    cleanup,
    onConfigurationChange,
  }
}

export default function main() {
  const selectAndInspect = createSelectAndInspect()
  selectAndInspect.start()

  // UI EVENTS
  on('enabledChanged', (value: boolean) => {
    currentConfiguration.enabled = value
    if (currentConfiguration.enabled)
      selectAndInspect.onConfigurationChange()
  })
  on('resetToDefaultUiOptions', () => {
    currentConfiguration.enabled = defaultConfiguration.enabled
    currentConfiguration.expressionsToEvaluate = defaultConfiguration.expressionsToEvaluate
    currentConfiguration.hideExpressionErrors = defaultConfiguration.hideExpressionErrors
    currentConfiguration.altoStringifyEvaluatedExpressions = defaultConfiguration.altoStringifyEvaluatedExpressions
    selectAndInspect.onConfigurationChange()
  })
  on('expressionsToEvaluateChanged', (value: string) => {
    currentConfiguration.expressionsToEvaluate = value
    selectAndInspect.onConfigurationChange()
  })
  on('altoStringifyEvaluatedExpressionsChanged', (value: boolean) => {
    currentConfiguration.altoStringifyEvaluatedExpressions = value
    selectAndInspect.onConfigurationChange()
  })
  on('hideExpressionErrorsChanged', (value: boolean) => {
    currentConfiguration.hideExpressionErrors = value
    selectAndInspect.onConfigurationChange()
  })
  on('formatStringifiedEvaluatedExpressionsChanged', (value: boolean) => {
    currentConfiguration.formatStringifiedEvaluatedExpressions = value
    selectAndInspect.onConfigurationChange()
  })
}

function signedLog(...args: unknown[]) {
  console.log(
      `%c Select and Inspect `,
      'background: #FF7AAC; color: #121117; padding: 2px; border-radius: 2px;',
      ...args,
  )
}
function logExpression(expression: string, ...args: unknown[]) {
  console.log(
      `%c └──${expression}`,
      'color: #FF7AAC; font-style: italic;',
      ...args,
  )
}
function logExpressionError(expression: string, ...args: unknown[]) {
  console.log(
      `%c └──${expression} 🚨`,
      'color: #A3120A; font-style: italic;',
      ...args,
  )
}

function stringifyError(error: unknown) {
  return error instanceof Error ? error.message : `${error}`
}
