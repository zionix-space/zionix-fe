import styled from '@emotion/styled'
import {array, boolean, define, node, toLabeledValues, useComponentData} from '@zionix-formEngine/core'
import type {ReactNode} from 'react'
import {useCallback} from 'react'
import {Tabs} from 'antd'
import type {TabsProps} from 'antd'
import {navProps} from '../commonProperties'
import {structureCategory} from './categories'

export type RsTabItem = {
  label: string
  value: string
}

export interface RsTabProps extends Omit<TabsProps, 'items' | 'type'> {
  items?: RsTabItem[]
  showNavigation?: boolean
  pane: ReactNode
  appearance?: 'default' | 'tabs' | 'subtle' | 'pills'
  vertical?: boolean
  justified?: boolean
  reversed?: boolean
}

const STabs = styled(Tabs)({
  '.builder & .ant-tabs-tab': {
    zIndex: 7,
  }
})

const RsTab = ({pane, onChange, showNavigation, items, appearance = 'default', vertical, justified, reversed, ...props}: RsTabProps) => {
  const componentData = useComponentData()

  const onTabChange = useCallback((activeKey: string) => {
    componentData.userDefinedProps ??= {}
    componentData.userDefinedProps.activeKey = activeKey
    onChange?.(activeKey)
  }, [componentData, onChange])

  if (!items?.length) return null

  const activeKey = props.activeKey ?? items?.[0].value
  const appearanceMap = {default: 'line', tabs: 'line', subtle: 'line', pills: 'card'}
  const type = appearanceMap[appearance] as 'line' | 'card'
  const tabPosition = vertical ? 'left' : 'top'
  const tabItems = (reversed ? [...items].reverse() : items).map(item => ({
    key: item.value,
    label: item.label,
    children: null
  }))

  return <>
    {showNavigation === true && <STabs onChange={onTabChange} activeKey={activeKey} type={type} tabPosition={tabPosition} items={tabItems} {...props}/>}
    <div>{pane}</div>
  </>
}

export const rsTab = define(RsTab, 'RsTab')
  .name('Tab')
  .category(structureCategory)
  .props({
    ...navProps,
    items: array.default(toLabeledValues(['Item1', 'Item2', 'Item3'])),
    showNavigation: boolean.default(true),
    pane: node.withSlotConditionBuilder(props => `return parentProps.activeKey === '${props.activeKey?.value ?? props.activeKey}'`).calculable(false),
  })
