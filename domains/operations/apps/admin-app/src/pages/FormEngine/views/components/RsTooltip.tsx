import type {WrapperProps} from '../../core'
import {define, node, oneOf, someOf, string} from '@zionix-formEngine/core'
import {Tooltip} from 'antd'
import type {TooltipPlacement} from 'antd/es/tooltip'
import {mapPlacement} from '../propAdapters'
import {staticCategory} from './categories'

/**
 * The properties of RsTooltip component.
 * Migrated from RSuite to Ant Design.
 */
export interface RsTooltipProps extends WrapperProps {
  /**
   * The tooltip text.
   */
  text: string
  /**
   * The placement of a tooltip.
   * Supports both RSuite and Ant Design placement values.
   */
  placement: TooltipPlacement | string
  /**
   * The tooltip trigger.
   * Ant Design supports: 'hover' | 'focus' | 'click' | 'contextMenu'
   * RSuite also supported 'active' which maps to 'hover'
   */
  trigger: 'hover' | 'focus' | 'click' | 'contextMenu' | 'active' | Array<'hover' | 'focus' | 'click' | 'contextMenu' | 'active'>
}

const wrapperStyle = {width: '100%', height: '100%'} as const

/**
 * Tooltip component migrated from RSuite Whisper+Tooltip to Ant Design Tooltip.
 * 
 * Key differences:
 * - RSuite used Whisper wrapper with speaker prop, Ant Design uses Tooltip directly
 * - Placement values are mapped (bottomStart → bottomLeft, etc.)
 * - Trigger 'active' is mapped to 'hover'
 */
const RsTooltip = ({text, placement, trigger, children, ...props}: RsTooltipProps) => {
  if (!children) return null

  // Map RSuite placement to Ant Design placement
  const antdPlacement = mapPlacement(placement) as TooltipPlacement
  
  // Map trigger array, converting 'active' to 'hover'
  const antdTrigger = Array.isArray(trigger)
    ? trigger.map(t => t === 'active' ? 'hover' : t) as Array<'hover' | 'focus' | 'click' | 'contextMenu'>
    : trigger === 'active' ? 'hover' : trigger

  return (
    <Tooltip title={text} placement={antdPlacement} trigger={antdTrigger}>
      <div {...props} style={wrapperStyle}>{children}</div>
    </Tooltip>
  )
}

/**
 * Metadata builder for rSuite-based tooltip display component.
 */
export const rsTooltip = define(RsTooltip, 'RsTooltip')
  .name('Tooltip')
  .category(staticCategory)
  .props({
    text: string.required.default('Tooltip message...').dataBound,
    children: node,
    placement: oneOf('top', 'bottom', 'right', 'left', 'bottomStart', 'bottomEnd',
      'topStart', 'topEnd', 'leftStart', 'rightStart', 'leftEnd', 'rightEnd', 'auto',
      'autoVertical', 'autoVerticalStart', 'autoVerticalEnd', 'autoHorizontal', 'autoHorizontalStart')
      .required.default('bottom')
      .withEditorProps({creatable: false}),
    trigger: someOf('click', 'hover', 'focus', 'active', 'contextMenu')
      .required.default(['hover'])
  })
  .componentRole('tooltip')
