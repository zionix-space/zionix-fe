import {useCallback} from 'react'
import {Input} from 'antd'
import type {InputProps} from 'antd'

/**
 * The React component that wraps the Input component.
 * Migrated from RSuite Input to Ant Design Input.
 * @param props the React component properties.
 * @param props.onChange the onChange event of the Input.
 * @param props.props the other wrapped properties of the component.
 * @returns the React element.
 */
export const WrappedInput = ({onChange, ...props}: InputProps) => {
  const handleChange = useCallback((e: any) => onChange?.(e), [onChange])

  return <Input onChange={handleChange} {...props}/>
}
