import {boolean, date, define, event, string} from '@zionix-formEngine/core'
import {Calendar} from 'antd'
import type {CalendarProps} from 'antd'
import dayjs from 'dayjs'
import type {Dayjs} from 'dayjs'
import {readOnly} from '../commonProperties'
import {fieldsCategory} from './categories'
import {Labeled} from './components/Labeled'

/**
 * Props for the RsCalendar component.
 * Migrated from RSuite to Ant Design.
 */
export interface RsCalendarProps extends Omit<CalendarProps<Dayjs>, 'value' | 'onChange' | 'defaultValue'> {
  /**
   * Whether the calendar is read only.
   */
  readOnly: boolean
  /**
   *  Label for the calendar.
   */
  label?: string
  /**
   * Value as Date (converted to/from Dayjs internally).
   */
  value?: Date
  /**
   * Default value as Date.
   */
  defaultValue?: Date
  /**
   * onChange handler with Date parameter.
   */
  onChange?: (value: Date) => void
}

/**
 * Calendar component with label support.
 * Migrated from RSuite to Ant Design.
 * 
 * Key differences:
 * - RSuite uses Date objects, Ant Design uses dayjs
 * - bordered/compact props handled differently
 * - isoWeek not directly supported
 */
const RsCalendar = ({label, style, className, value, defaultValue, onChange, ...props}: RsCalendarProps) => {
  const dayjsValue = value ? dayjs(value) : undefined
  const dayjsDefaultValue = defaultValue ? dayjs(defaultValue) : undefined
  
  const handleChange = (date: Dayjs) => {
    if (onChange && !props.readOnly) {
      onChange(date.toDate())
    }
  }

  return <Labeled label={label} style={style} className={className} passAriaToChildren={true}>
    <Calendar
      {...props}
      value={dayjsValue}
      defaultValue={dayjsDefaultValue}
      onChange={props.readOnly ? undefined : handleChange}
      fullscreen={false}
    />
  </Labeled>
}

export const rsCalendar = define(RsCalendar, 'RsCalendar')
  .name('Calendar')
  .category(fieldsCategory)
  .props({
    label: string,
    // bordered and compact removed - styled differently in Ant Design
    defaultValue: date,
    readOnly,
    // isoWeek removed - dayjs handles differently
    onChange: event,
    // onSelect removed - use onChange in Ant Design
    value: date.valued,
  })
