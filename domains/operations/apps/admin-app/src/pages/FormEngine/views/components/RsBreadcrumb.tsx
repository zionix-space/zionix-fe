import {array, define, event, oneOf, string} from '@zionix-formEngine/core'
import {useMemo} from 'react'
import {Breadcrumb} from 'antd'
import type {BreadcrumbProps} from 'antd'
import {structureCategory} from './categories'
import {CheckCell} from './components/CheckCell'
import {InputCell} from './components/InputCell'

export interface RsBreadcrumbItemProps {
  active?: boolean
  href?: string
  title?: string
}

const makeItems = (data: string[]) => data.map(title => ({title, href: title}))

export interface RsBreadcrumbProps extends Omit<BreadcrumbProps, 'items'> {
  items: RsBreadcrumbItemProps[]
  onItemClick: (item: RsBreadcrumbItemProps) => {}
}

const columns = [
  {name: 'title', input: InputCell},
  {name: 'href', title: 'Url', input: InputCell},
  {name: 'active', input: CheckCell}
] as const

const containerStyle = {display: 'flex'} as const

// Migrated from RSuite to Ant Design Breadcrumb
const RsBreadcrumb = ({items, onItemClick, separator, ...props}: RsBreadcrumbProps) => {
  const clickHandlers = useMemo(() => (items ?? []).map((it) => {
    return () => onItemClick?.(it)
  }), [items, onItemClick])

  // Map items to Ant Design format
  const antdItems = items?.map((item, idx) => ({
    title: item.title,
    href: item.href,
    onClick: clickHandlers[idx]
  }))

  return (
    <Breadcrumb {...props} items={antdItems} separator={separator} style={containerStyle} />
  )
}

export const rsBreadcrumb = define(RsBreadcrumb, 'RsBreadcrumb')
  .name('Breadcrumb')
  .category(structureCategory)
  .props({
    separator: string.default('/'),
    // maxItems removed - use Ant Design's maxCount prop if needed
    items: array
      .default(makeItems(['one', 'two', 'three']))
      .withEditorProps({columns}),
    onItemClick: event,
    // onExpand removed - not in Ant Design
  })
  .css({
    justifyContent: oneOf('left', 'center', 'right')
      .default('left').radio().named('Alignment'),
  })
