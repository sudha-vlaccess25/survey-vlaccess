import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const SideNavBar = ({ currentStep, setCurrentStep, steps, isOpen, setIsOpen }) => {
  const handleNavigation = (step) => {
    setCurrentStep(step);
    setIsOpen(false);
  };

  return (
    <>
      {/* Backdrop for mobile view */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50 transition-opacity md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <nav
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#111827] text-gray-300 flex flex-col shadow-xl transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:inset-auto md:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6">
          <div className="text-2xl font-bold text-white">Survey</div>
          <button onClick={() => setIsOpen(false)} className="md:hidden">
            <XMarkIcon className="h-6 w-6 text-white" />
          </button>
        </div>
        <ul className="mt-6 px-4 space-y-2 text-left">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            return (
              <li key={step}>
                <button
                  onClick={() => handleNavigation(stepNumber)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-base font-semibold transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gray-700 text-white border-l-4 border-green-500 shadow-md'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {step}
                  {isActive && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
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