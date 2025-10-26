# 🏗️ Data Layer Architecture

This document describes the organized data layer structure for the Zionix platform, designed for scalability, maintainability, and developer experience. The architecture follows modern React patterns with TanStack Query for server state management and Zustand for client state management.

## 🎯 Overview

The data layer provides a clean separation of concerns with:
- **API Services**: Centralized HTTP client operations
- **Hooks**: Custom React hooks for data fetching and mutations
- **Stores**: Zustand stores for client-side state management
- **Configuration**: TanStack Query setup and query key management

## 📁 Directory Structure

```
src/data/
├── README.md               # This documentation
├── index.js               # Central export point for all data layer modules
├── api/                   # API Services Layer
│   ├── index.js          # API services exports
│   └── menu/             # Menu-related API operations
│       └── menuService.js # Menu CRUD operations
├── config/               # Configuration Layer
│   ├── index.js         # Config exports
│   ├── queryClient.js   # TanStack Query client setup
│   └── queryKeys.js     # Centralized query key factory
├── hooks/               # Custom Hooks Layer
│   ├── index.js        # Hooks exports
│   └── menu/           # Menu-related hooks
│       └── useMenuData.js # Menu data management hook
└── stores/             # State Management Layer
    ├── index.js       # Store exports
    └── menu/          # Menu-related stores
        └── useMenuStore.js # Menu Zustand store