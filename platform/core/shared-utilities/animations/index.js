/**
 * @fileoverview Animation Utilities Export
 * 
 * Central export point for all animation utilities and components.
 * Import animations from here to ensure consistency across all remote apps.
 * 
 * @example
 * import { 
 *   PageTransitionWrapper, 
 *   pageTransition,
 *   slideTransition,
 *   easings 
 * } from '@zionix/shared-utilities/animations';
 */

export {
    pageTransitionVariants,
    slideTransitionVariants,
    scaleTransitionVariants,
    fadeTransitionVariants,
    staggerContainerVariants,
    staggerItemVariants,
    pageTransition,
    slideTransition,
    scaleTransition,
    fadeTransition,
    staggerTransition,
    easings,
    durations,
} from '../shared/animations/pageTransitions';

export { PageTransitionWrapper } from '../shared/animations/PageTransitionWrapper';
export { default } from '../shared/animations/PageTransitionWrapper';
