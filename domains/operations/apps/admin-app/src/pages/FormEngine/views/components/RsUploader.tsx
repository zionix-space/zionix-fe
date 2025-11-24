import {array, boolean, define, disabled, event, node, oneOf, string} from '@zionix-formEngine/core'
import {useEffect, useMemo, useRef} from 'react'
import {Upload} from 'antd'
import type {UploadProps} from 'antd'
import {setAriaHiddenIfNotExists} from '../hooks'
import {fieldsCategory} from './categories'
import {InputCell} from './components/InputCell'
import {Labeled} from './components/Labeled'
import {useTouchOnEvent} from './hooks/useTouchOnEvent'

// Migrated from RSuite Uploader to Ant Design Upload
// Key differences:
// - action, accept, multiple props are mostly compatible
// - fileList format may need transformation
// - Event handlers (onChange, onSuccess, onError) have different signatures

/**
 * Props for the RsUploader component.
 * Migrated to use Ant Design Upload.
 */
export interface RsUploaderProps extends UploadProps {
  /**
   * Whether to use a custom element for the uploader.
   */
  customElement: boolean
  /**
   * The label for the uploader.
   */
  label?: string
}

/**
 * A file uploader component that allows users to select and upload files.
 * Migrated from RSuite Uploader to Ant Design Upload.
 * @param props the component props.
 * @param props.customElement whether to use a custom element for the uploader.
 * @param props.children the custom content when customElement is true.
 * @param props.disabled whether the uploader is disabled.
 * @param props.multiple whether multiple files can be selected.
 * @param props.fileList the list of uploaded files.
 * @param props.className the CSS class name for the component.
 * @param props.label the label for the uploader.
 * @returns the React element.
 */
const RsUploader = ({customElement, children, disabled, multiple, fileList, className, label, ...props}: RsUploaderProps) => {
  const uploaderRef = useRef<any>(null)
  const onRemove = useTouchOnEvent(props, 'onRemove')

  useEffect(() => {
    const fileInput = uploaderRef.current?.nativeElement?.querySelector('input[type="file"]')
    setAriaHiddenIfNotExists(fileInput)
    if (fileInput && !fileInput.hasAttribute('tabIndex')) {
      fileInput.setAttribute('tabIndex', '-1')
    }
  }, [])

  const canUpload = useMemo(() => {
    if (multiple) return true
    return !(fileList && fileList.length > 0)
  }, [fileList, multiple])

  const disabledButton = useMemo(() => disabled || !canUpload, [disabled, canUpload])

  return <Labeled label={label} className={className} passAriaToChildren={true}>
    <Upload {...props} disabled={disabledButton} multiple={multiple}
              fileList={fileList} onRemove={onRemove} ref={uploaderRef}>
      {customElement ? <div>{children}</div> : undefined}
    </Upload>
  </Labeled>
}

const columns = [
  {name: 'name', input: InputCell},
  {name: 'fileKey', input: InputCell},
  {name: 'url', input: InputCell}
]

export const rsUploader = define(RsUploader, 'RsUploader')
  .name('Uploader')
  .category(fieldsCategory)
  .props({
    label: string,
    action: string.required.default('/'),
    accept: string,
    // autoUpload removed - Ant Design Upload uploads automatically by default
    customElement: boolean.default(false),
    children: node,
    // disableMultipart removed - not in Ant Design
    disabled: disabled.default(false),
    // readOnly removed - not supported in Ant Design Upload
    // disabledFileItem removed - not in Ant Design
    // draggable removed - use Upload.Dragger instead
    // fileListVisible removed - use showUploadList prop
    showUploadList: boolean.default(true),
    listType: oneOf('text', 'picture', 'picture-card', 'picture-circle')
      .default('text')
      .withEditorProps({creatable: false}),
    method: string,
    multiple: boolean.default(false),
    name: string,
    onChange: event,
    // onError removed - use onChange to handle errors
    onPreview: event,
    // onProgress removed - use onChange to handle progress
    onRemove: event,
    // onReupload removed - not in Ant Design
    // onSuccess removed - use onChange to handle success
    // onUpload removed - not in Ant Design
    // removable removed - controlled by showUploadList
    // timeout removed - not in Ant Design
    withCredentials: boolean.default(false),
    fileList: array
      .withEditorProps({columns})
      .valued
  })
