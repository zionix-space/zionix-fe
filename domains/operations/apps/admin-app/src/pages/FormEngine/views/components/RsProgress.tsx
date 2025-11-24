import {boolean, color, define, number, oneOf, string} from '@zionix-formEngine/core'
import {Progress} from 'antd'
import {staticCategory} from './categories'

// Migrated from RSuite to Ant Design Progress
const rsCommonProgressProps = {
  classPrefix: string.default('progress'),
  percent: number.default(50)
    .withEditorProps({min: 0, max: 100})
    .dataBound,
  showInfo: boolean.default(true),
  status: oneOf('success', 'exception', 'active')
    .default('active')
    .withEditorProps({creatable: false}),
  strokeColor: color,
  strokeWidth: number,
}

// RsProgressCircle uses type="circle"
export const rsProgressCircle = define(Progress, 'RsProgressCircle')
  .name('Progress circle')
  .category(staticCategory)
  .props({
    ...rsCommonProgressProps,
    type: oneOf('circle', 'dashboard').default('circle').withEditorProps({creatable: false}),
    // gapDegree and gapPosition compatible
    gapDegree: number.withEditorProps({min: 0, max: 360}),
    gapPosition: oneOf('right', 'top', 'bottom', 'left')
      .default('top')
      .withEditorProps({creatable: false}),
    strokeLinecap: oneOf('round', 'square', 'butt')
      .default('round')
      .withEditorProps({creatable: false}),
    strokeWidth: number.default(6),
    trailColor: color,
    // trailWidth removed - not in Ant Design
  })

// RsProgressLine uses type="line"
export const rsProgressLine = define(Progress, 'RsProgressLine')
  .name('Progress line')
  .category(staticCategory)
  .props({
    ...rsCommonProgressProps,
    type: oneOf('line').default('line').withEditorProps({creatable: false}),
    // vertical removed - Ant Design uses different approach
  })
