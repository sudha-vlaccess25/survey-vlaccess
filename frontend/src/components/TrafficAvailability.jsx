import React, { useState } from "react";
import "./TrafficAvailability.css";
import CameraModal from "../cameraTools/CameraModal.jsx";
import ImageUploader from "../cameraTools/ImageUploader.jsx";
import { PhotoLibraryIcon, CameraIcon, PlusIcon, TrashIcon } from "./Icons.jsx";

// Reusable components included directly in this file
const RemarksField = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="ta-label">{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows="2"
      className="remarks-textarea"
    />
  </div>
);

const createTrafficData = () => ({
  isAvailable: false,
  images: [],
  remarks: "",
});

export default function TrafficAvailability() {
  const [trafficData, setTrafficData] = useState(createTrafficData());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [cameraModal, setCameraModal] = useState({ open: false });

  const handleToggle = (value) => {
    setTrafficData((prev) => ({
      ...prev,
      isAvailable: value,
      // Clear images and remarks if switching to 'No'
      ...(value === false && { images: [], remarks: "" }),
    }));
  };

  const updateField = (field, value) => {
    setTrafficData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleCameraCapture = (imageDataUrl) => {
    setTrafficData((prev) => ({
      ...prev,
      images: [...prev.images, imageDataUrl],
    }));
    setCameraModal({ open: false });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Submitting Traffic Availability:", JSON.stringify(trafficData, null, 2));
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setTrafficData(createTrafficData());
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 2000);
  };

  return (
    <div className="ta-container">
      <h2 className="main-heading">Existing Traffic Availability</h2>
      <p className="sub-heading">Indicate if there is existing traffic availability and provide details.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="ta-toggle-group">
          <label className="ta-label">Is traffic available?</label>
          <div className="flex items-center space-x-4 mt-2">
            <button
              type="button"
              onClick={() => handleToggle(true)}
              className={`ta-toggle-button ${trafficData.isAvailable ? 'selected' : ''}`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => handleToggle(false)}
              className={`ta-toggle-button ${!trafficData.isAvailable ? 'selected' : ''}`}
            >
              No
            </button>
          </div>
        </div>

        {trafficData.isAvailable && (
          <div className="ta-content-group">
            <h3 className="content-title">If yes</h3>
            <ImageUploader
              images={trafficData.images}
              onImagesChange={(imgs) => updateField("images", imgs)}
              onTakeImage={() => setCameraModal({ open: true })}
            />
            <RemarksField
              label="Remarks"
              value={trafficData.remarks}
              onChange={(e) => updateField("remarks", e.target.value)}
              placeholder="e.g., Traffic is high, suitable for new connections."
            />
          </div>
        )}

        <div className="mt-8 flex items-center justify-end space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
          {submitStatus === "success" && (
            <span className="submit-success">✅ Saved!</span>
          )}
        </div>
      </form>
      
      {cameraModal.open && (
        <CameraModal
          isOpen={cameraModal.open}
          onClose={() => setCameraModal({ open: false })}
          onCapture={handleCameraCapture}
        />
      )}
    </div>
  );
}