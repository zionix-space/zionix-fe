import {array, define, oneOf, useComponentData} from '@zionix-formEngine/core'
import type {ElementType} from 'react'
import {useCallback} from 'react'
import {Menu} from 'antd'
import type {MenuProps} from 'antd'
import {navProps} from '../commonProperties'
import {staticCategory} from './categories'
import {InputCell} from './components/InputCell'

export type MenuItem = {
  href?: string
  title?: string
}

const makeItems = (data: string[]) => data.map(title => ({title, href: `#${title}`}))

const suitableReactElementTypes = new Set([
  'a', 'button', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'b', 'em', 'i', 'q', 's', 'u', 'input', 'label', 'section',
  'article', 'nav', 'pre'
])

export interface RsMenuProps extends Omit<MenuProps, 'items' | 'selectedKeys'> {
  items?: MenuItem[]
  itemsAs: ElementType
  activeKey?: string
  appearance?: 'default' | 'tabs' | 'subtle' | 'pills'
  vertical?: boolean
}

// Migrated from RSuite Nav to Ant Design Menu
// Key differences:
// - activeKey → selectedKeys (array)
// - vertical → mode (vertical/horizontal)
// - appearance → theme (not fully implemented)
// - itemsAs prop is kept for compatibility but not used (Ant Design Menu doesn't support custom element types)
const RsMenu = ({items, itemsAs, activeKey, appearance = 'default', vertical, ...props}: RsMenuProps) => {
  const componentData = useComponentData()

  const onSelect = useCallback(({key}: any) => {
    componentData.userDefinedProps ??= {}
    componentData.userDefinedProps.activeKey = key
  }, [componentData])

  if (!items?.length) return null

  // Map vertical to mode
  const mode = vertical ? 'vertical' : 'horizontal'
  
  // Map appearance to theme (simplified mapping)
  // Note: appearance prop is kept for compatibility but not fully mapped
  
  const menuItems = items.map(({title, href}, index) => ({
    key: title || String(index),
    label: title,
    // Note: itemsAs prop is not used - Ant Design Menu doesn't support custom element types
  }))

  return <Menu
    mode={mode}
    selectedKeys={activeKey ? [activeKey] : []}
    items={menuItems}
    onSelect={onSelect}
    {...props}
  />
}

const columns = [
  {name: 'title', input: InputCell},
  {name: 'href', title: 'Url', input: InputCell}
] as const

const {activeKey, ...restNavProps} = navProps

const tags = [...suitableReactElementTypes]

export const rsMenu = define(RsMenu, 'RsMenu')
  .name('Menu')
  .category(staticCategory)
  .props({
    activeKey: activeKey.default('Home'),
    ...restNavProps,
    itemsAs: oneOf(...tags)
      .labeled(...tags)
      .default('a')
      .withEditorProps({creatable: false}),
    items: array
      .default(makeItems(['Home', 'News', 'Products']))
      .withEditorProps({columns}),
  })
