import {boolean, define, disabled, event, isNull, string, time, timeFormat} from '@zionix-formEngine/core'
import type {SyntheticEvent} from 'react'
import {useCallback, useMemo} from 'react'
import {TimePicker} from 'antd'
import type {TimePickerProps} from 'antd'
import dayjs from 'dayjs'
import type {Dayjs} from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import {placement, readOnly, size} from '../commonProperties'
import {formatValidator, toSafeFormat} from '../dateTimeUtils'
import {mapPlacement, mapSize, mapCleanable, convertDateFormat} from '../propAdapters'
import {fieldsCategory} from './categories'
import {Labeled} from './components/Labeled'

// Enable custom format parsing for dayjs
dayjs.extend(customParseFormat)

/**
 * Returns the time converted to dayjs format.
 * @param value the time value in string or Date format.
 * @param format the time format.
 * @returns the time converted to Dayjs format.
 */
const parseTimeValue = (value: any, format: string): Dayjs | null => {
  if (!value) return null
  
  if (dayjs.isDayjs(value)) return value
  
  if (typeof value === 'string') {
    // Try dayjs parsing with format
    const parsed = dayjs(value, format, true)
    if (parsed.isValid()) {
      return parsed
    }
    // Try without strict mode
    const parsedLoose = dayjs(value, format)
    if (parsedLoose.isValid()) {
      return parsedLoose
    }
    console.error('Invalid time string:', value)
    return null
  }
  
  if (value instanceof Date) {
    return dayjs(value)
  }
  
  return null
}

/**
 * Props for the RsTimePicker component.
 * Migrated from RSuite to Ant Design.
 */
export interface RsTimePickerProps extends Omit<TimePickerProps, 'value' | 'onChange' | 'size' | 'placement'> {
  /**
   * Value of the time picker.
   */
  value?: string
  /**
   * Callback when value changes.
   */
  onChange?: (value: string | null, event: SyntheticEvent) => void
  /**
   * Label for the time picker.
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
   * RSuite showMeridiem prop (maps to use12Hours).
   */
  showMeridiem?: boolean
  /**
   * @deprecated
   */
  inline?: boolean
}

/**
 * Time picker component with label support.
 * Migrated from RSuite DatePicker (time mode) to Ant Design TimePicker.
 * 
 * Key differences:
 * - RSuite used DatePicker for time, Ant Design has dedicated TimePicker
 * - Value format: string (HH:mm) → dayjs object
 * - cleanable → allowClear
 * - format conversion from date-fns to dayjs
 * 
 * @param props the component props.
 * @param props.open whether the time picker is open.
 * @param props.label the label for the time picker.
 * @param props.value the value of the time picker.
 * @param props.className the CSS class name.
 * @param props.format the format of the time.
 * @param props.defaultValue the default value of the time picker.
 * @param props.onChange the callback when value changes.
 * @param props.size the RSuite size.
 * @param props.placement the RSuite placement.
 * @param props.cleanable whether to show clear button.
 * @param props.onClean the clear event handler.
 * @param props.showMeridiem whether to show AM/PM.
 * @param props.props the additional time picker props.
 * @returns the React element.
 */
const RsTimePicker = ({
  open,
  label,
  value,
  className,
  format,
  defaultValue,
  onChange,
  size: rsSize,
  placement: rsPlacement,
  cleanable,
  onClean,
  showMeridiem,
  ...props
}: RsTimePickerProps) => {
  // Convert format from date-fns to dayjs
  const safeFormat: string = useMemo(() => {
    if (!format) return timeFormat
    const formatStr = typeof format === 'string' ? format : String(format)
    const converted = toSafeFormat(formatStr)
    if (converted) {
      const dayjsFormat = convertDateFormat(converted)
      return dayjsFormat || timeFormat
    }
    return timeFormat
  }, [format])
  
  const parsedValue = useMemo(() => parseTimeValue(value, timeFormat), [value])
  const parsedDefaultValue = useMemo(() => parseTimeValue(defaultValue, timeFormat), [defaultValue])
  const pickerOpen = useMemo(() => open === true ? true : undefined, [open])

  // Map RSuite props to Ant Design props
  const antdSize = mapSize(rsSize)
  const antdPlacement = mapPlacement(rsPlacement) as 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  const allowClear = mapCleanable(cleanable)

  const handleChange = useCallback((time: Dayjs | null) => {
    if (isNull(time)) {
      onChange?.(null, {} as SyntheticEvent)
      return
    }
    if (time && time.isValid()) {
      const formatted = time.format(timeFormat)
      onChange?.(formatted, {} as SyntheticEvent)
    }
  }, [onChange])

  return (
    <Labeled label={label} className={className} passAriaToChildren={true}>
      <TimePicker
        {...props}
        onChange={handleChange}
        value={parsedValue ?? parsedDefaultValue}
        open={pickerOpen}
        format={safeFormat}
        size={antdSize}
        placement={antdPlacement}
        allowClear={allowClear}
        use12Hours={showMeridiem}
      />
    </Labeled>
  )
}

export const rsTimePicker = define(RsTimePicker, 'RsTimePicker')
  .name('TimePicker')
  .category(fieldsCategory)
  .props({
    label: string.default('Time'),
    placeholder: string,
    value: time.valued,
    defaultValue: time,
    format: string
      .validated(formatValidator, {
        code: 'INVALID_TIME_FORMAT',
        message: 'The provided time format is invalid'
      })
      .withEditorProps({placeholder: 'HH:mm'})
      .default('HH:mm'),
    // editable removed - Ant Design TimePicker is always editable when not disabled
    cleanable: boolean.default(false),
    disabled: disabled.default(false),
    readOnly,
    open: boolean,
    placement: placement,
    size: size,
    onChange: event,
    // RSuite-specific events not directly supported in Ant Design
    // onClean, onClose, onEnter, onEntered, onEntering, onExit, onExited, onExiting, onOk, onOpen, onSelect
  })
