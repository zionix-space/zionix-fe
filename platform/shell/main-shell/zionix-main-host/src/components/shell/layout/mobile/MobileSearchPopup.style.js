import { useMemo } from "react";

/**
 * Animation variants for the search popup overlay
 */
export const overlayVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

/**
 * Animation variants for the backdrop
 */
export const backdropVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

/**
 * Animation variants for the search popup
 */
export const popupVariants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

/**
 * Custom hook for search popup styles using design tokens
 * @param {Object} token - Design system tokens
 * @returns {Object} Styled components object
 */
export const useStyles = (token) => useMemo(() => ({
  // Overlay container
  overlayStyle: {
    position: 'fixed',
    top: '60px', // Position below mobile header
    left: 0,
    right: 0,
    zIndex: 1050,
    padding: `0 ${token.paddingMD}px`,
  },

  // Backdrop
  backdropStyle: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: -1,
  },

  // Main popup container
  popupStyle: {
    position: 'relative',
    width: '100%',
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadius,
    boxShadow: `0 4px 12px ${token.colorBgMask}`,
    border: `1px solid ${token.colorBorderSecondary}`,
    overflow: 'hidden',
    zIndex: 1,
  },

  // Search section
  searchSectionStyle: {
    padding: `${token.paddingMD}px ${token.paddingMD}px ${token.paddingSM}px`,
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
  },

  // Search form
  searchFormStyle: {
    width: '100%',
  },

  // Search input container
  searchInputContainerStyle: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: token.colorFillQuaternary,
    borderRadius: token.borderRadius,
    border: `1px solid ${token.colorBorder}`,
    transition: `border-color ${token.motionDurationMid} ${token.motionEaseInOut}`,
    '&:focus-within': {
      borderColor: token.colorPrimary,
      boxShadow: `0 0 0 2px ${token.colorPrimaryBg}`,
    },
  },

  // Search icon
  searchIconStyle: {
    fontSize: '16px',
    color: token.colorTextTertiary,
    marginLeft: token.paddingSM,
    marginRight: token.paddingXS,
    flexShrink: 0,
  },

  // Search input
  searchInputStyle: {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: token.fontSize,
    color: token.colorText,
    padding: `${token.paddingSM}px ${token.paddingXS}px`,
    '&::placeholder': {
      color: token.colorTextPlaceholder,
    },
  },

  // Clear button
  clearButtonStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    border: 'none',
    backgroundColor: 'transparent',
    color: token.colorTextTertiary,
    cursor: 'pointer',
    borderRadius: '50%',
    marginRight: token.paddingXS,
    transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
    '&:hover': {
      backgroundColor: token.colorFillSecondary,
      color: token.colorText,
    },
  },

  // Filter section
  filterSectionStyle: {
    padding: `${token.paddingSM}px ${token.paddingMD}px ${token.paddingMD}px`,
  },

  // Filter grid
  filterGridStyle: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: `${token.paddingSM}px`,
  },

  // Filter item
  filterItemStyle: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: `${token.paddingXS}px`,
    borderRadius: token.borderRadius,
    transition: `background-color ${token.motionDurationMid} ${token.motionEaseInOut}`,
    '&:hover': {
      backgroundColor: token.colorFillSecondary,
    },
  },

  // Checkbox container
  checkboxContainerStyle: {
    position: 'relative',
    marginRight: token.paddingSM,
  },

  // Hidden checkbox input
  checkboxInputStyle: {
    position: 'absolute',
    opacity: 0,
    width: 0,
    height: 0,
  },

  // Custom checkbox
  checkboxStyle: {
    width: '16px',
    height: '16px',
    border: `1px solid ${token.colorBorder}`,
    borderRadius: token.borderRadiusSM,
    backgroundColor: token.colorBgContainer,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
  },

  // Checked checkbox
  checkboxCheckedStyle: {
    backgroundColor: token.colorPrimary,
    borderColor: token.colorPrimary,
  },

  // Checkmark icon
  checkmarkStyle: {
    fontSize: '10px',
    color: token.colorWhite,
    lineHeight: 1,
  },

  // Filter label
  filterLabelStyle: {
    fontSize: token.fontSizeSM,
    color: token.colorText,
    userSelect: 'none',
  },


}), [token])