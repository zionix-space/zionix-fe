import type {LabeledValue} from '@zionix-formEngine/core'
import {array, boolean, define, disabled, event, oneOf, string, toLabeledValues} from '@zionix-formEngine/core'
import {Radio} from 'antd'
import type {RadioGroupProps} from 'antd'
import {fieldsCategory} from './categories'
import {Labeled} from './components/Labeled'

/**
 * Props for the RsRadioGroup component.
 * Migrated from RSuite to Ant Design.
 */
export interface RsRadioGroupProps extends Omit<RadioGroupProps, 'options' | 'onChange'> {
  /**
   * The items for the radio group.
   */
  items: LabeledValue[]
  /**
   * The label for the radio group.
   */
  label?: string
  /**
   * RSuite appearance prop (maps to optionType).
   */
  appearance?: 'default' | 'picker'
  /**
   * RSuite inline prop.
   */
  inline?: boolean
  /**
   * Called after the value has been changed.
   * @param value the value.
   */
  onChange?: (value: string) => void
}

/**
 * Radio group component with label support.
 * Migrated from RSuite RadioGroup to Ant Design Radio.Group.
 * 
 * Key differences:
 * - appearance → optionType (default→default, picker→button)
 * - inline handled with CSS className
 */
const RsRadioGroup = ({items, label, value, className, appearance = 'default', inline, onChange, ...props}: RsRadioGroupProps) => {
  const optionType = appearance === 'picker' ? 'button' : 'default'
  const groupClassName = inline ? `${className || ''} radio-group-inline` : className
  
  const handleChange = (e: any) => {
    onChange?.(e.target.value)
  }
  
  return (
    <Labeled label={label} className={groupClassName} passAriaToChildren={true}>
      <Radio.Group {...props} value={value ?? ''} optionType={optionType} onChange={handleChange}>
        {items.map(({value, label}, i) => (
          <Radio value={value} key={i}>{label ?? value}</Radio>
        ))}
      </Radio.Group>
    </Labeled>
  )
}

export const rsRadioGroup = define(RsRadioGroup, 'RsRadioGroup')
  .name('Radio group')
  .category(fieldsCategory)
  .props({
    name: string.default('RadioGroup'),
    appearance: oneOf('default', 'picker').labeled('Default', 'Picker').default('default')
      .withEditorProps({creatable: false}),
    label: string.default('Radio'),
    disabled: disabled.default(false),
    // readOnly removed - not supported in Ant Design Radio.Group
    inline: boolean.default(false),
    onChange: event,
    items: array.default(toLabeledValues(['a', 'b', 'c'])),
    value: string.valued
  })
