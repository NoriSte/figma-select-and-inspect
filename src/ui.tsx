import { emit, on } from '@create-figma-plugin/utilities'
import {
  Button,
  Columns,
  Container,
  Divider,
  Link,
  MiddleAlign,
  Stack,
  Text,
  VerticalSpace,
  render,
} from '@create-figma-plugin/ui'

import { useReducer, useRef } from 'preact/hooks'
import { type UiEvent, logOptionsSchema, serverEventSchema } from './types'

import {
  EnabledDisabled,
  ExecuteFunctionsAndAwaitPromises,
  ExpressionsToEvaluate,
  FormatStringifiedEvaluatedExpressions,
  HideExpressionErrors,
  StringifyEvaluatedExpressions,
} from './components/fields'

/**
 * The UI entry point rendered by create-figma-plugin
 */
function UI({ configuration }: { configuration: unknown }) {
  const [renderKey, forceRender] = useReducer(s => s + 1, 0)

  const configurationRef = useRef(logOptionsSchema.parse(configuration))

  on('serverEvent', (event: unknown) => {
    const uiEvent = serverEventSchema.parse(event)
    configurationRef.current = uiEvent.value
    forceRender({})
  })

  return (

    <Container space="small" key={renderKey}>
      <VerticalSpace space="medium" />
      <Stack space="medium">
        <Columns space="extraLarge">
          <div>
            <Text>
              Please open the devtools' console
              <br />
              <i>
                (Plugins
                {' '}
                {'>'}
                {' '}
                Development
                {' '}
                {'>'}
                {' '}
                Show/Hide console)
              </i>
            </Text>
          </div>
          <div>
            <MiddleAlign>
              <EnabledDisabled
                defaultValue={configurationRef.current.enabled}
                onChange={(value) => {
                  const event: UiEvent = { type: 'enabledChanged', value }
                  emit('uiEvent', event)
                }}
              />

            </MiddleAlign>
          </div>
        </Columns>
        <Divider />
        <Text><b>Evaluated expressions</b></Text>
        <ExpressionsToEvaluate
          defaultValue={configurationRef.current.expressionsToEvaluate}
          onChange={(value) => {
            const event: UiEvent = { type: 'expressionsToEvaluateChanged', value }
            emit('uiEvent', event)
          }}
        />
        <Columns space="extraLarge">
          <HideExpressionErrors
            defaultValue={configurationRef.current.hideExpressionErrors}
            onChange={(value) => {
              const event: UiEvent = { type: 'hideExpressionErrorsChanged', value }
              emit('uiEvent', event)
            }}
          />
          <StringifyEvaluatedExpressions
            defaultValue={configurationRef.current.stringifyEvaluatedExpressions}
            onChange={(value) => {
              const event: UiEvent = { type: 'stringifyEvaluatedExpressionsChanged', value }
              emit('uiEvent', event)
            }}
          />
        </Columns>
        <Columns space="extraLarge">
          <FormatStringifiedEvaluatedExpressions
            defaultValue={configurationRef.current.formatStringifiedEvaluatedExpressions}
            onChange={(value) => {
              const event: UiEvent = { type: 'formatStringifiedEvaluatedExpressionsChanged', value }
              emit('uiEvent', event)
            }}
          />
          <ExecuteFunctionsAndAwaitPromises
            defaultValue={configurationRef.current.executeFunctionsAndAwaitPromises}
            onChange={(value) => {
              const event: UiEvent = { type: 'executeFunctionsAndAwaitPromisesChanged', value }
              emit('uiEvent', event)
            }}
          />
        </Columns>

        <Button
          onClick={() => {
            const event: UiEvent = { type: 'resetToDefaultLogOptions' }
            emit('uiEvent', event)
          }}

          secondary
        >
          Reset to defaults
        </Button>
        <Text>
          By
          {' '}
          <Link href="https://noriste.dev/?source=figma-select-and-inspect" target="_blank">NoriSte</Link>
        </Text>
      </Stack>
    </Container>

  )
}
export default render(UI)
