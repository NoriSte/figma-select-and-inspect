import { optional } from 'zod'
import { logExpression, logExpressionError, logStringifiedExpression } from '../utils/loggers'
import { isPromise, stringifiedValueIsTheSame, stringifyError } from '../utils/generic'
import type { LogOptions } from '../types'

export async function processCurrentSelection(selection: ReadonlyArray<SceneNode>, configuration: LogOptions) {
  await processItems(
    selection,
    configuration,
  )
}

async function processItems(items: readonly unknown[], logOptions: LogOptions) {
  for (const item of items) {
    await processItem(
      item,
      logOptions,
    )
  }
}

function evaluateExpression(item: unknown, expression: string, options: { invokeFunctions: boolean }) {
  const { invokeFunctions } = options
  // eslint-disable-next-line no-new-func
  return new Function('obj', `
  function evaluator(obj) {
    let value = obj.${expression}

    if(typeof value === 'function' && ${invokeFunctions}) {
      return obj.${expression}()
    }

    return value
  }

  return evaluator(obj)
`)(item)
}

async function processItem(item: unknown, logOptions: LogOptions) {
  console.log(item)

  const expressions = logOptions.expressionsToEvaluate.split(',')

  for (const expression of expressions) {
    const trimmedExpression = expression.trim()
    if (expression === '')
      continue
    await processExpression(item, trimmedExpression, logOptions)
  }
}

async function processExpression(
  item: unknown,
  expression: string,
  logOptions: LogOptions,
) {
  const { stringifyEvaluatedExpressions, hideExpressionErrors, formatStringifiedEvaluatedExpressions, executeFunctionsAndAwaitPromises } = logOptions
  let value
  let stringifiedValue = ''
  let errored = false

  try {
    value = evaluateExpression(item, expression, { invokeFunctions: executeFunctionsAndAwaitPromises })
    if (executeFunctionsAndAwaitPromises) {
      if (isPromise(value)) {
        const resolvedValue = await value
        logExpression(expression, resolvedValue)
      }
      else {
        logExpression(expression, value)
      }
    }
    else {
      logExpression(expression, value)
    }
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
