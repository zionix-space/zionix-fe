import React from 'react';

// Simple dummy component for the admin remote app
const AdminDummyComponent = () => {
  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center', 
      backgroundColor: '#e8f4fd',
      border: '2px solid #007acc',
      borderRadius: '8px',
      margin: '10px'
    }}>
      <h2 style={{ color: '#007acc', marginBottom: '15px' }}>Admin App - Hello World</h2>
      <p style={{ color: '#333', fontSize: '16px' }}>This is the remote admin application</p>
      <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>
        Successfully loaded as a micro-frontend!
      </p>
    </div>
  );
};

export function App() {
  return <AdminDummyComponent />;
}

export default App;
