import {define, string, useBuilderValue} from '@zionix-formEngine/core'
import {Typography} from 'antd'
import {textStyles} from '../commonProperties'
import type {TextProps} from '../commonTypes'
import {staticCategory} from './categories'

const {Text} = Typography
const defaultText = 'Label'

/**
 * Props for the RsLabel component.
 * Migrated to use Ant Design Typography.Text.
 */
export interface RsLabelProps extends TextProps {
  /**
   * The label text content.
   */
  text: string
}

/**
 * A label component that displays text content.
 * Migrated from native label element to Ant Design Typography.Text.
 * @param props the component props.
 * @param props.text the text content to display.
 * @returns the React element.
 */
const RsLabel = ({text, ...props}: RsLabelProps) => {
  const children = useBuilderValue(text, defaultText)
  return <Text {...props}>{children}</Text>
}

export const rsLabel = define(RsLabel, 'RsLabel')
  .name('Label')
  .category(staticCategory)
  .props({
    text: string.default(defaultText).dataBound,
  })
  .css({
    ...textStyles
  })
  .componentRole('label')
