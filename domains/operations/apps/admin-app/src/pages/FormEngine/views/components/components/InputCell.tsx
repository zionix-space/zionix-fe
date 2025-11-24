import {useCallback} from 'react'
import {Input} from 'antd'
import type {InputCellProps} from './InputCellProps'
import {SCell} from './SCell'

/**
 * The React component that displays the table cell with the input.
 * Migrated from RSuite Input to Ant Design Input.
 * @param props the React component properties.
 * @param props.rowData the row data.
 * @param props.dataKey the key name in {@link rowData}.
 * @param props.rowIndex the row index.
 * @param props.props the other properties of the component.
 * @param props.onChange the onChange event of the checkbox.
 * @returns the React element.
 */
export const InputCell = ({rowData, dataKey, rowIndex, onChange, ...props}: InputCellProps) => {
  const value = rowData[dataKey] ?? ''

  const handleChange = useCallback((e: any) => {
    const newValue = e.target.value
    rowData[dataKey] = newValue
    onChange?.(newValue, dataKey, rowIndex)
  }, [dataKey, onChange, rowData, rowIndex])

  return (
    <SCell {...props}>
      <Input value={value} onChange={handleChange} size="small"/>
    </SCell>
  )
}
