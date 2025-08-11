// CameraTypesAndMounting.jsx
// This component manages the camera types and mounting survey form, including device selection, image upload, and remarks.
// It uses reusable child components and handles dynamic form sections and image capture/upload logic.
import React, { useState, useRef, useEffect } from "react";

// --- Helper Icons (imported from Icons.jsx, reusable with className prop) ---
import {
  PlusIcon,
  CheckCircleIcon,
  UploadCloudIcon,
} from "./Icons";
import ImageUploader from "../cameraTools/ImageUploader";
import CameraModal from "../cameraTools/CameraModal";
// --- Reusable Child Components ---

// QuantitySelector: Allows increment/decrement of a numeric value, used for device/camera counts
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


// DeviceDetails: Renders image uploader and remarks for a specific device
const DeviceDetails = ({ device, onUpdate, onTakeImage, onGallery }) => (
  <div className="mt-4 pl-4 border-l-2 border-indigo-100 space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ImageUploader
        images={device.images}
        onImagesChange={(imgs) => onUpdate("images", imgs)}
        onTakeImage={onTakeImage}
        onGallery={onGallery}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Remarks</label>
      <textarea
        value={device.remarks}
        onChange={(e) => onUpdate("remarks", e.target.value)}
        rows={2}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
      />
    </div>
  </div>
);

// CameraSection: Renders a section for a specific set of camera types, including quantity, images, and remarks
const CameraSection = ({
  title,
  cameraTypes,
  deviceData,
  setDeviceData,
  onTakeImage,
  onGallery,
}) => {
  const [otherDeviceName, setOtherDeviceName] = useState("");

  const handleQuantityChange = (name, newCount) => {
    setDeviceData((prev) => {
      const existing = prev.find((d) => d.name === name);
      if (!existing && newCount > 0)
        return [
          ...prev,
          { name, quantity: newCount, location: "", images: [], remarks: "" },
        ];
      if (existing && newCount === 0)
        return prev.filter((d) => d.name !== name);
      return prev.map((d) =>
        d.name === name ? { ...d, quantity: newCount } : d
      );
    });
  };

  const handleDeviceUpdate = (name, field, value) => {
    setDeviceData((prev) =>
      prev.map((d) => (d.name === name ? { ...d, [field]: value } : d))
    );
  };

  const handleAddOtherDevice = () => {
    if (
      otherDeviceName.trim() &&
      !deviceData.find((d) => d.name === otherDeviceName.trim())
    ) {
      handleQuantityChange(otherDeviceName.trim(), 1);
      setOtherDeviceName("");
    }
  };

  // createHandlers: Helper to generate image handlers for each device instance
  const createHandlers = (device) => ({
    onTakeImage: () =>
      onTakeImage(device.images, (imgs) =>
        handleDeviceUpdate(device.name, "images", imgs)
      ),
    onGallery: () =>
      onGallery(device.images, (imgs) =>
        handleDeviceUpdate(device.name, "images", imgs)
      ),
  });

  return (
    <div className="p-6 rounded-xl border border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-4">
        {title} <span className="text-red-500">*</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {cameraTypes.map((type) => {
          const device = deviceData.find((d) => d.name === type);
          return (
            <div key={type}>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">{type}</label>
                <QuantitySelector
                  count={device?.quantity || 0}
                  setCount={(newCount) => handleQuantityChange(type, newCount)}
                />
              </div>
              {device && (
                <DeviceDetails
                  device={device}
                  onUpdate={(field, value) =>
                    handleDeviceUpdate(type, field, value)
                  }
                  {...createHandlers(device)}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700">
          Add Other Devices
        </label>
        <div className="mt-1 flex items-center gap-2">
          <input
            type="text"
            value={otherDeviceName}
            onChange={(e) => setOtherDeviceName(e.target.value)}
            placeholder="Enter device name"
            className="block w-full h-10 rounded-md border border-gray-300 shadow-sm sm:text-sm p-2"
          />
          <button
            type="button"
            onClick={handleAddOtherDevice}
            className="px-4 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
          >
            <PlusIcon />
          </button>
        </div>
        {deviceData
          .filter((d) => !cameraTypes.includes(d.name))
          .map((otherDevice) => (
            <div key={otherDevice.name} className="mt-4">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700 font-semibold">
                  {otherDevice.name}
                </label>
                <QuantitySelector
                  count={otherDevice.quantity}
                  setCount={(newCount) =>
                    handleQuantityChange(otherDevice.name, newCount)
                  }
                />
              </div>
              <DeviceDetails
                device={otherDevice}
                onUpdate={(field, value) =>
                  handleDeviceUpdate(otherDevice.name, field, value)
                }
                {...createHandlers(otherDevice)}
              />
            </div>
          ))}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Mounting Details (Overall)
        </label>
        <textarea
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
          placeholder="Location, visibility, obstructions, sunlight, dust, vibration..."
        />
      </div>
    </div>
  );
};


// CameraTypesAndMounting: Main form component for camera types and mounting survey
const CameraTypesAndMounting = ({ onSaveAndNext = () => {} }) => {
  const cameraTypes = [
    "ALPR Camera",
    "Bullet Camera",
    "Dome Camera",
    "PTZ Camera",
    "Thermal Camera",
    "FRS- Facial Recognition System",
  ];
  const [existingDevices, setExistingDevices] = useState([]);
  const [newDevices, setNewDevices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // State for image handling
  // isModalOpen: Controls visibility of camera modal
  // activeImageState: Tracks which device's images are being updated
  // fileInputRef: Ref for hidden file input for gallery upload
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImageState, setActiveImageState] = useState(null);
  const fileInputRef = useRef(null);

  // handleTakeImage: Opens camera modal for image capture
  const handleTakeImage = (currentImages, onImagesChange) => {
    setActiveImageState({ currentImages, onImagesChange });
    setIsModalOpen(true);
  };

  // handleGalleryImage: Opens file picker for gallery upload
  const handleGalleryImage = (currentImages, onImagesChange) => {
    setActiveImageState({ currentImages, onImagesChange });
    fileInputRef.current.click();
  };

  // handleFileSelect: Handles file selection from gallery
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && activeImageState) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...activeImageState.currentImages, reader.result];
        activeImageState.onImagesChange(newImages);
        setActiveImageState(null);
      };
      reader.readAsDataURL(file);
    }
    // Reset file input value to allow selecting the same file again
    event.target.value = null;
  };

  // handleCapture: Handles image capture from camera modal
  const handleCapture = (imageDataUrl) => {
    if (activeImageState) {
      const newImages = [...activeImageState.currentImages, imageDataUrl];
      activeImageState.onImagesChange(newImages);
      setActiveImageState(null);
    }
  };

  // handleSubmit: Handles form submission, resets form and shows success/error message
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = { existingDevices, newDevices };
      console.log("Submitting Camera Data:", formData);
      await new Promise((res) => setTimeout(res, 1000)); // Simulate delay
      setSubmitStatus("success");
      onSaveAndNext(formData);
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm w-full mx-auto">
      <CameraModal
        isOpen={isModalOpen}
        onCapture={handleCapture}
        onClose={() => setIsModalOpen(false)}
      />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileSelect}
      />

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Camera Types & Mounting Location
      </h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <CameraSection
          title="Please select the existing types and quantities of cameras"
          cameraTypes={cameraTypes}
          deviceData={existingDevices}
          setDeviceData={setExistingDevices}
          onTakeImage={handleTakeImage}
          onGallery={handleGalleryImage}
        />
        <CameraSection
          title="Please select the types and quantities of cameras to be deployed"
          cameraTypes={cameraTypes}
          deviceData={newDevices}
          setDeviceData={setNewDevices}
          onTakeImage={handleTakeImage}
          onGallery={handleGalleryImage}
        />

        <div className="pt-5 flex justify-end items-center">
          {submitStatus === "success" && (
            <div className="flex items-center text-green-600 mr-4">
              <CheckCircleIcon />
              <span>Successfully Uploaded!</span>
            </div>
          )}
          {submitStatus === "error" && (
            <div className="flex items-center text-red-600 mr-4">
              <span>Upload Failed!</span>
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center items-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Save & Upload"}
            {!isSubmitting && <UploadCloudIcon className="ml-2 h-5 w-5" />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CameraTypesAndMounting;
