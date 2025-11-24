import styled from '@emotion/styled'
import {Spin} from 'antd'

// Migrated from RSuite Loader to Ant Design Spin
// Updated CSS variable from --rs-bg-overlay to a standard color
export const SLoader = styled(Spin)`
  && {
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    width: 100%;
    padding-block: 10px;
  }
`
