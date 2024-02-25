import { on, showUI } from '@create-figma-plugin/utilities'

const uiOptions = { width: 480, height: 240 } as const

// TODO:
// - log on selection change
// - log on ui change
// - log on open
// - enable/disable

function logElements({
  logHint,
  elements,
  alsoStringify,
  expressionsToEvaluate,
}: {
  elements: unknown[]
  logHint: boolean
  alsoStringify: boolean
  expressionsToEvaluate: string
}) {
  for (const element of elements) {
    logElement({
      logHint,
      element,
      alsoStringify,
      expressionsToEvaluate,
    })
  }
}

// @ts-expect-error TODO:
function evaluateStringOnObject(obj, str) {
  // eslint-disable-next-line no-new-func
  return new Function('obj', `return obj.${str}`)(obj)
}

function logElement({
  // logHint,
  element,
  alsoStringify,
  expressionsToEvaluate,
}: {
  element: unknown
  logHint: boolean
  alsoStringify: boolean
  expressionsToEvaluate: string
}) {
  const expressions = expressionsToEvaluate.split(',')

  for (const expression of expressions) {
    let value
    let stringifiedValue = ''

    try {
      value = evaluateStringOnObject(element, expression)
      if (alsoStringify)
        stringifiedValue = JSON.stringify(value)

        logExpression(expression, value)
      if (stringifiedValue)
        logExpression(`${expression}(stringified):`, stringifiedValue)
    }
    catch (e) {
      logExpressionError(expression, e instanceof Error ? e.message : `${e}`)
    }

  }
}

function logCurrentSelection() {
  logElements({
    logHint: false,
    alsoStringify: true,
    // @ts-expect-error TODO:
    elements: figma.currentPage.selection,
    expressionsToEvaluate: 'id,name,reactions,reactionssss[0],reactions[0]',
  })
}

function createSelectAndInspect() {
  function onSelectionChange() {
    signedLog('Selection changed')
    logCurrentSelection()
  }

  function start() {
    signedLog('Plugin opened')
    showUI(uiOptions, { generatedXStateConfig: undefined })
    figma.on('selectionchange', onSelectionChange)
    logCurrentSelection()
  }
  function cleanup() {
    figma.off('selectionchange', onSelectionChange)
  }

  return {
    start,
    cleanup,
  }
}

export default function main() {
  const selectAndInspect = createSelectAndInspect()
  selectAndInspect.start()

  // UI EVENTS
  // on('REGENERATE', selectAndInspect.log)
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
      `%c ${expression}`,
      'color: #FF7AAC; font-style: italic;',
      ...args,
  )
}
function logExpressionError(expression: string, error: unknown) {
  console.log(
      `%c ${expression}`,
      'color: #FF7AAC; font-style: italic;',
      `%c ${error}`,
      'color: #a3120a;',
  )
}
