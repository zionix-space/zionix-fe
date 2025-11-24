import {boolean, define, disabled, event, oneOf, string, useBuilderValue} from '@zionix-formEngine/core'
import type {ButtonProps} from 'antd'
import {Button} from 'antd'
import {controlColor, size} from '../commonProperties'
import {staticCategory} from './categories'

const defaultContent = 'Button'

const RsButton = ({children, ...props}: ButtonProps) => {
  const content = useBuilderValue(children, defaultContent)
  return <Button {...props}>{content}</Button>
}

export const rsButton = define(RsButton, 'RsButton')
  .name('Button')
  .category(staticCategory)
  .props({
    type: oneOf('default', 'primary', 'link', 'text', 'dashed')
      .default('default')
      .withEditorProps({creatable: false}),
    children: string.required.default(defaultContent).dataBound,
    color: controlColor,
    disabled: disabled.default(false),
    href: string,
    loading: boolean.default(false),
    size,
    onClick: event,
  })
