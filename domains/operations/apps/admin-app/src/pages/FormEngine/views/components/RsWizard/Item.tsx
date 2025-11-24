import styled from '@emotion/styled'
import {Steps} from 'antd'

// Migrated from RSuite to Ant Design Steps
// Ant Design doesn't use Steps.Item directly in the same way
// Instead, we'll use the Steps component with items prop
// This is kept for compatibility but may need refactoring
export const SItem = styled.div`
  z-index: 7;

  &.ant-steps-item-process:not(.active) .ant-steps-item-icon {
    color: var(--ant-text-secondary);
    background-color: initial;
  }

  &.available {
    cursor: pointer;

    &:hover {
      color: var(--ant-primary-color);

      .ant-steps-item-icon {
        border: 2px solid var(--ant-primary-color);
      }
    }
  }

  &.active:hover .ant-steps-item-icon {
    opacity: 0.8;
  }
`
