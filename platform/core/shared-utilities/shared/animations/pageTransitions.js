/**
 * @fileoverview Global Page Transition Animations for Remote Apps
 * 
 * Centralized animation configurations using Framer Motion for consistent
 * smooth transitions across all 50+ remote apps and screens.
 * 
 * USAGE EXAMPLES:
 * 
 * 1. Simple page wrapper (recommended for most pages):
 *    import { PageTransitionWrapper } from '@zionix/shared-utilities/animations';
 *    <PageTransitionWrapper><YourContent /></PageTransitionWrapper>
 * 
 * 2. With AnimatePresence for route transitions:
 *    import { AnimatePresence } from 'framer-motion';
 *    import { PageTransitionWrapper } from '@zionix/shared-utilities/animations';
 *    <AnimatePresence mode="wait">
 *      <PageTransitionWrapper key={location.pathname}>
 *        <Outlet />
 *      </PageTransitionWrapper>
 *    </AnimatePresence>
 * 
 * 3. Custom variants:
 *    import { slideTransition } from '@zionix/shared-utilities/animations';
 *    <motion.div {...slideTransition}><Content /></motion.div>
 * 
 * 4. Stagger animations for lists:
 *    import { staggerTransition } from '@zionix/shared-utilities/animations';
 *    <motion.div {...staggerTransition.container}>
 *      {items.map(item => (
 *        <motion.div key={item.id} {...staggerTransition.item}>
 *          {item.content}
 *        </motion.div>
 *      ))}
 *    </motion.div>
 * 
 * @author Zionix Platform Team
 * @version 1.0.0
 */

/**
 * Standard easing curves for smooth animations
 */
export const easings = {
    // Apple-style smooth easing
    smooth: [0.25, 0.46, 0.45, 0.94],
    // Snappy easing for quick interactions
    snappy: [0.4, 0, 0.2, 1],
    // Elastic bounce for playful interactions
    elastic: [0.68, -0.55, 0.265, 1.55],
    // Standard ease out
    easeOut: [0.0, 0.0, 0.2, 1],
    // Standard ease in
    easeIn: [0.4, 0.0, 1, 1],
};

/**
 * Standard animation durations (in seconds)
 */
export const durations = {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
    verySlow: 0.8,
};

/**
 * Page transition variants - Smooth fade with subtle slide
 * Best for main content area transitions
 */
export const pageTransitionVariants = {
    initial: {
        opacity: 0,
        y: 8,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: durations.normal,
            ease: easings.smooth,
        },
    },
    exit: {
        opacity: 0,
        y: -8,
        transition: {
            duration: durations.fast,
            ease: easings.smooth,
        },
    },
};

/**
 * Slide transition variants - For drawer/modal content
 */
export const slideTransitionVariants = {
    initial: {
        opacity: 0,
        x: 20,
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: durations.normal,
            ease: easings.smooth,
        },
    },
    exit: {
        opacity: 0,
        x: -20,
        transition: {
            duration: durations.fast,
            ease: easings.smooth,
        },
    },
};

/**
 * Scale transition variants - For cards and modals
 */
export const scaleTransitionVariants = {
    initial: {
        opacity: 0,
        scale: 0.95,
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: durations.normal,
            ease: easings.smooth,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: {
            duration: durations.fast,
            ease: easings.smooth,
        },
    },
};

/**
 * Fade transition variants - Simple fade in/out
 */
export const fadeTransitionVariants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: durations.normal,
            ease: easings.smooth,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: durations.fast,
            ease: easings.smooth,
        },
    },
};

/**
 * Stagger children animation - For lists and grids
 */
export const staggerContainerVariants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.03,
            staggerDirection: -1,
        },
    },
};

export const staggerItemVariants = {
    initial: {
        opacity: 0,
        y: 10,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: durations.fast,
            ease: easings.smooth,
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: {
            duration: durations.fast,
            ease: easings.smooth,
        },
    },
};

/**
 * Default page transition configuration
 * Use this for most page transitions
 */
export const pageTransition = {
    variants: pageTransitionVariants,
    initial: 'initial',
    animate: 'animate',
    exit: 'exit',
};

/**
 * Slide transition configuration
 */
export const slideTransition = {
    variants: slideTransitionVariants,
    initial: 'initial',
    animate: 'animate',
    exit: 'exit',
};

/**
 * Scale transition configuration
 */
export const scaleTransition = {
    variants: scaleTransitionVariants,
    initial: 'initial',
    animate: 'animate',
    exit: 'exit',
};

/**
 * Fade transition configuration
 */
export const fadeTransition = {
    variants: fadeTransitionVariants,
    initial: 'initial',
    animate: 'animate',
    exit: 'exit',
};

/**
 * Stagger transition configuration
 */
export const staggerTransition = {
    container: {
        variants: staggerContainerVariants,
        initial: 'initial',
        animate: 'animate',
        exit: 'exit',
    },
    item: {
        variants: staggerItemVariants,
    },
};
