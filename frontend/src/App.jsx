import React, { useState } from 'react';
import './App.css';
import Header from './layouts/Header';
import HeroSection from './layouts/HeroSection';
import ErrorPageNotFound from './errors/ErrorPageNotFound';
import { Routes, Route, Outlet } from 'react-router-dom';
import SideNavbar from './layouts/SideNavBar';
// AppLayout now manages the state for the current step.
const AppLayout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    'Implementation Survey Selection',
    'General Information',
    'Sub Location Information',
    'Infrastructure',
    'Camera Types and Mounting',
    'Announcements',
    'Network Switch',
    'Transreceiver Module',
    'Patch Panel',
    'Rack',
    'UPS and Power Supply',
    'Traffic Availability',
    'Cable',
  ];
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 font-sans antialiased">
      <SideNavbar
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        steps={steps}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* The current step is passed to the Header */}
        <Header currentStep={currentStep} onMenuClick={() => setSidebarOpen(true)} />
        {/* The main content area where the Outlet (HeroSection) will be rendered. */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {/* The step, its setter, and steps array are passed down to the HeroSection. */}
          <Outlet context={{ currentStep, setCurrentStep, steps }} />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HeroSection />} />
      </Route>
      <Route path="*" element={<ErrorPageNotFound />} />
    </Routes>
  );
}

export default App;
