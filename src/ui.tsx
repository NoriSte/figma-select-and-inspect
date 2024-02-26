import { useCallback, useEffect, useRef, useState } from 'preact/hooks'
import { copyToClipboard } from 'figx'

import type {
  EventHandler,
} from '@create-figma-plugin/ui'
import {
  Banner,
  Button,
  Checkbox,
  Code,
  Container,
  IconWarning32,
  SearchTextbox,
  Stack,
  Text,
  Toggle,
  render,
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import type { JSX } from 'preact/jsx-runtime'
import type { UiOptions } from './types'

/**
 * The UI entry point rendered by create-figma-plugin
 */
function UI({ uiOptions }: { uiOptions: UiOptions }) {
  return (
    <Container space="medium">
      <EnabledDisabled
        defaultValue={uiOptions.enabled}
        onChange={value =>
          emit('enabledChanged', value)}
      />
      <ExpressionsToEvaluate
        defaultValue={uiOptions.expressionsToEvaluate}
        onChange={value =>
          emit('expressionsToEvaluateChanged', value)}
      />

    </Container>
  )
}

function EnabledDisabled({ defaultValue, onChange }: { defaultValue: boolean; onChange: (newValue: boolean) => void }) {
  const [value, setValue] = useState(defaultValue)
  function handleChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    setValue(event.currentTarget.checked)
    onChange(event.currentTarget.checked)
  }
  return (
    <Toggle onChange={handleChange} value={value}>
      <Text>Enabled</Text>
    </Toggle>
  )
}

function ExpressionsToEvaluate({ defaultValue, onChange }: { defaultValue: string; onChange: (newValue: string) => void }) {
  const [value, setValue] = useState(defaultValue)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(-1)
  function handleValueInput(newValue: string) {
    setValue(newValue)
  }
  const onKeyDown = useCallback((event: EventHandler.onKeyDown<HTMLInputElement>) => {
    // @ts-expect-error TODO:
    if (event?.code !== 'Enter')
      return
    // TODO: Missing ref to get current value
    if (timeoutRef.current !== -1) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = -1
    }
    onChange(value)
  }, [])
  useEffect(() => {
    timeoutRef.current = setTimeout(() => onChange(value), 300)
    return () => {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = -1
    }
  }, [value])
  return (
    <>
      <Text>Comma separated</Text>
      <SearchTextbox onValueInput={handleValueInput} value={value} onKeyDown={onKeyDown} />

    </>
  )
}

export default render(UI)
