import { Route, Routes } from 'react-router-dom';
import FormBuilderLibrary from '../pages/Formbuilder/core';

export function DashboardAdmin() {
  return <b>Admin Dashboard</b>;
}

export function App() {
  return (
    <Routes>
      <Route exact path="/form-setup" element={<FormBuilderLibrary />} />
    </Routes>
  );
}
export default App;
