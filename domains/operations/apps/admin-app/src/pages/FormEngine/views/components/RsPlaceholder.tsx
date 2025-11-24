import {boolean, define, number, oneOf, size} from '@zionix-formEngine/core'
import {Skeleton} from 'antd'
import {staticCategory} from './categories'

// Migrated from RSuite Placeholder to Ant Design Skeleton

const iconStyle = {width: 24, height: 24}

const IconGrid = () => (
  <svg style={iconStyle} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="4" y1="8" x2="8" y2="8" stroke="#9CA3AF" strokeWidth="1"/>
    <line x1="4" y1="12" x2="10" y2="12" stroke="#9CA3AF" strokeWidth="1"/>
    <line x1="4" y1="16" x2="9" y2="16" stroke="#9CA3AF" strokeWidth="1"/>
    <line x1="13" y1="8" x2="20" y2="8" stroke="#9CA3AF" strokeWidth="1"/>
    <line x1="12" y1="12" x2="20" y2="12" stroke="#9CA3AF" strokeWidth="1"/>
    <line x1="14" y1="16" x2="20" y2="16" stroke="#9CA3AF" strokeWidth="1"/>
  </svg>
)

const IconParagraph = () => (
  <svg style={iconStyle} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="12" y1="10" x2="20" y2="10" stroke="#9CA3AF" strokeWidth="1"/>
    <line x1="12" y1="14" x2="20" y2="14" stroke="#9CA3AF" strokeWidth="1"/>
    <circle cx="5" cy="12" r="4" stroke="#9CA3AF" fill="#9CA3AF" fillOpacity="0.7"/>
  </svg>
)

const IconGraph = () => (
  <svg style={iconStyle} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="14" height="14" fill="#9CA3AF" fillOpacity="0.7"/>
  </svg>
)

// Map RSuite Placeholder.Graph to Ant Design Skeleton.Image
export const rsPlaceholderGraph = define(Skeleton.Image, 'RsPlaceholderGraph')
  .name('Placeholder graph')
  .category(staticCategory)
  .icon(IconGraph)
  .props({
    // width and height removed - Ant Design Skeleton.Image uses style prop
    active: boolean,
  })

// Map RSuite Placeholder.Grid to Ant Design Skeleton with custom layout
// Note: Ant Design doesn't have a direct grid equivalent, using paragraph with multiple rows
export const rsPlaceholderGrid = define(Skeleton, 'RsPlaceholderGrid')
  .name('Placeholder grid')
  .category(staticCategory)
  .icon(IconGrid)
  .props({
    // rows prop compatible
    paragraph: boolean.default(true),
    active: boolean,
    // columns, rowHeight, rowSpacing removed - not directly supported in Ant Design
  })

// Map RSuite Placeholder.Paragraph to Ant Design Skeleton
export const rsPlaceholderParagraph = define(Skeleton, 'RsPlaceholderParagraph')
  .name('Placeholder paragraph')
  .category(staticCategory)
  .icon(IconParagraph)
  .props({
    // rows prop compatible via paragraph.rows
    paragraph: boolean.default(true),
    avatar: boolean.default(false),
    active: boolean,
    // rowHeight, rowSpacing removed - not supported in Ant Design
    // graph removed - use avatar prop instead
  })
