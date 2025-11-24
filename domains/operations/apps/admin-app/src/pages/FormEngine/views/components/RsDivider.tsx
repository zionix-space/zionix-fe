import {define, oneOf, string} from '@zionix-formEngine/core'
import {Divider} from 'antd'
import {staticCategory} from './categories'

const iconStyle = {width: 24, height: 24}

const Icon = () => (
  <svg style={iconStyle} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="4" y1="10" x2="16" y2="10" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

// Migrated from RSuite to Ant Design - Divider is compatible
export const rsDivider = define(Divider, 'RsDivider')
  .name('Divider')
  .category(staticCategory)
  .icon(Icon)
  .props({
    children: string,
    type: oneOf('horizontal', 'vertical').default('horizontal'),
  })
