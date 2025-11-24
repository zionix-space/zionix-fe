import {createView} from '@zionix-formEngine/core'
import {models} from './models'

/**
 * An assembled set of rSuite components, ready to be passed as a property to the FormViewer.
 */
export const view = createView(models)
