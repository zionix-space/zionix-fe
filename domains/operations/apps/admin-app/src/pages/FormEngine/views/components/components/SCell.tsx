import styled from '@emotion/styled'

/**
 * Styled cell component for table cells.
 * Migrated from RSuite Table.Cell to a generic div-based cell.
 * This provides a simple cell wrapper without RSuite dependencies.
 */
export const SCell = styled.div`
  padding: 9px 3px;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
`
