import {boolean, define, node} from '@zionix-formEngine/core'
import type {ReactNode} from 'react'
import {modalCategory} from './categories'

export interface RsModalLayoutProps {
  closeButton: boolean,
  headerTitle: ReactNode,
  body: ReactNode,
  footer: ReactNode,
}

const RsModalLayout = (props: RsModalLayoutProps) => {
  const {headerTitle, body, footer, ...rest} = props
  return <div {...rest}>
    <div style={{padding: '16px 24px', borderBottom: '1px solid #f0f0f0'}}>
      <div style={{fontSize: '16px', fontWeight: 500}}>{headerTitle}</div>
    </div>
    <div style={{padding: '24px'}}>{body}</div>
    <div style={{padding: '10px 16px', borderTop: '1px solid #f0f0f0', textAlign: 'right'}}>{footer}</div>
  </div>
}

export const rsModalLayout = define(RsModalLayout, 'RsModalLayout')
  .name('Modal layout')
  .category(modalCategory)
  .props({
    closeButton: boolean.default(true),
    headerTitle: node,
    body: node,
    footer: node,
  })
