import {boolean, define, event, node, string} from '@zionix-formEngine/core'
import {useMemo} from 'react'
import {Card} from 'antd'
import type {CardProps} from 'antd'
import {headerSize} from '../commonProperties'
import {structureCategory} from './categories'
import {RsHeader} from './RsHeader'

/**
 * Props for the RsCard component.
 * Migrated from RSuite Panel to Ant Design Card.
 */
export interface RsCardProps extends Omit<CardProps, 'title'> {
  /**
   * Title for the card.
   */
  title?: string
  /**
   * Header size for the card.
   */
  headerSize: string
  /**
   * Header content (RSuite prop).
   */
  header?: React.ReactNode
  /**
   * RSuite bodyFill prop.
   */
  bodyFill?: boolean
  /**
   * RSuite shaded prop.
   */
  shaded?: boolean
  /**
   * RSuite collapsible prop.
   */
  collapsible?: boolean
  /**
   * RSuite defaultExpanded prop.
   */
  defaultExpanded?: boolean
}

/**
 * Panel header component with title and header size support.
 */
type PanelHeaderProps = Pick<RsCardProps, 'title' | 'headerSize' | 'header'>

const PanelHeader = ({title, headerSize, header}: PanelHeaderProps) => (
  <div>
    {!!title && <RsHeader headerSize={headerSize} content={title}/>}
    {header}
  </div>
)

/**
 * Card component with header and title support.
 * Migrated from RSuite Panel to Ant Design Card.
 * 
 * Key differences:
 * - Panel → Card
 * - bodyFill, shaded, collapsible not directly supported
 * - bordered prop is compatible
 */
const RsCard = ({header, title, headerSize, bodyFill, shaded, collapsible, defaultExpanded, bordered = true, ...props}: RsCardProps) => {
  const cardTitle = useMemo(() => {
    return <PanelHeader title={title} headerSize={headerSize} header={header}/>
  }, [header, headerSize, title])

  return <Card title={cardTitle} bordered={bordered} {...props}/>
}

export const rsCard = define(RsCard, 'RsCard')
  .name('Card')
  .category(structureCategory)
  .props({
    header: node,
    children: node,
    title: string.default('Title'),
    headerSize,
    // bodyFill, shaded, collapsible, defaultExpanded removed - not supported in Ant Design Card
    bordered: boolean.default(true),
    // eventKey and onSelect removed - not applicable to Ant Design Card
  })
