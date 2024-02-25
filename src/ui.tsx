import { useEffect } from 'preact/hooks'
import { copyToClipboard } from 'figx'

import {
  Banner,
  Button,
  Code,
  Container,
  IconWarning32,
  Stack,
  Text,
  render,
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'

/**
 * The UI entry point rendered by create-figma-plugin
 */
function UI({ generatedXStateConfig }: { generatedXStateConfig: unknown }) {
  return (
    <Container space="medium">
      Hello
    </Container>
  )
}

export default render(UI)
