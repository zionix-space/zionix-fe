import React, { createContext, useContext, useState, useCallback } from 'react';
import { message } from 'antd';

const ViewContext = createContext();

export const useViews = () => {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error('useViews must be used within a ViewProvider');
  }
  return context;
};

export const ViewProvider = ({ children }) => {
  const [sectionViews, setSectionViews] = useState({});
  const [allViews, setAllViews] = useState([]);

  // Add view to a specific section
  const addViewToSection = useCallback((sectionId, view) => {
    setSectionViews(prev => ({
      ...prev,
      [sectionId]: [...(prev[sectionId] || []), view]
    }));
    
    // Also add to global views list if not already there
    setAllViews(prev => {
      const exists = prev.find(v => v.id === view.id);
      return exists ? prev : [...prev, view];
    });
  }, []);

  // Remove view from a specific section
  const removeViewFromSection = useCallback((sectionId, viewId) => {
    setSectionViews(prev => ({
      ...prev,
      [sectionId]: (prev[sectionId] || []).filter(v => v.id !== viewId)
    }));
  }, []);

  // Remove view from all sections
  const removeViewCompletely = useCallback((viewId) => {
    setSectionViews(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(sectionId => {
        updated[sectionId] = updated[sectionId].filter(v => v.id !== viewId);
      });
      return updated;
    });
    
    setAllViews(prev => prev.filter(v => v.id !== viewId));
  }, []);

  // Update a view
  const updateView = useCallback((updatedView) => {
    // Update in all sections
    setSectionViews(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(sectionId => {
        updated[sectionId] = updated[sectionId].map(v => 
          v.id === updatedView.id ? updatedView : v
        );
      });
      return updated;
    });
    
    // Update in global views list
    setAllViews(prev => prev.map(v => 
      v.id === updatedView.id ? updatedView : v
    ));
  }, []);

  // Create a new view
  const createView = useCallback((viewConfig, sectionId = null) => {
    const newView = {
      id: `view-${Date.now()}`,
      name: viewConfig.name || `${viewConfig.type} View`,
      type: viewConfig.type,
      config: viewConfig,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active'
    };

    // Add to global views list
    setAllViews(prev => [...prev, newView]);
    
    // Add to specific section if provided
    if (sectionId) {
      addViewToSection(sectionId, newView);
    }
    
    return newView;
  }, [addViewToSection]);

  // Get views for a specific section
  const getViewsForSection = useCallback((sectionId) => {
    return sectionViews[sectionId] || [];
  }, [sectionViews]);

  // Get all views across all sections
  const getAllViews = useCallback(() => {
    return allViews;
  }, [allViews]);

  // Clear all views
  const clearAllViews = useCallback(() => {
    setSectionViews({});
    setAllViews([]);
  }, []);

  const value = {
    sectionViews,
    allViews,
    addViewToSection,
    removeViewFromSection,
    removeViewCompletely,
    updateView,
    createView,
    getViewsForSection,
    getAllViews,
    clearAllViews
  };

  return (
    <ViewContext.Provider value={value}>
      {children}
    </ViewContext.Provider>
  );
};

export default ViewProvider;