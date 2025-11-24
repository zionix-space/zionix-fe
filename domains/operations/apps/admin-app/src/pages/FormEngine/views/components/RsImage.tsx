import styled from '@emotion/styled'
import {define, oneOf, string, useBuilderValue} from '@zionix-formEngine/core'
import type {ComponentProps} from 'react'
import type {AreaProps} from '../commonTypes'
import {staticCategory} from './categories'

// Placeholder logo - replace with actual logo path when available
const logo = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23999"%3EImage%3C/text%3E%3C/svg%3E'

/**
 * Props for the RsImage component.
 */
export interface RsImageProps extends ComponentProps<'img'>, AreaProps {
}

const SImage = styled.img`
  width: 100%;
  height: 100%;
`

/**
 * An image component that displays an image with configurable source and styling.
 * @param props the component props.
 * @param props.alt the alternative text for the image.
 * @param props.src the image source URL.
 * @returns the React element.
 */
const RsImage = ({alt, src, ...props}: RsImageProps) => {
  const source = useBuilderValue(src, logo)
  return <SImage {...props} alt={alt} src={source}/>
}

export const rsImage = define(RsImage, 'RsImage')
  .name('Image')
  .category(staticCategory)
  .props({
    src: string.required.default(logo).dataBound,
    alt: string.default('Image'),
  })
  .css({
    objectPosition: oneOf('top', 'bottom', 'left', 'right', 'center').default('left'),
    objectFit: oneOf('contain', 'cover', 'fill', 'none', 'scale-down').default('scale-down')
      .withEditorProps({creatable: false}),
  })
