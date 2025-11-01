import { Route, Routes } from 'react-router-dom';
import FormBuilderLibrary from '../pages/FormSetup/Formbuilder/core';
import MenuBuilder from '../pages/MenuSetup';

export function DashboardAdmin() {
  return <b>Admin Dashboard</b>;
}

export function App() {
  return (
    <Routes>
      <Route exact path="/form-setup" element={<FormBuilderLibrary />} />
      <Route exact path="/menu-setup" element={<MenuBuilder />} />
    </Routes>
  );
}
export default App;
