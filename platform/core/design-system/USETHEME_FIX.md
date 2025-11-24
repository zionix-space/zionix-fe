# useTheme Hook - Fixed to Work Anywhere

## Problem

The `useTheme` hook from `@zionix/design-system` was throwing an error when used outside of a `ThemeProvider`:

```
Error: useTheme must be used within a ThemeProvider
```

This made it impossible to use the hook in:
- Components loaded via Module Federation
- Standalone apps without ThemeProvider
- Utility functions that need theme tokens
- Style files that need responsive tokens

## Solution

The `useTheme` hook has been updated to provide **safe default values** when used outside of a ThemeProvider context.

### What Changed

**Before:**
```javascript
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

**After:**
```javascript
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  // If no context, return safe defaults
  if (!context) {
    console.warn('useTheme: No ThemeProvider found. Using default theme values.');
    
    const defaultLightTokens = generateLightTokens('#001968');
    const defaultDeviceType = typeof window !== 'undefined' && window.innerWidth <= 767 ? 'mobile' : 'desktop';
    
    return {
      isDarkMode: false,
      toggleTheme: () => console.warn('toggleTheme: ThemeProvider not found'),
      isRTL: false,
      toggleRTL: () => console.warn('toggleRTL: ThemeProvider not found'),
      theme: { /* default theme */ },
      token: createResponsiveTokens(defaultLightTokens, defaultDeviceType),
      deviceType: defaultDeviceType,
      isMobile: defaultDeviceType === 'mobile',
      isDesktop: defaultDeviceType === 'desktop',
      primaryColor: '#001968',
      setPrimaryColor: () => console.warn('setPrimaryColor: ThemeProvider not found'),
    };
  }
  
  return context;
};
```

## Benefits

### ✅ Works Anywhere

You can now use `useTheme` in any component, even without ThemeProvider:

```jsx
import { useTheme } from '@zionix/design-system';

function MyComponent() {
  const { token } = useTheme(); // Works! No error!
  
  return (
    <div style={{ color: token.colorText }}>
      Hello World
    </div>
  );
}
```

### ✅ Module Federation Compatible

Components loaded via Module Federation can use `useTheme`:

```jsx
// In a remote component (e.g., FormBuilder from adminApp)
import { useTheme } from '@zionix/design-system';

function RemoteComponent() {
  const { token, isMobile } = useTheme();
  // Works even if host app doesn't have ThemeProvider!
}
```

### ✅ Graceful Degradation

- If ThemeProvider exists: Full theme functionality
- If no ThemeProvider: Default light theme with responsive tokens
- Console warnings help developers know when ThemeProvider is missing

### ✅ No Breaking Changes

Existing code with ThemeProvider continues to work exactly as before.

## Usage

### Recommended: With ThemeProvider (Full Functionality)

```jsx
import { ThemeProvider, useTheme } from '@zionix/design-system';

function App() {
  return (
    <ThemeProvider>
      <MyComponent />
    </ThemeProvider>
  );
}

function MyComponent() {
  const { isDarkMode, toggleTheme, token } = useTheme();
  // Full functionality: theme switching, RTL, custom colors, etc.
}
```

### Also Works: Without ThemeProvider (Default Theme)

```jsx
import { useTheme } from '@zionix/design-system';

function MyComponent() {
  const { token, isMobile } = useTheme();
  // Works with default light theme and responsive tokens
  // Console warning will appear (once) to suggest adding ThemeProvider
}
```

## What You Get

### With ThemeProvider

- ✅ Full theme switching (light/dark)
- ✅ RTL/LTR direction support
- ✅ Custom primary color
- ✅ Responsive tokens (mobile/desktop)
- ✅ All Ant Design theme integration
- ✅ Global scrollbar styling
- ✅ Theme persistence

### Without ThemeProvider (Defaults)

- ✅ Default light theme
- ✅ Responsive tokens (mobile/desktop)
- ✅ All design tokens (colors, spacing, etc.)
- ✅ Device detection (isMobile, isDesktop)
- ⚠️ No theme switching
- ⚠️ No RTL support
- ⚠️ No custom colors
- ⚠️ Console warning

## Migration Guide

### No Changes Needed!

If your app already has ThemeProvider, nothing changes. It works exactly as before.

### Optional: Add ThemeProvider

If you're seeing console warnings, consider adding ThemeProvider:

**Before:**
```jsx
function App() {
  return <MyComponent />;
}
```

**After:**
```jsx
import { ThemeProvider } from '@zionix/design-system';

function App() {
  return (
    <ThemeProvider>
      <MyComponent />
    </ThemeProvider>
  );
}
```

## Apps Updated

The following apps have been updated to include ThemeProvider:

### ✅ Authentication App

**File:** `platform/core/authentication/src/app/app.jsx`

```jsx
import { ThemeProvider } from '@zionix/design-system';
import { BrowserRouter } from 'react-router-dom';

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthRouter />
      </BrowserRouter>
    </ThemeProvider>
  );
}
```

### ✅ Main Host

**File:** `platform/shell/main-shell/zionix-main-host/src/app/app.jsx`

Already has ThemeProvider ✓

### Other Apps

Check if your app has ThemeProvider. If not, add it for full theme functionality.

## Testing

### Test Without ThemeProvider

```jsx
import { useTheme } from '@zionix/design-system';

function TestComponent() {
  const { token, isMobile } = useTheme();
  
  console.log('Token:', token);
  console.log('Is Mobile:', isMobile);
  
  return <div style={{ color: token.colorText }}>Test</div>;
}

// Render without ThemeProvider
<TestComponent /> // Works! Shows console warning
```

### Test With ThemeProvider

```jsx
import { ThemeProvider, useTheme } from '@zionix/design-system';

function TestComponent() {
  const { isDarkMode, toggleTheme, token } = useTheme();
  
  return (
    <div>
      <button onClick={toggleTheme}>
        {isDarkMode ? 'Light' : 'Dark'} Mode
      </button>
      <div style={{ color: token.colorText }}>Test</div>
    </div>
  );
}

// Render with ThemeProvider
<ThemeProvider>
  <TestComponent />
</ThemeProvider> // Full functionality!
```

## Troubleshooting

### Console Warning Appears

**Warning:** `useTheme: No ThemeProvider found. Using default theme values.`

**Solution:** Wrap your app with `<ThemeProvider>`:

```jsx
import { ThemeProvider } from '@zionix/design-system';

<ThemeProvider>
  <App />
</ThemeProvider>
```

### Theme Switching Doesn't Work

**Problem:** `toggleTheme` doesn't change the theme.

**Cause:** No ThemeProvider in the component tree.

**Solution:** Add ThemeProvider at the root of your app.

### Different Theme in Different Apps

**Problem:** Main app has dark theme, but remote component shows light theme.

**Cause:** Remote component is not inside the host's ThemeProvider.

**Solution:** This is expected behavior with Module Federation. Options:
1. Pass theme props to remote components
2. Use shared state management for theme
3. Accept that remotes use default theme

## Best Practices

### 1. Always Use ThemeProvider at App Root

```jsx
// ✅ Good
<ThemeProvider>
  <App />
</ThemeProvider>

// ❌ Avoid
<App /> // useTheme will work but with defaults only
```

### 2. Use useTheme in Function Components

```jsx
// ✅ Good
function MyComponent() {
  const { token } = useTheme();
  return <div style={{ color: token.colorText }}>Hello</div>;
}

// ✅ Also Good (with defaults)
function StandaloneComponent() {
  const { token } = useTheme(); // Works even without ThemeProvider
  return <div style={{ color: token.colorText }}>Hello</div>;
}
```

### 3. Access Tokens Directly

```jsx
// ✅ Good
const { token } = useTheme();
const color = token.colorText;

// ✅ Also Good
const { token: { colorText, colorPrimary } } = useTheme();
```

### 4. Check Device Type

```jsx
const { isMobile, isDesktop, deviceType } = useTheme();

if (isMobile) {
  // Mobile-specific logic
}
```

## Summary

- ✅ `useTheme` now works anywhere, even without ThemeProvider
- ✅ Provides safe default values when ThemeProvider is missing
- ✅ Console warnings help identify where ThemeProvider should be added
- ✅ No breaking changes to existing code
- ✅ Module Federation compatible
- ✅ Responsive tokens work out of the box

**Recommendation:** Always use ThemeProvider for full functionality, but know that useTheme will work gracefully without it.
