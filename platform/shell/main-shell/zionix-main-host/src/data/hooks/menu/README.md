# Menu Data Management Architecture

## Overview

This directory contains the optimized menu data management system that combines **React Query** for server state with **Zustand** for UI state, eliminating redundant caching and providing a clean, scalable architecture.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Component Layer                       │
│  (DesktopTopBar, DesktopSidebar, AppsRedirect, etc.)       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    useMenuData Hook                          │
│  (Unified API combining data + UI state)                    │
└────────┬────────────────────────────────────────────┬───────┘
         │                                            │
         ▼                                            ▼
┌────────────────────┐                    ┌──────────────────┐
│   useMenuQuery     │                    │  useMenuStore    │
│  (React Query)     │                    │   (Zustand)      │
│                    │                    │                  │
│ • Menu data        │                    │ • Selected keys  │
│ • Caching          │                    │ • Open keys      │
│ • Loading states   │                    │ • Collapse state │
│ • Error handling   │                    │                  │
│ • Auto-refetch     │                    │ (UI State Only)  │
└────────┬───────────┘                    └──────────────────┘
         │
         ▼
┌────────────────────┐
│   menuService      │
│  (API Service)     │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│   axiosClient      │
│  (HTTP Client)     │
└────────────────────┘
```

## Key Files

### 1. `useMenuQuery.js`
React Query hook for fetching menu data from the API.

**Features:**
- Automatic caching (10 min stale, 30 min cache)
- Request cancellation support
- Smart retry logic (no retry on 4xx errors)
- Exponential backoff
- Network error handling

**Usage:**
```javascript
import { useMenuQuery } from './useMenuQuery';

const { data, isLoading, isError, error } = useMenuQuery();
```

### 2. `useMenuData.js` ⭐ **Primary Hook**
Unified hook that combines React Query data with Zustand UI state.

**Features:**
- Single source of truth for menu data
- Automatic menu selection
- Computed values (selectedMainMenu, sidebarMenus)
- Helper functions for menu lookup
- Clean API for components

**Usage:**
```javascript
import { useMenuData } from './useMenuData';

const {
  // Data from React Query
  mainMenus,
  selectedMainMenu,
  sidebarMenus,
  profileSection,
  isLoading,
  isError,
  
  // UI State from Zustand
  selectedMainMenuKey,
  selectedSidebarKey,
  openSidebarKeys,
  isMenuCollapsed,
  
  // Actions
  selectMainMenu,
  setSelectedSidebarKey,
  setOpenSidebarKeys,
  toggleMenuCollapse,
} = useMenuData();
```

### 3. `useMenuStore.js` (Zustand)
Lightweight store for UI state only (no data caching).

**Stores:**
- `selectedMainMenuKey` - Currently selected main menu
- `selectedSidebarKey` - Currently selected sidebar item
- `openSidebarKeys` - Expanded menu items
- `isMenuCollapsed` - Sidebar collapse state

**Why Zustand?**
- Persists UI state to localStorage
- No prop drilling
- DevTools support
- Minimal bundle size

## Migration from Old Architecture

### Before (Redundant Caching)
```javascript
// ❌ Old way - data cached in TWO places
const { data } = useMenuQuery(); // React Query cache
const { mainMenus, initializeMenus } = useMenuStore(); // Zustand cache

useEffect(() => {
  if (data) {
    initializeMenus(data); // Manual sync required
  }
}, [data]);
```

### After (Single Source of Truth)
```javascript
// ✅ New way - data cached ONCE in React Query
const { mainMenus, isLoading } = useMenuData();
// That's it! No manual sync needed
```

## Benefits

### 1. **No Redundant Caching**
- Menu data lives in React Query cache only
- Zustand only stores UI state (keys, collapse state)
- No sync issues between caches

### 2. **Automatic Cache Invalidation**
- React Query handles cache invalidation
- No manual cache management needed
- Stale-while-revalidate pattern

### 3. **Better Error Handling**
- Normalized error responses
- Smart retry logic
- Error boundaries support

### 4. **Request Cancellation**
- Automatic cleanup on unmount
- No memory leaks
- Better performance

### 5. **Cleaner Component Code**
- Single hook import
- No manual initialization
- Computed values included

## Best Practices

### ✅ DO

```javascript
// Use useMenuData in components
const { mainMenus, selectMainMenu } = useMenuData();

// Let React Query handle caching
// No need to manually store data

// Use error boundaries for server errors
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### ❌ DON'T

```javascript
// Don't use useMenuQuery directly in components
// Use useMenuData instead
const { data } = useMenuQuery(); // ❌

// Don't store menu data in Zustand
// Let React Query handle it
const { setMainMenus } = useMenuStore(); // ❌

// Don't manually sync data
useEffect(() => {
  if (data) {
    setMainMenus(data); // ❌
  }
}, [data]);
```

## Performance Optimizations

1. **Memoization**: All computed values are memoized
2. **Selective Re-renders**: Only affected components re-render
3. **Request Deduplication**: Multiple components share same query
4. **Background Refetching**: Updates happen in background
5. **Stale-While-Revalidate**: Show cached data while fetching fresh data

## Error Handling

### Network Errors
```javascript
const { isError, error } = useMenuData();

if (error?.isNetworkError) {
  // Show "Check your connection" message
}
```

### Server Errors (5xx)
```javascript
if (error?.isServerError) {
  // Show "Server issues" message
  // Automatically retried 3 times
}
```

### Client Errors (4xx)
```javascript
if (error?.isClientError) {
  // Show "Access denied" or "Not found"
  // NOT retried (no point)
}
```

### Rate Limiting (429)
```javascript
if (error?.status === 429) {
  // Show "Too many requests"
  // NOT retried
}
```

## Testing

```javascript
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMenuData } from './useMenuData';

test('should fetch and return menu data', async () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  const { result, waitFor } = renderHook(() => useMenuData(), { wrapper });

  await waitFor(() => !result.current.isLoading);

  expect(result.current.mainMenus).toBeDefined();
});
```

## Future Enhancements

- [ ] Add prefetching on login
- [ ] Add optimistic updates for menu customization
- [ ] Add offline support with React Query Persist
- [ ] Add menu analytics tracking
- [ ] Add A/B testing support for menu layouts

## Related Documentation

- [React Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [Axios Docs](https://axios-http.com/)
