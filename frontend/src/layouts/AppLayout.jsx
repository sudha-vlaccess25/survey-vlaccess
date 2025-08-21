import SideNavbar from './SideNavBar';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

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

export default AppLayout;