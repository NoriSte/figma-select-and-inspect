import { emit, loadSettingsAsync, on, saveSettingsAsync, showUI } from '@create-figma-plugin/utilities'
import { logExpression, logExpressionError, signedLog } from './utils/loggers'
import { createSelectAndInspect } from './core/createSelectAndInspect'
import { type LogOptions, uiEventSchema } from './types'

const defaultConfiguration: LogOptions = {
  enabled: true,
  expressionsToEvaluate: '',
  hideExpressionErrors: false,
  stringifyEvaluatedExpressions: false,
  formatStringifiedEvaluatedExpressions: false,
}

const settingsKey = 'selectAndInspectConfiguration'

export default function main() {
  signedLog('Load configuration')

  loadSettingsAsync(defaultConfiguration, settingsKey).then((configuration) => {
    logExpression('Configuration loaded')

    // console.log(configuration)
    const selectAndInspect = createSelectAndInspect({
      configuration: {
        ...configuration,
        // I take for granted that if the users re-opened the plugin, tey immediately want to see the logs
        enabled: true,
      },
      defaultConfiguration,

      onConfigurationChangeCallback: (configuration) => {
        // console.log('saveSettingsAsync')
        saveSettingsAsync(configuration, settingsKey).then(() => {
          // console.log('done')
        }).catch((_error) => {
          // console.log('error', _error)
        })
      },

      dependencies: {
        figmaPluginApi: figma,
        createFigmaPluginEmit: emit,
        createFigmaPluginShowUI: showUI,
      },
    })

    selectAndInspect.start()

    on('uiEvent', (event: unknown) => {
      const uiEvent = uiEventSchema.parse(event)
      selectAndInspect.onUiEvent(uiEvent)
    })
  }).catch((error) => {
    logExpressionError('Configuration error', error)
  })
}
