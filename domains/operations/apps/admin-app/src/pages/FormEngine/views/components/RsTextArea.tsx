import {define, disabled, event, string} from '@zionix-formEngine/core'
import {Input} from 'antd'
import type {TextAreaProps} from 'antd/es/input'
import {positiveNumber, readOnly, size} from '../commonProperties'
import {mapSize} from '../propAdapters'
import {fieldsCategory} from './categories'
import {Labeled} from './components/Labeled'

/**
 * Props for the RsTextArea component.
 * Migrated from RSuite to Ant Design.
 */
export interface RsTextAreaProps extends Omit<TextAreaProps, 'size'> {
  /**
   * The label for the text area.
   */
  label: string
  /**
   * The number of visible text lines.
   */
  rows: number
  /**
   * RSuite size prop.
   */
  size?: 'xs' | 'sm' | 'md' | 'lg'
  /**
   * The htmlSize attribute defines the width of the input element.
   */
  htmlSize?: number
}

/**
 * A text area component for multi-line text input.
 * Migrated from RSuite Input as="textarea" to Ant Design Input.TextArea.
 */
const RsTextArea = ({style, className, label, size: rsSize, ...props}: RsTextAreaProps) => {
  const antdSize = mapSize(rsSize)
  
  return (
    <Labeled label={label} style={style} className={className} passAriaToChildren={true}>
      <Input.TextArea {...props} size={antdSize}/>
    </Labeled>
  )
}

export const rsTextArea = define(RsTextArea, 'RsTextArea')
  .name('Text area')
  .category(fieldsCategory)
  .props({
    label: string.default('Text area'),
    value: string.default('').valued,
    placeholder: string,
    rows: positiveNumber.default(5),
    size,
    disabled: disabled.default(false),
    readOnly,
    onChange: event,
    // onPressEnter removed - use onPressEnter on Input.TextArea directly if needed
  })
