import React from "react";

const NavigationButtons = ({
  onPrevious,
  onNext,
  onSaveDraft,
  onSkip,
  disablePrevious = false,
  disableNext = false,
  isLastPage = false,
  nextText = "Next",
  finishText = "Finish",
}) => {
  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-between sm:items-center bg-white p-4 border-t mt-4 border-gray-200 rounded-lg shadow-sm">
      {/* Previous Button */}
      <button
        type="button"
        onClick={onPrevious}
        disabled={disablePrevious}
        className={`flex items-center justify-center px-4 py-2 rounded-md text-sm transition
          ${
            disablePrevious
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100"
          }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Previous
      </button>

      {/* Right Side Buttons */}
      <div className="flex flex-col sm:flex-row w-full sm:w-auto justify-end items-center gap-3 sm:gap-4">
        {onSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            className="w-full sm:w-auto px-6 py-2 rounded-md text-sm text-gray-800 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
          >
            Save as Draft
          </button>
        )}

        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="w-full sm:w-auto px-6 py-2 rounded-md text-sm text-gray-800 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-sm"

          >
            Skip
          </button>
        )}

        <button
          type={isLastPage ? "submit" : "button"}
          onClick={onNext}
          disabled={disableNext}
          className={`w-full sm:w-auto flex items-center justify-center px-6 py-2 rounded-md text-sm transition
            ${
              disableNext
                ? "bg-indigo-300 text-white cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
        >
          {isLastPage ? finishText : nextText}
          {!isLastPage && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default NavigationButtons;
