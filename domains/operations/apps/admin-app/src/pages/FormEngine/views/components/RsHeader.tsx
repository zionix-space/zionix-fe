import {color as backgroundColor, define, string, useBuilderValue} from '@zionix-formEngine/core'
import {Typography} from 'antd'
import {headerSize, textStyles} from '../commonProperties'
import type {TextProps} from '../commonTypes'
import {staticCategory} from './categories'

const {Title} = Typography
const defaultContent = 'Header'

/**
 * Props for the RsHeader component.
 * Migrated to use Ant Design Typography.Title.
 */
export interface RsHeaderProps extends TextProps {
  /**
   * The content of the header.
   */
  content?: string
  /**
   * The size of the header (h1-h6).
   */
  headerSize: string
}

/**
 * React component that displays the header.
 * Migrated from native header elements to Ant Design Typography.Title.
 * Maps header size (h1-h6) to level prop (1-6).
 * @param props the React component properties.
 * @param props.content the header text.
 * @param props.headerSize the header size.
 * @param props.props the other wrapped properties of the component.
 * @returns the React element.
 */
export const RsHeader = ({content, headerSize, ...props}: RsHeaderProps) => {
  const children = useBuilderValue(content, defaultContent)
  // Map header size (h1-h6) to level prop (1-6)
  const level = parseInt(headerSize.replace('h', '')) as 1 | 2 | 3 | 4 | 5
  return <Title {...props} level={level}>{children}</Title>
}

const {textAlign, color} = textStyles

export const rsHeader = define(RsHeader, 'RsHeader')
  .name('Header')
  .category(staticCategory)
  .props({
    content: string.required.default(defaultContent).dataBound,
    headerSize
  })
  .css({
    backgroundColor,
    textAlign,
    color
  })
