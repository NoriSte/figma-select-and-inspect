import { logExpression, logExpressionError, logStringifiedExpression } from '../utils/loggers'
import { stringifiedValueIsTheSame, stringifyError } from '../utils/generic'
import type { LogOptions } from '../types'

export function processCurrentSelection(selection: ReadonlyArray<SceneNode>, configuration: LogOptions) {
  processItems(
    selection,
    configuration,
  )
}

function processItems(items: readonly unknown[], logOptions: LogOptions) {
  for (const item of items) {
    processItem(
      item,
      logOptions,
    )
  }
}

function evaluateExpression(item: unknown, expression: string) {
  // eslint-disable-next-line no-new-func
  return new Function('obj', `return obj.${expression}`)(item)
}

function processItem(item: unknown, logOptions: LogOptions) {
  console.log(item)

  const expressions = logOptions.expressionsToEvaluate.split(',')

  for (const expression of expressions) {
    const trimmedExpression = expression.trim()
    if (expression === '')
      continue
    processExpression(item, trimmedExpression, logOptions)
  }
}

function processExpression(
  item: unknown,
  expression: string,
  logOptions: LogOptions,
) {
  const { stringifyEvaluatedExpressions, hideExpressionErrors, formatStringifiedEvaluatedExpressions } = logOptions
  let value
  let stringifiedValue = ''
  let errored = false

  try {
    if (expression.includes('[*]') && !expression.startsWith('[*]')) {
      processWildCardExpression(item, expression, logOptions)
      return
    }

    value = evaluateExpression(item, expression)

    logExpression(expression, value)
  }
  catch (e) {
    errored = true
    if (!hideExpressionErrors)
      logExpressionError(expression, stringifyError(e))
  }

  if (stringifyEvaluatedExpressions && !errored && !stringifiedValueIsTheSame(value)) {
    try {
      stringifiedValue = formatStringifiedEvaluatedExpressions ? JSON.stringify(value, null, 2) : JSON.stringify(value)
      logStringifiedExpression(`(stringified):`, stringifiedValue)
    }
    catch (e) {
      logExpressionError(`${expression} (stringified):`, stringifyError(e))
    }
  }
}

// TODO: strong type literals + check recursivity (reactions[*].actions[*]) + give meaningful errors to the user

function processWildCardExpression(
  item: unknown,
  expression: string,
  logOptions: LogOptions,
) {
  const parts = expression.split('[*]')
  const arrayExpression = parts[0]
  const propertyExpression = parts[1]

  console.log({ arrayExpression, propertyExpression })

  if (!arrayExpression)
    throw new Error('Array expression is missing (this is a TS-only protection)')

  const array = evaluateExpression(item, arrayExpression)
  if (!Array.isArray(array)) {
    logExpressionError(expression, `The expression ${arrayExpression} does not evaluate to an array`)
    return
  }

  for (const arrayItem of array) {
    if (propertyExpression)
      processExpression(arrayItem, propertyExpression, logOptions)
    else
      processItem(arrayItem, logOptions)
  }
}
