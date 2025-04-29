import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './LoginPage/login';
import Dashboard from './DashboardPage/dashboard';
import Layout from './ProfInterface/Layout';
import RequestPage from './ProfInterface/DashboardPage/RequestPage/RequestPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="request" element={<RequestPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
