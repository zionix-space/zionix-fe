import {boolean, define, event, node, oneOf, string} from '@zionix-formEngine/core'
import {Typography} from 'antd'
import type {ComponentProps} from 'react'
import {textStyles} from '../commonProperties'
import type {TextProps} from '../commonTypes'
import {staticCategory} from './categories'

const {Link} = Typography

/**
 * Props for the RsLink component.
 * Migrated to use Ant Design Typography.Link.
 */
export interface RsLinkProps extends ComponentProps<'a'>, TextProps {
  /**
   * The link text content.
   */
  text: string
  /**
   * The filename for download when download is enabled.
   */
  downloadFilename: string
  /**
   * The content type (text or custom).
   */
  content: string
}

/**
 * A link component that renders an anchor element with configurable content and behavior.
 * Migrated from native anchor element to Ant Design Typography.Link.
 * Props are mostly compatible between native anchor and Ant Design Link.
 * @param props the component props.
 * @param props.text the link text content.
 * @param props.download whether to download the linked resource.
 * @param props.downloadFilename the filename for download when download is enabled.
 * @param props.content the content type (text or custom).
 * @param props.children the custom content when content type is 'custom'.
 * @returns the React element.
 */
const RsLink = ({text, download, downloadFilename, content, children, ...props}: RsLinkProps) => {
  // Ant Design Link doesn't support download prop directly, so we need to pass it through
  const linkProps = {
    ...props,
    ...(download && {download: downloadFilename ?? download})
  }
  
  return (
    <Link {...linkProps}>
      {content === 'text' ? text : children}
    </Link>
  )
}

export const rsLink = define(RsLink, 'RsLink')
  .name('Link')
  .category(staticCategory)
  .props({
    content: oneOf('text', 'custom').default('text').radio(),
    text: string.default('Link'),
    href: string,
    children: node,
    target: oneOf('_self', '_blank', '_parent', '_top', '_unfencedTop').default('_blank')
      .withEditorProps({creatable: false}),
    download: boolean.default(false),
    downloadFilename: string,
    onClick: event,
  })
  .css({
    ...textStyles
  })
