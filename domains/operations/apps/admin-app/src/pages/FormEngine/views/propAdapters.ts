/**
 * Utility functions for adapting RSuite props to Ant Design props.
 * These adapters handle the differences between the two UI libraries.
 */

/**
 * Maps RSuite size values to Ant Design size values.
 * RSuite uses: 'xs' | 'sm' | 'md' | 'lg'
 * Ant Design uses: 'small' | 'middle' | 'large'
 * 
 * @param size the RSuite size value
 * @returns the equivalent Ant Design size value
 * 
 * @example
 * mapSize('xs') // returns 'small'
 * mapSize('md') // returns 'middle'
 * mapSize('lg') // returns 'large'
 */
export const mapSize = (size?: 'xs' | 'sm' | 'md' | 'lg'): 'small' | 'middle' | 'large' | undefined => {
  if (!size) return undefined
  
  const sizeMap: Record<string, 'small' | 'middle' | 'large'> = {
    xs: 'small',
    sm: 'small',
    md: 'middle',
    lg: 'large'
  }
  
  return sizeMap[size] || 'middle'
}

/**
 * Maps RSuite placement values to Ant Design placement values.
 * RSuite uses: bottomStart, bottomEnd, topStart, topEnd, leftStart, rightStart, leftEnd, rightEnd
 * Ant Design uses: top, left, right, bottom, topLeft, topRight, bottomLeft, bottomRight, leftTop, leftBottom, rightTop, rightBottom
 * 
 * @param placement the RSuite placement value
 * @returns the equivalent Ant Design placement value
 * 
 * @example
 * mapPlacement('bottomStart') // returns 'bottomLeft'
 * mapPlacement('topEnd') // returns 'topRight'
 */
export const mapPlacement = (placement?: string): string | undefined => {
  if (!placement) return undefined
  
  const placementMap: Record<string, string> = {
    bottomStart: 'bottomLeft',
    bottomEnd: 'bottomRight',
    topStart: 'topLeft',
    topEnd: 'topRight',
    leftStart: 'leftTop',
    leftEnd: 'leftBottom',
    rightStart: 'rightTop',
    rightEnd: 'rightBottom'
  }
  
  return placementMap[placement] || placement
}

/**
 * Converts date-fns format strings to dayjs format strings.
 * RSuite uses date-fns format syntax
 * Ant Design uses dayjs format syntax
 * 
 * Common conversions:
 * - yyyy → YYYY (4-digit year)
 * - yy → YY (2-digit year)
 * - dd → DD (day of month with leading zero)
 * - d → D (day of month without leading zero)
 * - MM → MM (month with leading zero)
 * - M → M (month without leading zero)
 * - HH → HH (24-hour with leading zero)
 * - hh → hh (12-hour with leading zero)
 * - mm → mm (minutes)
 * - ss → ss (seconds)
 * - a → A (AM/PM)
 * 
 * @param format the date-fns format string
 * @returns the equivalent dayjs format string
 * 
 * @example
 * convertDateFormat('yyyy-MM-dd') // returns 'YYYY-MM-DD'
 * convertDateFormat('dd/MM/yyyy HH:mm') // returns 'DD/MM/YYYY HH:mm'
 */
export const convertDateFormat = (format?: string): string | undefined => {
  if (!format) return undefined
  
  return format
    .replace(/yyyy/g, 'YYYY')
    .replace(/yy/g, 'YY')
    .replace(/dd/g, 'DD')
    .replace(/d/g, 'D')
    .replace(/MMMM/g, 'MMMM')
    .replace(/MMM/g, 'MMM')
    .replace(/MM/g, 'MM')
    .replace(/M/g, 'M')
    .replace(/HH/g, 'HH')
    .replace(/H/g, 'H')
    .replace(/hh/g, 'hh')
    .replace(/h/g, 'h')
    .replace(/mm/g, 'mm')
    .replace(/m/g, 'm')
    .replace(/ss/g, 'ss')
    .replace(/s/g, 's')
    .replace(/a/g, 'A')
}

/**
 * Maps RSuite's cleanable prop to Ant Design's allowClear prop.
 * Both are boolean values with the same meaning, just different names.
 * 
 * @param cleanable the RSuite cleanable value
 * @returns the equivalent Ant Design allowClear value
 * 
 * @example
 * mapCleanable(true) // returns true
 * mapCleanable(false) // returns false
 * mapCleanable(undefined) // returns false
 */
export const mapCleanable = (cleanable?: boolean): boolean => {
  return cleanable ?? false
}

/**
 * Maps RSuite's appearance prop to Ant Design's type prop for buttons.
 * RSuite uses: 'default' | 'primary' | 'link' | 'subtle' | 'ghost'
 * Ant Design uses: 'default' | 'primary' | 'link' | 'text' | 'dashed'
 * 
 * @param appearance the RSuite appearance value
 * @returns the equivalent Ant Design type value
 * 
 * @example
 * mapButtonAppearance('subtle') // returns 'text'
 * mapButtonAppearance('ghost') // returns 'dashed'
 */
export const mapButtonAppearance = (
  appearance?: 'default' | 'primary' | 'link' | 'subtle' | 'ghost'
): 'default' | 'primary' | 'link' | 'text' | 'dashed' | undefined => {
  if (!appearance) return undefined
  
  const appearanceMap: Record<string, 'default' | 'primary' | 'link' | 'text' | 'dashed'> = {
    default: 'default',
    primary: 'primary',
    link: 'link',
    subtle: 'text',
    ghost: 'dashed'
  }
  
  return appearanceMap[appearance] || 'default'
}

/**
 * Maps RSuite's backdrop prop to Ant Design's maskClosable prop for modals.
 * RSuite uses: boolean | 'static'
 * Ant Design uses: boolean
 * - backdrop=true → maskClosable=true (clicking mask closes modal)
 * - backdrop='static' → maskClosable=false (clicking mask doesn't close modal)
 * - backdrop=false → maskClosable=true (default behavior)
 * 
 * @param backdrop the RSuite backdrop value
 * @returns the equivalent Ant Design maskClosable value
 * 
 * @example
 * mapBackdrop('static') // returns false
 * mapBackdrop(true) // returns true
 */
export const mapBackdrop = (backdrop?: boolean | 'static'): boolean => {
  return backdrop !== 'static'
}

/**
 * Maps RSuite's modal size to Ant Design's modal width.
 * RSuite uses: 'xs' | 'sm' | 'md' | 'lg' | 'full'
 * Ant Design uses: number (pixels) | string (percentage)
 * 
 * @param size the RSuite size value
 * @returns the equivalent Ant Design width value
 * 
 * @example
 * mapModalSize('xs') // returns 400
 * mapModalSize('md') // returns 800
 * mapModalSize('full') // returns '100%'
 */
export const mapModalSize = (size?: 'xs' | 'sm' | 'md' | 'lg' | 'full'): number | string | undefined => {
  if (!size) return undefined
  
  const sizeMap: Record<string, number | string> = {
    xs: 400,
    sm: 600,
    md: 800,
    lg: 1000,
    full: '100%'
  }
  
  return sizeMap[size] || 800
}
