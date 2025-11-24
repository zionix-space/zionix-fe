import {array, boolean, define, string, toLabeledValues} from '@zionix-formEngine/core'
import type {ReactNode} from 'react'
import {useCallback} from 'react'
import {Select} from 'antd'
import type {SelectProps} from 'antd'
import {pickerProps} from '../commonProperties'
import type {LoadDataProps, ItemDataType} from '../hooks'
import {useLoadData} from '../hooks'
import {mapPlacement, mapCleanable} from '../propAdapters'
import {fieldsCategory} from './categories'
import {Labeled} from './components/Labeled'
import {useTouchOnEvent} from './hooks/useTouchOnEvent'
import {SLoader} from './SLoader'

/**
 * Props for the RsDropdown component.
 * Migrated from RSuite InputPicker to Ant Design Select.
 */
export interface RsDropdownProps extends Omit<SelectProps, 'options' | 'placement'>, LoadDataProps {
  /**
   * The label for the dropdown.
   */
  label: string
  /**
   * The data for the dropdown (RSuite naming, maps to Ant Design 'options').
   */
  data?: ItemDataType[]
  /**
   * The htmlSize attribute defines the width of the input element.
   */
  htmlSize?: number
  /**
   * RSuite cleanable prop (maps to Ant Design allowClear).
   */
  cleanable?: boolean
  /**
   * RSuite creatable prop (enables creating new options).
   */
  creatable?: boolean
  /**
   * RSuite placement prop (maps to Ant Design placement).
   */
  placement?: string
  /**
   * RSuite onClean event (maps to Ant Design onClear).
   */
  onClean?: () => void
  /**
   * RSuite onCreate event (for creatable dropdown).
   */
  onCreate?: (value: any, item: ItemDataType) => void
  /**
   * RSuite onOpen event (for dropdown open).
   */
  onOpen?: () => void
  /**
   * RSuite renderMenu prop (maps to Ant Design dropdownRender).
   */
  renderMenu?: (menu: ReactNode) => ReactNode
  /**
   * Called after the value has been changed.
   * @param value the value.
   */
  onChange?: (value: any) => void
}

/**
 * Dropdown component with label and data loading support.
 * Migrated from RSuite InputPicker to Ant Design Select.
 * 
 * Key differences:
 * - RSuite used InputPicker, Ant Design uses Select
 * - data → options (prop name change)
 * - cleanable → allowClear (prop name change)
 * - placement values are mapped (bottomStart → bottomLeft, etc.)
 * - renderMenu → dropdownRender (prop name change)
 * - onClean → onClear (event name change)
 * - creatable is handled with showSearch and custom filtering
 * 
 * @param props the component props.
 * @param props.data the data for the dropdown.
 * @param props.label the label for the dropdown.
 * @param props.onLoadData the callback for loading data.
 * @param props.onSearch the callback for search.
 * @param props.onOpen the callback for open.
 * @param props.value the value of the dropdown.
 * @param props.className the css class name.
 * @param props.preload whether to preload data.
 * @param props.disableVirtualized whether to disable virtualization.
 * @param props.cleanable whether to show clear button (RSuite prop).
 * @param props.creatable whether to allow creating new options (RSuite prop).
 * @param props.placement the dropdown placement (RSuite prop).
 * @param props.onClean the callback for clear (RSuite event).
 * @param props.onCreate the callback for create (RSuite event).
 * @param props.renderMenu the menu renderer (RSuite prop).
 * @param props.props the additional dropdown props.
 * @returns the React element.
 */
const RsDropdown = ({
                      data,
                      label,
                      onLoadData,
                      onSearch: onSearchProp,
                      onOpen,
                      value = '',
                      className,
                      preload,
                      disableVirtualized,
                      cleanable,
                      creatable,
                      placement,
                      onClean,
                      onCreate,
                      renderMenu,
                      ...props
                    }: RsDropdownProps) => {
  // Use the adapted useLoadData hook for Ant Design
  const {
    options,
    loading,
    onPopupScroll,
    onSearch,
    onDropdownVisibleChange,
    onCreate: onCreateHandler,
    virtual
  } = useLoadData({
    data,
    onLoadData,
    onSearch: onSearchProp,
    onOpen,
    value,
    preload,
    disableVirtualized
  })

  const onClear = useTouchOnEvent(props, 'onClear')
  
  // Map RSuite props to Ant Design props
  const allowClear = mapCleanable(cleanable)
  const antdPlacement = mapPlacement(placement) as 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  
  // Map renderMenu to dropdownRender
  const dropdownRender = useCallback((menu: ReactNode) => {
    const renderedMenu = renderMenu ? renderMenu(menu) : menu
    return <>
      {renderedMenu}
      {loading && <SLoader/>}
    </>
  }, [renderMenu, loading])

  // Handle onCreate for creatable dropdown
  const handleSearch = useCallback((value: string) => {
    onSearch(value)
    if (creatable && onCreate) {
      onCreateHandler(value)
    }
  }, [onSearch, creatable, onCreate, onCreateHandler])

  return (
    <Labeled label={label} className={className} passAriaToChildren={true}>
      <Select
        {...props}
        options={options}
        value={value}
        allowClear={allowClear}
        showSearch={creatable || !!onLoadData}
        placement={antdPlacement}
        onClear={onClean || onClear}
        onSearch={handleSearch}
        onDropdownVisibleChange={onDropdownVisibleChange}
        onPopupScroll={onPopupScroll}
        dropdownRender={dropdownRender}
        virtual={virtual}
        filterOption={false} // Disable default filtering when using custom search
      />
    </Labeled>
  )
}

export const rsDropdown = define(RsDropdown, 'RsDropdown')
  .name('Dropdown')
  .category(fieldsCategory)
  .props({
    ...pickerProps,
    preload: boolean.default(false),
    label: string.default('Select'),
    data: array.default(toLabeledValues(['a', 'b', 'c']))
  })
