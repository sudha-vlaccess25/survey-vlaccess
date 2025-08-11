import React from 'react';

const types = ['Surveillance', 'Industrial Surveillance'];

const ImplementationVerticals = ({ selectedType, onTypeChange }) => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Implementation Vertical
      </h2>
      <p className="text-gray-500 mb-8 text-center">
        Please select the type of implementation for this survey.
      </p>

      <fieldset>
        <legend className="sr-only">Implementation Type</legend>
        <div className="space-y-4">
          {types.map((type) => {
            const isSelected = selectedType === type;
            return (
              <label
                key={type}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                  isSelected
                    ? 'bg-green-50 border-green-500 ring-2 ring-green-500'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="implementationType"
                  value={type}
                  checked={isSelected}
                  onChange={() => onTypeChange(type)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <span className="ml-3 font-medium text-gray-800">{type}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
};

export default ImplementationVerticals;
