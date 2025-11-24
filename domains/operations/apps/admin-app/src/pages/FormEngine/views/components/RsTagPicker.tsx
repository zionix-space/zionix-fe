import type {LabeledValue} from '@zionix-formEngine/core'
import {array, define, toLabeledValues} from '@zionix-formEngine/core'
import {useMemo} from 'react'
import {Select} from 'antd'
import type {SelectProps} from 'antd'
import {pickerProps} from '../commonProperties'
import {mapPlacement, mapSize, mapCleanable} from '../propAdapters'
import {fieldsCategory} from './categories'
import {Labeled} from './components/Labeled'
import {useTouchOnEvent} from './hooks/useTouchOnEvent'

/**
 * Props for the RsTagPicker component.
 * Migrated from RSuite to Ant Design.
 */
export interface RsTagPickerProps extends Omit<SelectProps, 'mode' | 'options' | 'size' | 'placement'> {
  /**
   * Label for the tag picker.
   */
  label: string
  /**
   * RSuite data prop (maps to Ant Design options).
   */
  data?: Array<string | LabeledValue>
  /**
   * RSuite size prop.
   */
  size?: 'xs' | 'sm' | 'md' | 'lg'
  /**
   * RSuite placement prop.
   */
  placement?: string
  /**
   * RSuite cleanable prop (maps to allowClear).
   */
  cleanable?: boolean
  /**
   * RSuite onClean event (maps to onClear).
   */
  onClean?: () => void
  /**
   * Called after the value has been changed.
   * @param value the value.
   */
  onChange?: (value: any) => void
}

const fixEmptyItem = ({value, label}: LabeledValue) => ({
  value: value ?? '',
  label: label ?? ''
})

const EMPTY_LIST = [] as const

/**
 * Tag picker component with label support.
 * Migrated from RSuite TagPicker to Ant Design Select with mode="multiple".
 * 
 * Key differences:
 * - RSuite TagPicker → Ant Design Select with mode="multiple"
 * - data → options (prop name change)
 * - cleanable → allowClear
 * - ARIA handling is built into Ant Design
 * 
 * @param props the component props.
 * @param props.data the data for the tag picker.
 * @param props.label the label for the tag picker.
 * @param props.value the value of the tag picker.
 * @param props.className the CSS class name.
 * @param props.size the RSuite size.
 * @param props.placement the RSuite placement.
 * @param props.cleanable whether to show clear button.
 * @param props.onClean the clear event handler.
 * @param props.props the additional tag picker props.
 * @returns the React element.
 */
const RsTagPicker = ({
  data,
  label,
  value,
  className,
  size: rsSize,
  placement: rsPlacement,
  cleanable,
  onClean,
  ...props
}: RsTagPickerProps) => {
  const onClear = useTouchOnEvent(props, 'onClear')

  const transformedData = useMemo(() => {
    return toLabeledValues((data ?? []) as Array<string | LabeledValue>).map(fixEmptyItem)
  }, [data])

  // Map RSuite props to Ant Design props
  const antdSize = mapSize(rsSize)
  const antdPlacement = mapPlacement(rsPlacement) as 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  const allowClear = mapCleanable(cleanable)

  return (
    <Labeled label={label} className={className} passAriaToChildren={true}>
      <Select
        mode="multiple"
        value={value ?? EMPTY_LIST}
        options={transformedData}
        size={antdSize}
        placement={antdPlacement}
        allowClear={allowClear}
        onClear={onClean || onClear}
        {...props}
      />
    </Labeled>
  )
}

const {disableVirtualized, onLoadData, ...tagPickerProps} = pickerProps

export const rsTagPicker = define(RsTagPicker, 'RsTagPicker')
  .name('TagPicker')
  .category(fieldsCategory)
  .props({
    ...tagPickerProps,
    value: array.valued.ofString,
    label: pickerProps.label.default('Select'),
    data: array.default(toLabeledValues(['a', 'b', 'c']))
  })
