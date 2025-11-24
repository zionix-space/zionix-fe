import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import type {SelectProps, AutoCompleteProps} from 'antd'
import type {BaseSelectRef} from 'rc-select'

// Ant Design equivalent types (mapped from RSuite)
// RSuite ItemDataType → Ant Design option format
export interface ItemDataType {
  label: string
  value: any
  [key: string]: any
}

/**
 * The callback function for loading data into the component.
 * @param newData the new data to be loaded into the component.
 */
export type LoadCallback = (newData: ItemDataType[]) => void

/**
 * Describes a function that is called when data is to be loaded into the component.
 * @param searchKeyword the current search value.
 * @param loadCallback the callback function called to set the data in the component.
 * @param currentDataLength the length of the data already loaded.
 */
export type LoadDataHandler = (
  searchKeyword: string,
  loadCallback: LoadCallback,
  currentDataLength: number
) => {}


/**
 * Interface for load data props.
 */
export interface LoadDataProps {
  /**
   * The callback function called when data should be load.
   */
  onLoadData?: LoadDataHandler
  /**
   * Flag, if true, the data will be loaded in advance, before opening the dropdown, false otherwise.
   */
  preload?: boolean
  /**
   * Flag, if true, the virtualized will be disabled, false otherwise.
   */
  disableVirtualized?: boolean
}

/**
 * Props for the useLoadData hook combining Ant Design Select/AutoComplete props and LoadDataProps.
 * Mapped from RSuite InputPickerProps to Ant Design equivalents:
 * - data → options (Ant Design uses 'options' instead of 'data')
 * - onSearch → onSearch (compatible)
 * - onOpen → onDropdownVisibleChange (Ant Design uses different event)
 * - onCreate → custom handling (Ant Design doesn't have direct equivalent)
 */
interface UseLoadDataProps extends LoadDataProps {
  data?: ItemDataType[]
  value?: any
  onSearch?: (value: string) => void
  onOpen?: () => void
  onCreate?: (value: any, item: ItemDataType) => void
}

/**
 * Implements data loading and infinite loader logic for Ant Design Select/AutoComplete components.
 * Adapted from RSuite to Ant Design:
 * - Returns 'options' instead of 'data' (Ant Design naming)
 * - Returns 'onDropdownVisibleChange' instead of 'onOpen' (Ant Design event)
 * - Handles virtualization through Ant Design's built-in virtual list support
 * 
 * @param props the React component properties.
 * @param props.data the data for the picker.
 * @param props.onLoadData the callback function called when data should be load.
 * @param props.onSearch the callback function called when a search is performed.
 * @param props.onOpen the callback function called when the list is displayed.
 * @param props.value the current value of the component.
 * @param props.preload flag, if true, the data will be loaded in advance, before opening the dropdown, false otherwise.
 * @param props.disableVirtualized flag, if true, the virtualized will be disabled, false otherwise.
 * @returns the object with prepared properties for the Ant Design picker.
 */
export const useLoadData = ({data: initialData, onLoadData, value, preload, disableVirtualized, ...props}: UseLoadDataProps) => {
  const [searchValue, setSearchValue] = useState('')
  const [data, setData] = useState<ItemDataType[]>(initialData ?? [])
  const [loading, setLoading] = useState(false)
  const hasValue = useCallback((item: ItemDataType) => item.value === value, [value])

  const loadCallback: LoadCallback = useCallback((newData) => {
    let filteredData = data

    if (value && newData.some(hasValue)) {
      filteredData = data.filter(item => !hasValue(item))
    }

    setData([...filteredData, ...newData])
    setLoading(false)
  }, [data, hasValue, value])

  useEffect(() => {
    if (preload) onLoadData?.('', loadCallback, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preload, onLoadData])

  useEffect(() => {
    const valueItem = value && !initialData?.some(hasValue) ? [{value, label: value}] : []
    setData([
      ...valueItem,
      ...(initialData ?? [])
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData])

  useEffect(() => {
    if (!searchValue) return
    if (onLoadData) setLoading(true)
    onLoadData?.(searchValue, loadCallback, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  // Ant Design uses onPopupScroll for infinite loading instead of RSuite's listProps
  const onPopupScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    if (onLoadData && target.scrollTop + target.offsetHeight >= target.scrollHeight - 10) {
      setLoading(true)
      onLoadData(searchValue, loadCallback, data.length)
    }
  }, [onLoadData, searchValue, loadCallback, data.length])

  const onSearch = useCallback((value: string) => {
    if (onLoadData) setData([])
    setSearchValue(value)
    props.onSearch?.(value)
  }, [onLoadData, props])

  // Ant Design uses onDropdownVisibleChange instead of onOpen
  const onDropdownVisibleChange = useCallback((open: boolean) => {
    if (open) {
      props.onOpen?.()
      if (!value && !preload) onLoadData?.('', loadCallback, 0)
    }
  }, [props, value, preload, onLoadData, loadCallback])

  const onCreate = useCallback((inputValue: string) => {
    const item: ItemDataType = {value: inputValue, label: inputValue}
    setData([item, ...data])
    setSearchValue('')
    props.onCreate?.(inputValue, item)
  }, [data, props])

  // Ant Design has built-in virtual list support
  const virtual = !!onLoadData && disableVirtualized !== true

  // Return options instead of data (Ant Design naming convention)
  return {
    options: data,
    value,
    loading,
    onPopupScroll,
    onSearch,
    onDropdownVisibleChange,
    onCreate,
    virtual
  }
}

/**
 * Sets aria-hidden="true" on the HTML element if the attribute is not already set.
 * @param element element on which to set the aria-hidden attribute to true.
 */
export function setAriaHiddenIfNotExists(element: Element | null | undefined) {
  if (element && !element.hasAttribute('aria-hidden')) {
    element.setAttribute('aria-hidden', 'true')
  }
}

/**
 * Adds aria-hidden to the internal input of the Ant Design Select component.
 * Adapted from RSuite to target Ant Design's DOM structure:
 * - RSuite used: input.rs-picker-search-input
 * - Ant Design uses: input.ant-select-selection-search-input
 * 
 * @returns ref that should be set by the Select/AutoComplete component.
 */
export const useFixAriaAttributesForInputPicker = () => {
  const inputRef = useRef<BaseSelectRef>(null)
  useEffect(() => {
    // Ant Design Select uses different DOM structure than RSuite
    const antSelectSearch = inputRef.current?.nativeElement?.querySelector('input.ant-select-selection-search-input')
    setAriaHiddenIfNotExists(antSelectSearch)
  }, [])
  return inputRef
}

/**
 * Returns the memoized conversion value over an array.
 * @param array the array.
 * @param mapFn the conversion function.
 * @returns the memoized conversion value over an array.
 */
export const useArrayMapMemo = <T, R>(array: T[] | undefined,
                                      mapFn: (item: T, index: number) => R) => {
  const length = array?.length
  return useMemo(() => {
    if (!length) return []
    return array.map(mapFn)
  }, [array, length, mapFn])
}
