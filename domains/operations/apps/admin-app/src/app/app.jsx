import { Route, Routes } from "react-router-dom";

export function DashboardAdmin() {
  return <b>Admin Dashboard</b>;
}

export function App() {
  return (
    <Routes>
      <Route exact path="/" element={<DashboardAdmin />} />
    </Routes>
  );
}
export default App;
