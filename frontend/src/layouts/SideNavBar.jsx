import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const SideNavBar = ({ currentStep, setCurrentStep, steps, isOpen, setIsOpen }) => {
  const handleNavigation = (step) => {
    setCurrentStep(step);
    setIsOpen(false); // Close sidebar on navigation click
  };

  return (
    <>
      {/* Backdrop for mobile view */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-white/40 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <nav
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white p-6 shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:inset-auto lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Survey Sections</h3>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <ul className="space-y-2">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            return (
              <li key={step}>
                <button
                  onClick={() => handleNavigation(stepNumber)}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {step}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default SideNavBar;
