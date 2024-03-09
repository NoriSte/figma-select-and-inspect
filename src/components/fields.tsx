import { useState } from 'preact/hooks'

import {
  Checkbox,
  Text,
  Textbox,
  Toggle,
  VerticalSpace,
} from '@create-figma-plugin/ui'

import { useOnChange } from '../hooks/useOnChange'

export function EnabledDisabled({ defaultValue, onChange }: { defaultValue: boolean; onChange: (newValue: boolean) => void }) {
  const [value, setValue] = useState(defaultValue)

  useOnChange(value, onChange)

  return (
    <Toggle onValueChange={setValue} value={value}>
      <Text>Enabled</Text>
    </Toggle>
  )
}

export function ExpressionsToEvaluate({ defaultValue, onChange }: { defaultValue: string; onChange: (newValue: string) => void }) {
  const [value, setValue] = useState(defaultValue)

  const flushOnChange = useOnChange(value, onChange, 500)

  return (
    <>
      <Text>Comma separated expressions to evaluate on the selected elements.</Text>
      <VerticalSpace space="small" />
      {/* <SearchTextbox */}
      <Textbox
        value={value}
        variant="border"
        placeholder="id,name,reactions[0].actions[0].type, // etc."
        onValueInput={setValue}
        onKeyDown={event =>
          event.code === 'Enter'
          && flushOnChange()}
      />
    </>
  )
}

export function HideExpressionErrors({ defaultValue, onChange }: { defaultValue: boolean; onChange: (newValue: boolean) => void }) {
  const [value, setValue] = useState(defaultValue)

  useOnChange(value, onChange)

  return (
    <Checkbox onValueChange={setValue} value={value}>
      <Text>Hide errors</Text>
    </Checkbox>
  )
}

export function StringifyEvaluatedExpressions({ defaultValue, onChange }: { defaultValue: boolean; onChange: (newValue: boolean) => void }) {
  const [value, setValue] = useState(defaultValue)

  useOnChange(value, onChange)

  return (
    <Checkbox onValueChange={setValue} value={value}>
      <Text>Stringify non-primitives</Text>
    </Checkbox>
  )
}

export function FormatStringifiedEvaluatedExpressions({ defaultValue, onChange }: { defaultValue: boolean; onChange: (newValue: boolean) => void }) {
  const [value, setValue] = useState(defaultValue)

  useOnChange(value, onChange)

  return (
    <Checkbox onValueChange={setValue} value={value}>
      <Text>Format stringified logs</Text>
    </Checkbox>
  )
}
