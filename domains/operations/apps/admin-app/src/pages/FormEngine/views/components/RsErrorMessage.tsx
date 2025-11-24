import classNames from 'classnames'
import styled from '@emotion/styled'
import type {ErrorWrapperProps} from '@zionix-formEngine/core'
import {define, string, useAriaErrorMessage} from '@zionix-formEngine/core'
import {Typography} from 'antd'
import {placement} from '../commonProperties'
import {staticCategory} from './categories'

const {Text} = Typography

const SDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const SErrorMessage = styled(Text)`
  z-index: 6;
  color: #ff4d4f;
  font-size: 14px;
  line-height: 1.5715;
`

/**
 * The properties of RsErrorMessage component.
 * Migrated from RSuite Form.ErrorMessage to Ant Design Typography.Text.
 */
export interface RsErrorMessageProps extends ErrorWrapperProps {
  /**
   * The placement of an error message.
   */
  placement?: string
}

const RsErrorMessage = ({error, children, className}: RsErrorMessageProps) => {
  const divClassName = error ? 'form-control-wrapper' : undefined
  const aria = useAriaErrorMessage()

  return <SDiv className={classNames(className, divClassName)}>
    {children}
    {error && (
      <SErrorMessage type="danger" id={aria['aria-errormessage']}>
        {error}
      </SErrorMessage>
    )}
  </SDiv>
}

/**
 * Metadata builder for rSuite-based error display component.
 */
export const rsErrorMessage = define(RsErrorMessage, 'RsErrorMessage')
  .name('Error message')
  .category(staticCategory)
  .props({
    placement: placement.default('bottomStart'),
    className: string,
  })
  .componentRole('error-message')
  .hideFromComponentPalette()
