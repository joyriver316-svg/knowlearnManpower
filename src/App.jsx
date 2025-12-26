
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import PartnerSearch from './pages/PartnerSearch';
import Simulation from './pages/Simulation';
import AiAgent from './pages/AiAgent';
import Projects from './pages/Projects';
import Admin from './pages/Admin';
// import { Admin } from './pages/Placeholders'; // Removed from Placeholders

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="search" element={<Search />} />
          <Route path="partner-search" element={<PartnerSearch />} />
          <Route path="projects" element={<Projects />} />
          <Route path="ai-agent" element={<AiAgent />} />
          <Route path="simulation" element={<Simulation />} />
          <Route path="admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
