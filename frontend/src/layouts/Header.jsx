import React from 'react';

const breadcrumbMap = {
  1: 'Implementation Survey Selection',
  2: 'General Information',
  3: 'Sub Location Information',
  4: 'Infrastructure',
  5: 'Camera Types and Mounting',
  6: 'Announcements',
  7: 'Network Switch',
  8: 'Transreceiver Module',
  9: 'Patch Panel',
  10: 'Rack',
  11: 'UPS and Power Supply',
  12: 'Traffic Availability',
  13: 'Cable',
};

const Header = ({ currentStep, onMenuClick }) => {
  const breadcrumb = breadcrumbMap[currentStep] || 'Page';

  return (
    <>
      <header className="bg-white shadow-sm px-4 py-2 flex items-center justify-between">
        {/* Hamburger Menu for mobile, hidden on large screens */}
        <button onClick={onMenuClick} className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <img className="h-6 w-auto" src="/vlaccess_logo.png" alt="VL-Access Logo" />
          <h1 className="text-lg font-semibold text-gray-800">Survey Application</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">surveyor@vlaccess.com</p>
            <p className="text-xs text-gray-500">Surveyor</p>
          </div>
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm">
            {/* Avatar initials or icon */}
            S
          </div>
        </div>
      </header>

      <nav className="bg-gray-50 px-4 py-2 border-t border-gray-200 text-sm text-gray-600">
        Dashboard <span className="mx-1 text-gray-400">›</span> {breadcrumb}
      </nav>
    </>
  );
};

export default Header;
