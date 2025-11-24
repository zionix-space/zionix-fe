import styled from '@emotion/styled'
import {boolean, define, string, useAriaAttributes, useComponentData} from '@zionix-formEngine/core'
import {SearchOutlined, LoadingOutlined} from '@ant-design/icons'
import type {ReactNode} from 'react'
import {useCallback, useMemo} from 'react'
import {Select} from 'antd'
import type {SelectProps} from 'antd'
import {pickerProps} from '../commonProperties'
import type {LoadDataProps} from '../hooks'
import {useLoadData} from '../hooks'
import {fieldsCategory} from './categories'
import {Labeled} from './components/Labeled'
import {useTouchOnEvent} from './hooks/useTouchOnEvent'
import {SLoader} from './SLoader'

const Container = styled.div`
  display: flex;
  flex: 1;
  position: relative;

  .search-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    pointer-events: none;
  }
`

const SSelect = styled(Select)`
  flex: 1;
`

/**
 * Props for the RsSearch component.
 * Migrated from RSuite InputPicker to Ant Design Select.
 */
export interface RsSearchProps extends Omit<SelectProps, 'options'>, LoadDataProps {
  /**
   * The label for the search input.
   */
  label: string
  /**
   * The data for the search (RSuite naming).
   */
  data?: any[]
  /**
   * Called after the value has been changed.
   * @param value the value.
   */
  onChange?: (value: any) => void
}

/**
 * Search component with label and data loading support.
 * Migrated from RSuite InputPicker to Ant Design Select.
 * 
 * Key differences:
 * - InputPicker → Select with showSearch
 * - Custom search icon positioning
 * - Loading state handled with Ant Design Spin
 * 
 * @param props the component props.
 * @param props.data the data for the search.
 * @param props.label the label for the search input.
 * @param props.onLoadData the callback for loading data.
 * @param props.onSearch the callback for search.
 * @param props.value the value of the search.
 * @param props.className the CSS class name.
 * @param props.preload whether to preload data.
 * @param props.disableVirtualized whether to disable virtualization.
 * @param props.props the additional search props.
 * @returns the React element.
 */
const RsSearch = ({data, label, onLoadData, onSearch: onSearchProp, value = '', className, preload, disableVirtualized, ...props}: RsSearchProps) => {
  const {
    options,
    loading,
    onPopupScroll,
    onSearch,
    onDropdownVisibleChange,
    virtual
  } = useLoadData({
    data,
    onLoadData,
    onSearch: onSearchProp,
    value,
    preload,
    disableVirtualized
  })

  const dropdownRender = useCallback((menu: ReactNode) => {
    const renderedMenu = options?.length ? menu : null
    return <>
      {renderedMenu}
      {loading && <SLoader/>}
    </>
  }, [options?.length, loading])

  const onClear = useTouchOnEvent(props, 'onClear')
  const Icon = loading ? LoadingOutlined : SearchOutlined
  const {id} = useComponentData()
  const aria = useAriaAttributes({labeled: !!label})

  const icon = useMemo(() => {
    return !(props.allowClear && value) ? <Icon className={'search-icon'}/> : null
  }, [Icon, props.allowClear, value])

  return (
    <Labeled label={label} className={className} passAriaToChildren={false}>
      <Container>
        <SSelect
          id={id}
          {...aria}
          {...props}
          options={options}
          value={value}
          showSearch
          onClear={onClear}
          onSearch={onSearch}
          onDropdownVisibleChange={onDropdownVisibleChange}
          onPopupScroll={onPopupScroll}
          dropdownRender={dropdownRender}
          virtual={virtual}
          filterOption={false}
          suffixIcon={null}
        />
        {icon}
      </Container>
    </Labeled>
  )
}

export const rsSearch = define(RsSearch, 'RsSearch')
  .name('Search')
  .category(fieldsCategory)
  .props({
    ...pickerProps,
    preload: boolean.default(false),
    label: string.default('Search'),
    placeholder: string.default('Search')
  })
