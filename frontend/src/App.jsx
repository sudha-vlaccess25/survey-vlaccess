import React from 'react';
import './App.css';
import HeroSection from './layouts/HeroSection';
import ErrorPageNotFound from './errors/ErrorPageNotFound';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Dashboard from './Dashboard/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route element={<AppLayout />}>
        <Route path="/user" element={<HeroSection />} />
      </Route>
      <Route path="*" element={<ErrorPageNotFound />} />
    </Routes>
  );
}

export default App;
