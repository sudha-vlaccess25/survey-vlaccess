// src/SubLocationSelector.jsx
import React, { useState } from "react";
import {
  PlusIcon,
  TrashIcon,
  LinkIcon,
  UploadCloudIcon,
  CheckCircleIcon,
  SpinnerIcon,
  LocationMarkerIcon,
} from "./Icons.jsx";

const createNewLocation = () => ({
  id: Date.now(),
  name: "",
  lat: "",
  lng: "",
  isDetecting: false,
  error: null,
});

const SubLocationSelector = () => {
  const [locations, setLocations] = useState([createNewLocation()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const addLocationRow = () => {
    setLocations([...locations, createNewLocation()]);
  };

  const removeLocationRow = (id) => {
    if (locations.length <= 1) return;
    setLocations(locations.filter((loc) => loc.id !== id));
  };

  const handleLocationChange = (id, field, value) => {
    setLocations(
      locations.map((loc) =>
        loc.id === id ? { ...loc, [field]: value, error: null } : loc
      )
    );
  };

  const handleAutoDetect = (id) => {
    setLocations((prev) =>
      prev.map((loc) =>
        loc.id === id ? { ...loc, isDetecting: true, error: null } : loc
      )
    );

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocations((prev) =>
          prev.map((loc) =>
            loc.id === id
              ? {
                  ...loc,
                  lat: latitude.toFixed(4),
                  lng: longitude.toFixed(4),
                  isDetecting: false,
                  error: null,
                }
              : loc
          )
        );
      },
      (error) => {
        console.error("Error getting location:", error);
        const errorMessage =
          "Could not fetch location. Please ensure location services are enabled and permission is granted.";
        setLocations((prev) =>
          prev.map((loc) =>
            loc.id === id
              ? { ...loc, isDetecting: false, error: errorMessage }
              : loc
          )
        );
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    console.log("Submitting Locations:", JSON.stringify(locations, null, 2));

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setLocations([createNewLocation()]); // Reset form

      setTimeout(() => setSubmitStatus(null), 3000);
    }, 2000);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Geo-Coding / Sub Location
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Select the GeoCoding / sub location where the devices will be required
        to install.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-4 items-center p-4 rounded-lg border border-gray-200 animate-fade-in"
            >
              {/* Location Name Input */}
              <div className="md:col-span-4">
                <label
                  htmlFor={`loc-name-${loc.id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location Name
                </label>
                <input
                  type="text"
                  id={`loc-name-${loc.id}`}
                  value={loc.name}
                  onChange={(e) =>
                    handleLocationChange(loc.id, "name", e.target.value)
                  }
                  placeholder="e.g., Main Gate"
                  className="block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* Latitude Input */}
              <div className="md:col-span-2">
                <label
                  htmlFor={`loc-lat-${loc.id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Latitude
                </label>
                <input
                  type="text"
                  id={`loc-lat-${loc.id}`}
                  value={loc.lat}
                  onChange={(e) =>
                    handleLocationChange(loc.id, "lat", e.target.value)
                  }
                  placeholder="20.2961"
                  className="block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* Longitude Input */}
              <div className="md:col-span-2">
                <label
                  htmlFor={`loc-lng-${loc.id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Longitude
                </label>
                <input
                  type="text"
                  id={`loc-lng-${loc.id}`}
                  value={loc.lng}
                  onChange={(e) =>
                    handleLocationChange(loc.id, "lng", e.target.value)
                  }
                  placeholder="85.8245"
                  className="block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* Auto-Detect and Open Map Button */}
              <div className="md:col-span-1 flex items-end pt-5 justify-center">
                <button
                  type="button"
                  onClick={() => handleAutoDetect(loc.id)}
                  disabled={loc.isDetecting}
                  className="p-2 text-gray-500 rounded-full hover:bg-indigo-100 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:cursor-wait disabled:text-indigo-400"
                  aria-label="Auto-detect location"
                >
                  {loc.isDetecting ? (
                    <SpinnerIcon className="text-indigo-600" />
                  ) : (
                    <LocationMarkerIcon />
                  )}
                </button>
              </div>

              {/* Google Maps Link */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link
                </label>
                {loc.lat && loc.lng ? (
                  <a
                    href={`https://www.google.com/maps?q=${loc.lat},${loc.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium p-2 rounded-md bg-indigo-50 hover:bg-indigo-100 transition-colors"
                  >
                    <LinkIcon className="mr-2" />
                    Open Map
                  </a>
                ) : (
                  <div className="flex items-center text-sm text-gray-400 p-2 rounded-md bg-gray-100">
                    <LinkIcon className="mr-2" />
                    Enter coordinates
                  </div>
                )}
              </div>

              {/* Remove Button */}
              <div className="md:col-span-1 flex items-end justify-end">
                <button
                  type="button"
                  onClick={() => removeLocationRow(loc.id)}
                  disabled={locations.length <= 1}
                  className="p-2 text-gray-400 rounded-full hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:hover:bg-transparent disabled:text-gray-300 disabled:cursor-not-allowed"
                  aria-label="Remove location"
                >
                  <TrashIcon />
                </button>
              </div>
              {loc.error && (
                <p className="md:col-span-12 text-sm text-red-600 -mt-2">
                  {loc.error}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-5">
          <button
            type="button"
            onClick={addLocationRow}
            className="inline-flex items-center px-3 py-1.5 border border-dashed border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="mr-2" />
            Add Another Location
          </button>
          <div className="flex items-center">
            {submitStatus === "success" && (
              <div className="flex items-center text-green-600 mr-4 animate-fade-in">
                <CheckCircleIcon className="mr-1" />
                <span>Successfully Saved!</span>
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center items-center py-1.5 px-5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Locations"}
              {!isSubmitting && <UploadCloudIcon className="ml-2 h-5 w-5" />}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SubLocationSelector;
