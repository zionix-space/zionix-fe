import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Spin } from 'antd';

const MenuBuilder = React.lazy(() => import('../pages/MenuSetup'));

export function DashboardAdmin() {
  return <b>Admin Dashboard</b>;
}

// Loading fallback component
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh'
  }}>
    <Spin size="large" />
  </div>
);

export function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route exact path="/menu-setup" element={<MenuBuilder />} />
      </Routes>
    </Suspense>
  );
}
export default App;
