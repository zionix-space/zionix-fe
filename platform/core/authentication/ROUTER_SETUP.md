# Router Setup - Authentication App

## Architecture

The authentication app is designed to work in two modes:

### 1. Standalone Mode
When running independently (e.g., `nx serve authApp`), the app has its own `BrowserRouter` in the bootstrap file.

### 2. Remote Module Mode
When loaded by the main host via Module Federation, the app uses the router context provided by the host.

## File Structure

### bootstrap.jsx (Standalone Entry)
```jsx
import { BrowserRouter } from 'react-router-dom';
import App from './app/app';

// Provides BrowserRouter for standalone mode
root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

### app/app.jsx (Module Export)
```jsx
import { ThemeProvider } from '@zionix/design-system';
import AuthRouter from '../components/AuthRouter';

// No BrowserRouter here - uses context from host or bootstrap
export function App() {
  return (
    <ThemeProvider>
      <AuthRouter />
    </ThemeProvider>
  );
}
```

### remote-entry.js (Module Federation Export)
```jsx
export { default } from "./app/app";
```

## How It Works

### Standalone Mode (Development)
```
bootstrap.jsx
  └─ BrowserRouter
      └─ App
          └─ ThemeProvider
              └─ AuthRouter (uses router context)
```

### Remote Module Mode (Production/Host)
```
Main Host
  └─ BrowserRouter (provided by host)
      └─ ... other routes
          └─ Auth App (loaded remotely)
              └─ ThemeProvider
                  └─ AuthRouter (uses host's router context)
```

## Why This Pattern?

### Problem: Nested Routers
If both the host and the remote module have `BrowserRouter`, you get:
```
Error: You cannot render a <Router> inside another <Router>
```

### Solution: Conditional Router
- **bootstrap.jsx**: Adds router for standalone mode
- **app/app.jsx**: No router, uses context from parent
- **remote-entry.js**: Exports app without router

This allows:
- ✅ Standalone development: `nx serve authApp` works
- ✅ Remote loading: Host can load the module without router conflicts
- ✅ Shared router context: Routes work seamlessly

## Running the App

### Standalone Development
```bash
nx serve authApp
```
Access at: `http://localhost:4202`

Routes work because bootstrap.jsx provides BrowserRouter.

### As Remote Module
```bash
# Start main host
nx serve zionix-main-host

# Auth app is loaded remotely
# Uses host's BrowserRouter
```

## Best Practices

### 1. Never Add BrowserRouter to app/app.jsx
```jsx
// ❌ Wrong - causes nested router error
export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthRouter />
      </ThemeProvider>
    </BrowserRouter>
  );
}

// ✅ Correct - uses parent router context
export function App() {
  return (
    <ThemeProvider>
      <AuthRouter />
    </ThemeProvider>
  );
}
```

### 2. Add Router Only in Bootstrap
```jsx
// ✅ Correct - bootstrap.jsx only
root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

### 3. Use Router Hooks Freely
```jsx
// ✅ Works in both modes
import { useNavigate, useLocation } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  // Router context is available from parent
}
```

## Troubleshooting

### Error: "You cannot render a <Router> inside another <Router>"

**Cause:** BrowserRouter is in both host and remote module.

**Solution:** Remove BrowserRouter from `app/app.jsx`. Keep it only in `bootstrap.jsx`.

### Routes Don't Work in Standalone Mode

**Cause:** Missing BrowserRouter in bootstrap.jsx.

**Solution:** Add BrowserRouter to bootstrap.jsx:
```jsx
root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

### Routes Don't Work When Loaded Remotely

**Cause:** Host doesn't have BrowserRouter.

**Solution:** Ensure host app has BrowserRouter:
```jsx
// In main host app
<BrowserRouter>
  <AppRouter />
</BrowserRouter>
```

## Other Apps

This pattern applies to all micro-frontends:

- **Admin App**: Same pattern (router in bootstrap, not in app)
- **Other Remote Apps**: Follow this pattern for Module Federation compatibility

## Summary

- ✅ BrowserRouter in `bootstrap.jsx` for standalone mode
- ✅ No BrowserRouter in `app/app.jsx` (exported module)
- ✅ ThemeProvider in `app/app.jsx` for theme support
- ✅ Router hooks work in both modes
- ✅ No nested router errors
