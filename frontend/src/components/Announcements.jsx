import React, { useState, useRef } from "react";
import {
  PlusIcon,
  TrashIcon,
  UploadCloudIcon,
  CheckCircleIcon,
} from "./Icons.jsx";
import CameraModal from "../cameraTools/CameraModal.jsx";
import ImageUploader from "../cameraTools/ImageUploader.jsx";

// QuantitySelector: Allows increment/decrement of a numeric value
const QuantitySelector = ({ count, setCount, disabled = false }) => {
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count > 0 ? count - 1 : 0);

  return (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        onClick={decrement}
        disabled={disabled || count === 0}
        className={`w-7 h-7 flex items-center justify-center rounded-full text-white text-lg font-bold transition ${
          disabled || count === 0
            ? "bg-red-200 cursor-not-allowed"
            : "bg-red-500 hover:bg-red-600"
        }`}
      >
        -
      </button>
      <span
        className={`text-gray-800 font-medium w-8 text-center ${
          disabled ? "text-gray-400" : ""
        }`}
      >
        {count.toString().padStart(2, "0")}
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={disabled}
        className={`w-7 h-7 flex items-center justify-center rounded-full text-white text-lg font-bold transition ${
          disabled
            ? "bg-green-200 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        +
      </button>
    </div>
  );
};

// Announcement Factory: Creates a new announcement object with default values
const createNewAnnouncement = () => ({
  id: Date.now(), // Unique ID for each announcement row
  device: " ", // Default device type
  remarks: " ", // Remarks for the announcement
  quantity: 0, // Quantity for the device
  images: [], // Array of image data URLs
  error: null, // Error state for validation (if needed)
});

// Announcements Component: Main form for managing announcement rows and image uploads
const Announcements = () => {
  // State for all announcement rows
  const [announcements, setAnnouncements] = useState([createNewAnnouncement()]);
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  // Camera modal state
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  // Tracks which announcement/image is being updated
  const [activeImageState, setActiveImageState] = useState(null);
  // Ref for hidden file input (gallery upload)
  const fileInputRef = useRef(null);

  // Removes an announcement row (if more than one exists)
  const removeAnnouncementRow = (id) => {
    if (announcements.length <= 1) return;
    setAnnouncements(announcements.filter((ann) => ann.id !== id));
  };

  // Updates a field (device, remarks, images, quantity) for a specific announcement row
  const handleAnnouncementChange = (id, field, value) => {
    setAnnouncements((prev) =>
      prev.map((ann) =>
        ann.id === id ? { ...ann, [field]: value, error: null } : ann
      )
    );
  };

  // Opens camera modal for image capture
  const handleTakeImage = (currentImages, onImagesChange) => {
    setActiveImageState({ currentImages, onImagesChange });
    setIsCameraModalOpen(true);
  };

  // Opens file picker for gallery image upload
  const handleGalleryImage = (currentImages, onImagesChange) => {
    setActiveImageState({ currentImages, onImagesChange });
    fileInputRef.current.click();
  };

  // Handles file selection from gallery and updates images
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length && activeImageState) {
      const readers = files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then((results) => {
        const newImages = [...activeImageState.currentImages, ...results];
        activeImageState.onImagesChange(newImages);
        setActiveImageState(null);
      });
    }
    // Reset file input value to allow re-selecting same file
    event.target.value = null;
  };

  // Handles image capture from camera modal and updates images
  const handleCapture = (imageDataUrl) => {
    if (activeImageState) {
      const newImages = [...activeImageState.currentImages, imageDataUrl];
      activeImageState.onImagesChange(newImages);
      setActiveImageState(null);
    }
  };

  // Handles form submission, resets form and shows success message
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    // Simulate API call
    console.log(
      "Submitting Announcements:",
      JSON.stringify(announcements, null, 2)
    );

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setAnnouncements([createNewAnnouncement()]);
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 2000);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm max-w-6xl mx-auto font-sans">
      {/* Title and description */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Announcements</h2>
      <p className="text-sm text-gray-500 mb-6">
        Configure announcements for different device types.
      </p>

      {/* Main form for announcements */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-4 items-center p-4 rounded-lg border border-gray-200"
            >
              {/* Device dropdown */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Device
                </label>
                <span
                  value={ann.device}
                  onChange={(e) =>
                    handleAnnouncementChange(ann.id, "device", e.target.value)
                  }
                  className="inline-block px-3 py-2 rounded-lg  font-medium shadow-sm text-gray-600 "
                >
                  Public Announcement
                </span>
              </div>
              {/* Quantity Selector */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <QuantitySelector
                  count={ann.quantity}
                  setCount={(newCount) =>
                    handleAnnouncementChange(ann.id, "quantity", newCount)
                  }
                />
              </div>
              {/* Remarks input */}
              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  value={ann.remarks}
                  onChange={(e) =>
                    handleAnnouncementChange(ann.id, "remarks", e.target.value)
                  }
                  placeholder="e.g., The main gate is now closed for maintenance."
                  rows="2"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              {/* Image uploader for each announcement */}
              <div className="md:col-span-2">
                <ImageUploader
                  images={ann.images}
                  onImagesChange={(newImages) =>
                    handleAnnouncementChange(ann.id, "images", newImages)
                  }
                  onTakeImage={() =>
                    handleTakeImage(ann.images, (newImages) =>
                      handleAnnouncementChange(ann.id, "images", newImages)
                    )
                  }
                  onGallery={() =>
                    handleGalleryImage(ann.images, (newImages) =>
                      handleAnnouncementChange(ann.id, "images", newImages)
                    )
                  }
                />
              </div>
              {/* Remove row button */}
              <div className="md:col-span-1 flex items-end justify-end">
                <button
                  type="button"
                  onClick={() => removeAnnouncementRow(ann.id)}
                  disabled={announcements.length <= 1}
                  className="p-1 text-gray-400 rounded-full hover:bg-red-100 hover:text-red-600 disabled:text-gray-300 disabled:cursor-not-allowed"
                  aria-label="Remove announcement"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add row and submit section */}
        <div className="flex justify-end items-center pt-5">
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
              className="inline-flex items-center py-1.5 px-5 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300"
            >
              {isSubmitting ? "Saving..." : "Save & Upload"}
              {!isSubmitting && <UploadCloudIcon className="ml-2 h-5 w-5" />}
            </button>
          </div>
        </div>
      </form>

      {/* Camera modal for image capture */}
      <CameraModal
        isOpen={isCameraModalOpen}
        onCapture={handleCapture}
        onClose={() => setIsCameraModalOpen(false)}
      />

      {/* Hidden file input for gallery image upload */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default Announcements;
