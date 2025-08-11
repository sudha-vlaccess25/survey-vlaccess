import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const GeneralInformationForm = ({
  formData,
  handleChange,
  handleGpsClick,
  handleClearGps,
  gpsMessage,
  gpsMessageColor,
}) => {
  const InputField = ({ id, label, required = false, ...rest }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        name={id}
        value={formData[id]}
        onChange={handleChange}
        required={required}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        {...rest}
      />
    </div>
  );

  return (
    <div className="w-full w-[90%] p-6 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">General Information</h2>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <InputField id="dateOfSurvey" label="Date of Survey" type="date" required />
        <InputField id="surveyTeamName" label="Survey Team Name" required />
        <InputField id="surveyTeamContact" label="Survey Team Contact" required />
        <InputField id="implementationAgencyName" label="Implementation Agency Name" required />
        <InputField id="locationSiteName" label="Location / Site Name" required />
        <InputField id="cityDistrict" label="City / District" required />

        <div className="md:col-span-2">
          <InputField id="zoneSectorWardNumber" label="Zone / Sector / Ward Number" required />
        </div>

        {/* GPS Section */}
        <div className="md:col-span-2 mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GPS Coordinates <span className="text-red-500">*</span>
          </label>

          <div className="flex flex-wrap items-start gap-4 w-full">
            {/* GPS Button */}
            <button
              type="button"
              onClick={handleGpsClick}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              GPS Current Location
            </button>

            {/* Clear Button */}
            {(formData.latitude || formData.longitude) && (
              <button
                type="button"
                onClick={handleClearGps}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Clear Location
              </button>
            )}

          
            {/* Latitude Field */}
            <input
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="Enter Latitude"
              className="block w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            />

            {/* Longitude Field */}
            <input
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="Enter Longitude"
              className="block w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Error Message */}
            {gpsMessage && (
              <p className={`text-sm ${gpsMessageColor} mt-2`}>
                {gpsMessage}
              </p>
            )}
        </div>

        {/* Optional Map Marking */}
        <div className="md:col-span-2">
          <label htmlFor="mapMarking" className="block text-sm font-medium text-gray-700 mb-1">
            Map Marking (Optional)
          </label>
          <textarea
            id="mapMarking"
            name="mapMarking"
            rows="3"
            value={formData.mapMarking}
            onChange={handleChange}
            placeholder="Additional location details or landmarks"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-y"
          />
        </div>
      </form>
    </div>
  );
};

export default GeneralInformationForm;
