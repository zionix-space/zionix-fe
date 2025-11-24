import {boolean, date, define, disabled, event, number, oneOf, string, useComponentData} from '@zionix-formEngine/core'
import {useEffect, useMemo, useState} from 'react'
import {DatePicker} from 'antd'
import type {DatePickerProps} from 'antd'
import dayjs from 'dayjs'
import type {Dayjs} from 'dayjs'
import {placement, readOnly, size} from '../commonProperties'
import {formatValidator, toSafeFormat} from '../dateTimeUtils'
import {mapPlacement, mapSize, mapCleanable, convertDateFormat} from '../propAdapters'
import {fieldsCategory} from './categories'
import {Labeled} from './components/Labeled'
import {useTouchOnEvent} from './hooks/useTouchOnEvent'

/**
 * Props for the RsDatePicker component.
 * Migrated from RSuite to Ant Design.
 */
export interface RsDatePickerProps extends Omit<DatePickerProps, 'size' | 'placement' | 'onChange'> {
  /**
   * Label for the date picker.
   */
  label: string
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
   * RSuite oneTap prop (auto-close on selection).
   */
  oneTap?: boolean
  /**
   * RSuite showMeridiem prop (maps to use12Hours).
   */
  showMeridiem?: boolean
  /**
   * RSuite appearance prop (not used in Ant Design).
   */
  appearance?: 'default' | 'subtle'
  /**
   * Called after the value has been changed.
   * @param value the value.
   */
  onChange?: (value: Date | null) => void
  /**
   * @deprecated
   */
  inline?: boolean
}

/**
 * Returns the date converted to dayjs format.
 * @param value the date value in string, Date, or Dayjs format.
 * @returns the date converted to Dayjs format.
 */
const parseDateValue = (value: any): Dayjs | null => {
  if (!value) return null
  
  if (dayjs.isDayjs(value)) return value
  
  if (typeof value === 'string') {
    const parsed = dayjs(value)
    if (parsed.isValid()) {
      return parsed
    }
    console.error('Invalid date string:', value)
    return null
  }
  
  if (value instanceof Date) {
    return dayjs(value)
  }
  
  return null
}

/**
 * Date picker component with label support.
 * Migrated from RSuite to Ant Design.
 * 
 * Key differences:
 * - RSuite uses Date objects, Ant Design uses dayjs objects
 * - format string syntax differs (date-fns vs dayjs)
 * - cleanable → allowClear
 * - onClean → onClear
 * - showMeridiem → use12Hours
 * - oneTap → custom implementation with open state control
 * 
 * @param props the component props.
 * @param props.label the label for the date picker.
 * @param props.value the value of the date picker.
 * @param props.className the CSS class name.
 * @param props.format the format of the date.
 * @param props.defaultValue the default value of the date picker.
 * @param props.size the RSuite size.
 * @param props.placement the RSuite placement.
 * @param props.cleanable whether to show clear button.
 * @param props.onClean the clear event handler.
 * @param props.oneTap whether to auto-close on selection.
 * @param props.showMeridiem whether to show AM/PM.
 * @param props.props the additional date picker props.
 * @returns the React element.
 */
const RsDatePicker = ({
  label,
  value,
  className,
  format,
  defaultValue,
  size: rsSize,
  placement: rsPlacement,
  cleanable,
  onClean,
  oneTap,
  showMeridiem,
  onChange,
  ...props
}: RsDatePickerProps) => {
  const componentData = useComponentData()
  const [open, setOpen] = useState(false)
  
  // Convert format from date-fns to dayjs
  const safeFormat: string = useMemo(() => {
    if (!format) return 'YYYY-MM-DD'
    // Handle format which might be a complex type from the define system
    const formatStr = typeof format === 'string' ? format : String(format)
    const converted = toSafeFormat(formatStr)
    if (converted) {
      const dayjsFormat = convertDateFormat(converted)
      return dayjsFormat || 'YYYY-MM-DD'
    }
    return 'YYYY-MM-DD'
  }, [format])
  
  const parsedValue = useMemo(() => parseDateValue(value), [value])
  const parsedDefaultValue = useMemo(() => parseDateValue(defaultValue), [defaultValue])

  useEffect(() => {
    if (typeof (value as unknown) === 'string') {
      const parsed = parseDateValue(value)
      if (parsed && parsed.isValid()) {
        componentData.field?.setValue(parsed.toDate())
      }
    }
  }, [value, componentData])

  // Map RSuite props to Ant Design props
  const antdSize = mapSize(rsSize)
  const antdPlacement = mapPlacement(rsPlacement) as 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  const allowClear = mapCleanable(cleanable)

  // Handle onChange to convert dayjs back to Date
  const handleChange = (date: Dayjs | null) => {
    if (oneTap && date) {
      setOpen(false)
    }
    onChange?.(date ? date.toDate() : null)
  }

  // Handle oneTap behavior
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
  }

  return (
    <Labeled label={label} className={className} passAriaToChildren={true}>
      <DatePicker
        {...props}
        value={parsedValue}
        defaultValue={parsedDefaultValue}
        format={safeFormat}
        size={antdSize}
        placement={antdPlacement}
        allowClear={allowClear}
        use12Hours={showMeridiem}
        onChange={handleChange}
        open={oneTap ? open : undefined}
        onOpenChange={oneTap ? handleOpenChange : undefined}
      />
    </Labeled>
  )
}

export const rsDatePicker = define(RsDatePicker, 'RsDatePicker')
  .name('DatePicker')
  .category(fieldsCategory)
  .props({
    label: string.default('Date'),
    appearance: oneOf('default', 'subtle').withEditorProps({creatable: false}),
    // calendarDefaultDate removed - use defaultValue instead in Ant Design
    cleanable: boolean.default(false),
    defaultOpen: boolean.default(false),
    defaultValue: date,
    disabled: disabled.default(false),
    readOnly,
    // editable removed - Ant Design DatePicker is always editable when not disabled
    format: string.validated(formatValidator, {
      code: 'INVALID_DATE_FORMAT',
      message: 'The provided date format is invalid'
    }).withEditorProps({placeholder: 'yyyy-MM-dd'}),
    // isoWeek removed - Ant Design uses dayjs which handles ISO weeks differently
    // limitEndYear and limitStartYear removed - use minDate/maxDate in Ant Design instead
    oneTap: boolean,
    onChange: event,
    // RSuite-specific events not directly supported in Ant Design:
    // onChangeCalendarDate, onClean, onClose, onEnter, onEntered, onEntering,
    // onExit, onExited, onExiting, onNextMonth, onOk, onOpen, onPrevMonth,
    // onSelect, onToggleMonthDropdown, onToggleTimeDropdown
    open: boolean.default(undefined),
    placeholder: string,
    placement: placement,
    // preventOverflow and showWeekNumbers removed - handled differently in Ant Design
    showMeridiem: boolean.default(false),
    size: size,
    value: date.valued
  })
