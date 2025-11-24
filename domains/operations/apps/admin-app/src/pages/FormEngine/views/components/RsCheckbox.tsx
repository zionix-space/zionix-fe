import styled from '@emotion/styled'
import {boolean, define, disabled, event, string} from '@zionix-formEngine/core'
import {useMemo} from 'react'
import type {CheckboxProps} from 'antd'
import {Checkbox} from 'antd'
import {fieldsCategory} from './categories'
import {requiredStyle} from './components/Labeled'

const SCheckbox = styled(Checkbox)`
  &.required label::after {
    ${requiredStyle};
  }
`

const RsCheckbox = (props: CheckboxProps) => {
  const Component = useMemo(
    () => (props.children as string)?.length ? SCheckbox : Checkbox,
    [props.children])
  return <Component {...props}/>
}

export const rsCheckbox = define(RsCheckbox, 'RsCheckbox')
  .name('Checkbox')
  .category(fieldsCategory)
  .props({
    children: string.default('Checkbox'),
    checked: boolean
      .valued.default(true).uncontrolledValue(false),
    disabled: disabled.default(false),
    indeterminate: boolean,
    title: string,
    onChange: event,
  })