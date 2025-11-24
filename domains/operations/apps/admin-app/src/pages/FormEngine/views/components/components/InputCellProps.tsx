/**
 * Generic row data type for table cells.
 * Migrated from rsuite-table to generic type.
 */
export type RowDataType = Record<string, any>

/**
 * React component properties for the {@link InputCell} component.
 * Migrated from rsuite-table types to generic types.
 */
export interface InputCellProps {
  /**
   * The callback function called when the data in a cell is changed.
   * @param value the value.
   * @param dataKey the cell data key.
   * @param rowIndex the cell row index.
   */
  onChange?: (value?: any, dataKey?: string, rowIndex?: number) => void
  /**
   * The cell data key.
   */
  dataKey: string
  /**
   * Rows data.
   */
  rowData: RowDataType
  /**
   * The row index.
   */
  rowIndex?: number
  /**
   * Additional props that can be passed to the cell.
   */
  [key: string]: any
}
