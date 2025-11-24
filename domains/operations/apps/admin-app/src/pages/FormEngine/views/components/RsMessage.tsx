import styled from '@emotion/styled'
import {boolean, define, node, oneOf, string} from '@zionix-formEngine/core'
import {Alert} from 'antd'
import {staticCategory} from './categories'

// Migrated from RSuite Message to Ant Design Alert
// Props are mostly compatible (type, closable, showIcon)
const SAlert = styled(Alert)`
  .ant-alert-message {
    overflow: initial;
  }
`

export const rsMessage = define(SAlert, 'RsMessage')
  .name('Message')
  .category(staticCategory)
  .props({
    message: node,
    description: string,
    closable: boolean.default(false),
    showIcon: boolean.default(false),
    type: oneOf('info', 'success', 'warning', 'error').default('info')
      .withEditorProps({creatable: false})
  })
