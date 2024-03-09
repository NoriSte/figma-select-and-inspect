import { emit } from '@create-figma-plugin/utilities'
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

import { type UiEvent, logOptionsSchema } from './types'

import {
  EnabledDisabled,
  ExpressionsToEvaluate,
  FormatStringifiedEvaluatedExpressions,
  HideExpressionErrors,
  StringifyEvaluatedExpressions,
} from './components/fields'

/**
 * The UI entry point rendered by create-figma-plugin
 */
function UI({ configuration }: { configuration: unknown }) {
  const parsedConfiguration = logOptionsSchema.parse(configuration)
  return (
    <>

      <Container space="small">
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
                  defaultValue={parsedConfiguration.enabled}
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
            defaultValue={parsedConfiguration.expressionsToEvaluate}
            onChange={(value) => {
              const event: UiEvent = { type: 'expressionsToEvaluateChanged', value }
              emit('uiEvent', event)
            }}
          />
          <Columns space="extraLarge">
            <HideExpressionErrors
              defaultValue={parsedConfiguration.hideExpressionErrors}
              onChange={(value) => {
                const event: UiEvent = { type: 'hideExpressionErrorsChanged', value }
                emit('uiEvent', event)
              }}
            />
            <StringifyEvaluatedExpressions
              defaultValue={parsedConfiguration.hideExpressionErrors}
              onChange={(value) => {
                const event: UiEvent = { type: 'stringifyEvaluatedExpressionsChanged', value }
                emit('uiEvent', event)
              }}
            />
            <FormatStringifiedEvaluatedExpressions
              defaultValue={parsedConfiguration.hideExpressionErrors}
              onChange={(value) => {
                const event: UiEvent = { type: 'formatStringifiedEvaluatedExpressionsChanged', value }
                emit('uiEvent', event)
              }}
            />
          </Columns>

          <Button onClick={console.log} secondary>Reset to defaults</Button>
          <Text>
            By
            {' '}
            <Link href="https://noriste.dev/?source=figma-select-and-inspect" target="_blank">NoriSte</Link>
          </Text>
        </Stack>
      </Container>
    </>
  )
}
export default render(UI)
