import {boolean, define, event, oneOf, string} from '@zionix-formEngine/core'
import {useCallback} from 'react'
import {Modal} from 'antd'
import type {ModalProps} from 'antd'
import {mapModalSize, mapBackdrop} from '../propAdapters'
import {modalCategory} from './categories'

export interface RsModalProps extends Omit<ModalProps, 'width'> {
  handleClose?: () => void
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full'
  backdrop?: boolean | 'static'
  overflow?: boolean
}

const RsModal = (props: RsModalProps) => {
  const {children, handleClose, onCancel, size, backdrop, overflow, ...rest} = props

  const close = useCallback((e: any) => {
    handleClose?.()
    onCancel?.(e)
  }, [handleClose, onCancel])

  const width = mapModalSize(size)
  const maskClosable = mapBackdrop(backdrop)
  const bodyStyle = overflow ? {overflow: 'auto'} : {}

  return <Modal {...rest} onCancel={close} width={width} maskClosable={maskClosable} bodyStyle={bodyStyle}>
    {children}
  </Modal>
}

const modalSize = oneOf('xs', 'sm', 'md', 'lg', 'full').labeled('Extra small', 'Small', 'Medium', 'Large', 'Full').default('md')

export const rsModal = define(RsModal, 'RsModal')
  .name('Modal')
  .category(modalCategory)
  .props({
    // autoFocus, enforceFocus removed - handled by Ant Design
    backdrop: boolean.default(true),
    keyboard: boolean.default(true),
    overflow: boolean.default(true),
    size: modalSize,
    // onOpen, onClose removed - not applicable to Ant Design Modal
  })
  .componentRole('modal')
  .hideFromComponentPalette()
