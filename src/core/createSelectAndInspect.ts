import { logChange } from '../utils/loggers'
import type { CreateFigmaPluginShowUI, FigmaPluginApi, LogOptions, UiEvent } from '../types'

import { createAreReferencesChanged } from '../utils/areReferencesChanged'
import { processCurrentSelection } from './processCurrentSelection'

const uiOptions = { width: 480, height: 260 } as const

interface Params {
  configuration: LogOptions
  defaultConfiguration: LogOptions
  onConfigurationChangeCallback: (configuration: LogOptions) => void

  dependencies: {
    figmaPluginApi: FigmaPluginApi
    createFigmaPluginShowUI: CreateFigmaPluginShowUI<Record<string, unknown>>
  }
}
export function createSelectAndInspect(params: Params) {
  const {
    configuration,
    defaultConfiguration,
    onConfigurationChangeCallback,

    dependencies: {
      figmaPluginApi,
      createFigmaPluginShowUI,
    },
  } = params

  const areReferencesChanged = createAreReferencesChanged()

  const currentConfiguration = { ...configuration }

  function onSelectionChange() {
    if (!currentConfiguration.enabled)
      return

    const selection = figmaPluginApi.currentPage.selection

    // During file edit, the selectionchange event is triggered at every single edit.
    // This avoid logging multiple times during editing.
    if (!areReferencesChanged(selection))
      return

    logChange('Selection changed')
    processCurrentSelection(selection, currentConfiguration)
  }

  function onUiEvent(event: UiEvent) {
    switch (event.type) {
      case 'enabledChanged':
        currentConfiguration.enabled = event.value
        logChange('Enabled changed')
        break

      case 'resetToDefaultUiOptions':
        currentConfiguration.enabled = defaultConfiguration.enabled
        currentConfiguration.expressionsToEvaluate = defaultConfiguration.expressionsToEvaluate
        currentConfiguration.hideExpressionErrors = defaultConfiguration.hideExpressionErrors
        currentConfiguration.stringifyEvaluatedExpressions = defaultConfiguration.stringifyEvaluatedExpressions
        currentConfiguration.formatStringifiedEvaluatedExpressions = defaultConfiguration.formatStringifiedEvaluatedExpressions
        logChange('Reset to defaults')
        break

      case 'expressionsToEvaluateChanged':
        currentConfiguration.expressionsToEvaluate = event.value
        logChange('Expressions to evaluate changed')
        break

      case 'stringifyEvaluatedExpressionsChanged':
        currentConfiguration.stringifyEvaluatedExpressions = event.value
        logChange('Stringify evaluated expressions changed')
        break

      case 'hideExpressionErrorsChanged':
        currentConfiguration.hideExpressionErrors = event.value
        logChange('Hide evaluated expressions errors changed')
        break

      case 'formatStringifiedEvaluatedExpressionsChanged':
        currentConfiguration.formatStringifiedEvaluatedExpressions = event.value
        logChange('Format evaluated expressions changed')
        break
    }

    if (currentConfiguration.enabled)
      onConfigurationChange()

    onConfigurationChangeCallback(currentConfiguration)
  }

  function onConfigurationChange() {
    processCurrentSelection(figmaPluginApi.currentPage.selection, currentConfiguration)
  }

  function start() {
    logChange('Plugin opened')
    createFigmaPluginShowUI(uiOptions, { configuration: currentConfiguration })
    figmaPluginApi.on('selectionchange', onSelectionChange)
    processCurrentSelection(figmaPluginApi.currentPage.selection, currentConfiguration)
  }

  function cleanup() {
    figmaPluginApi.off('selectionchange', onSelectionChange)
  }

  return { start, cleanup, onUiEvent }
}
