import styled from '@emotion/styled'
import {boolean, define, disabled, event, oneOf, string} from '@zionix-formEngine/core'
import {Switch} from 'antd'
import {controlColor, readOnly} from '../commonProperties'
import {mapSize} from '../propAdapters'
import {fieldsCategory} from './categories'
import {requiredStyle} from './components/Labeled'

// Migrated from RSuite Toggle to Ant Design Switch
const SSwitch = styled(Switch)`
  &.required .ant-switch-inner::after {
    ${requiredStyle};
  }
`

const RsToggle = (props: any) => {
  const {size, ...rest} = props
  // Map RSuite size to Ant Design size: lg/md → default, sm → small
  const antdSize = size === 'sm' ? 'small' : 'default'
  
  return <SSwitch {...rest} size={antdSize} />
}

export const rsToggle = define(RsToggle, 'RsToggle')
  .name('Toggle')
  .category(fieldsCategory)
  .props({
    children: string,
    checked: boolean.valued.default(true).uncontrolledValue(false),
    checkedChildren: string,
    unCheckedChildren: string,
    disabled: disabled.default(false),
    readOnly,
    size: oneOf('sm', 'md', 'lg')
      .labeled('Small', 'Medium', 'Large')
      .default('md')
      .withEditorProps({creatable: false}),
    // color removed - Ant Design Switch doesn't support color prop
    loading: boolean.default(false),
    onChange: event,
  })
