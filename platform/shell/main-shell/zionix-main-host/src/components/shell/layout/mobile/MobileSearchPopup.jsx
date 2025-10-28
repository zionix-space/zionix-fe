import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@zionix/design-system";
import { useStyles, overlayVariants, popupVariants, backdropVariants } from "./MobileSearchPopup.style";

/**
 * Mobile Search Popup Component - Responsive search overlay with filter options
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the popup is open
 * @param {Function} props.onClose - Callback function to close the popup
 * @param {Function} [props.onSearch] - Callback function when search is performed
 * @param {Function} [props.onFilterChange] - Callback function when filters change
 */
export const MobileSearchPopup = ({ 
  isOpen, 
  onClose, 
  onSearch,
  onFilterChange 
}) => {
  const { token } = useTheme();
  const styles = useStyles(token);
  const [searchValue, setSearchValue] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const searchInputRef = useRef(null);
  const popupRef = useRef(null);

  // Filter options matching the screenshot
  const filterOptions = [
    { key: 'apps', label: 'Apps' },
    { key: 'auth', label: 'Auth' },
    { key: 'forms', label: 'Forms' },
    { key: 'charts', label: 'Charts' },
    { key: 'data-tables', label: 'Data Tables' },
    { key: 'maps', label: 'Maps' }
  ];

  // Focus search input when popup opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle escape key to close popup
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click to close popup
  const handleBackdropClick = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      onClose();
    }
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    if (onSearch) {
      onSearch(value, selectedFilters);
    }
  };

  // Handle filter checkbox change
  const handleFilterChange = (filterKey) => {
    const newFilters = selectedFilters.includes(filterKey)
      ? selectedFilters.filter(f => f !== filterKey)
      : [...selectedFilters, filterKey];
    
    setSelectedFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
    if (onSearch) {
      onSearch(searchValue, newFilters);
    }
  };

  // Handle search form submission
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (onSearch) {
      onSearch(searchValue, selectedFilters);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          style={styles.overlayStyle}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <motion.div
            style={styles.backdropStyle}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          />

          {/* Search Popup */}
          <motion.div
            ref={popupRef}
            style={styles.popupStyle}
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Section */}
            <div style={styles.searchSectionStyle}>
              <form onSubmit={handleSearchSubmit} style={styles.searchFormStyle}>
                <div style={styles.searchInputContainerStyle}>
                  <i className="ri-search-line" style={styles.searchIconStyle} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search"
                    value={searchValue}
                    onChange={handleSearchChange}
                    style={styles.searchInputStyle}
                  />
                  {searchValue && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchValue("");
                        if (onSearch) {
                          onSearch("", selectedFilters);
                        }
                      }}
                      style={styles.clearButtonStyle}
                      aria-label="Clear search"
                    >
                      <i className="ri-close-line" />
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Filter Options Section */}
            <div style={styles.filterSectionStyle}>
              <div style={styles.filterGridStyle}>
                {filterOptions.map((filter) => (
                  <label
                    key={filter.key}
                    style={styles.filterItemStyle}
                    onClick={() => handleFilterChange(filter.key)}
                  >
                    <div style={styles.checkboxContainerStyle}>
                      <input
                        type="checkbox"
                        checked={selectedFilters.includes(filter.key)}
                        onChange={() => handleFilterChange(filter.key)}
                        style={styles.checkboxInputStyle}
                      />
                      <div 
                        style={{
                          ...styles.checkboxStyle,
                          ...(selectedFilters.includes(filter.key) ? styles.checkboxCheckedStyle : {})
                        }}
                      >
                        {selectedFilters.includes(filter.key) && (
                          <i className="ri-check-line" style={styles.checkmarkStyle} />
                        )}
                      </div>
                    </div>
                    <span style={styles.filterLabelStyle}>{filter.label}</span>
                  </label>
                ))}
              </div>
            </div>


          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileSearchPopup;