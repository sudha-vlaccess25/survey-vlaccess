import React, { useState } from "react";
import { PlusIcon, TrashIcon } from "./Icons.jsx";
import "./Rack.css";
import CameraModal from "../cameraTools/CameraModal.jsx";
import ImageUploader from "../cameraTools/ImageUploader.jsx";

// Reusable components included directly in this file
const RemarksField = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="rack-label">{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows="2"
      className="remarks-textarea"
    />
  </div>
);

const QuantitySelector = ({ count, onChange, disabled = false }) => (
  <div className="flex items-center space-x-3">
    <button
      type="button"
      onClick={() => onChange(Math.max(0, count - 1))}
      disabled={disabled || count === 0}
      className={`w-7 h-7 flex items-center justify-center rounded-full text-white text-lg font-bold transition ${
        disabled || count === 0 ? "bg-red-200 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
      }`}
    >
      -
    </button>
    <span className={`text-gray-800 font-medium w-8 text-center ${disabled ? "text-gray-400" : ""}`}>
      {String(count).padStart(2, "0")}
    </span>
    <button
      type="button"
      onClick={() => onChange(count + 1)}
      disabled={disabled}
      className={`w-7 h-7 flex items-center justify-center rounded-full text-white text-lg font-bold transition ${
        disabled ? "bg-green-200 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
      }`}
    >
      +
    </button>
  </div>
);

const createRackData = () => ({
  id: Date.now(),
  quantity: 1, // Start with one rack by default
  racks: [
    {
      indoorRemarks: "",
      indoorImages: [],
      outdoorRemarks: "",
      outdoorImages: [],
    },
  ],
});

export default function Rack() {
  const [rackData, setRackData] = useState(createRackData());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [cameraModal, setCameraModal] = useState({ open: false, rackIndex: null, section: null });

  const updateRackQuantity = (newQuantity) => {
    if (newQuantity < 1) newQuantity = 1;
    setRackData((prevData) => {
      const newRacks = [...prevData.racks];
      if (newQuantity > newRacks.length) {
        for (let i = newRacks.length; i < newQuantity; i++) {
          newRacks.push({
            indoorRemarks: "",
            indoorImages: [],
            outdoorRemarks: [],
            outdoorImages: [],
          });
        }
      } else if (newQuantity < newRacks.length) {
        newRacks.splice(newQuantity);
      }
      return { ...prevData, quantity: newQuantity, racks: newRacks };
    });
  };

  const updateRackField = (index, field, value) => {
    setRackData((prevData) => {
      const newRacks = [...prevData.racks];
      newRacks[index] = { ...newRacks[index], [field]: value };
      return { ...prevData, racks: newRacks };
    });
  };

  const handleCameraCapture = (imageDataUrl) => {
    if (cameraModal.rackIndex !== null && cameraModal.section) {
      const { rackIndex, section } = cameraModal;
      setRackData(prevData => {
        const newRacks = [...prevData.racks];
        const updatedImages = [...newRacks[rackIndex][section], imageDataUrl];
        newRacks[rackIndex] = { ...newRacks[rackIndex], [section]: updatedImages };
        return { ...prevData, racks: newRacks };
      });
    }
    setCameraModal({ open: false, rackIndex: null, section: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Submitting Racks:", JSON.stringify(rackData, null, 2));
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setRackData(createRackData());
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 2000);
  };

  return (
    <div className="rack-container">
      <h2 className="main-heading">Rack</h2>
      <p className="sub-heading">Document indoor and outdoor rack details, images, and remarks.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
          <label className="text-sm font-medium text-gray-700">Number of Racks</label>
          <QuantitySelector
            count={rackData.quantity}
            onChange={updateRackQuantity}
          />
        </div>

        {rackData.racks.map((rack, index) => (
          <div key={index} className="rack-group space-y-4">
            <h3 className="section-title">Rack #{index + 1}</h3>
            <div className="rack-sections-wrapper">
              {/* Indoor Section */}
              <div className="rack-section">
                <h4 className="sub-section-title">Indoor</h4>
                <ImageUploader
                  images={rack.indoorImages}
                  onImagesChange={(newImages) => updateRackField(index, "indoorImages", newImages)}
                  onTakeImage={() => setCameraModal({ open: true, rackIndex: index, section: "indoorImages" })}
                />
                <RemarksField
                  label="Remarks"
                  value={rack.indoorRemarks}
                  onChange={(e) => updateRackField(index, "indoorRemarks", e.target.value)}
                  placeholder="e.g., Rack is securely mounted."
                />
              </div>

              {/* Outdoor Section */}
              <div className="rack-section">
                <h4 className="sub-section-title">Outdoor</h4>
                <ImageUploader
                  images={rack.outdoorImages}
                  onImagesChange={(newImages) => updateRackField(index, "outdoorImages", newImages)}
                  onTakeImage={() => setCameraModal({ open: true, rackIndex: index, section: "outdoorImages" })}
                />
                <RemarksField
                  label="Remarks"
                  value={rack.outdoorRemarks}
                  onChange={(e) => updateRackField(index, "outdoorRemarks", e.target.value)}
                  placeholder="e.g., Needs weather-proofing."
                />
              </div>
            </div>
          </div>
        ))}
        
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

        {cameraModal.open && (
          <CameraModal
            isOpen={cameraModal.open}
            onClose={() => setCameraModal({ open: false, rackIndex: null, section: null })}
            onCapture={handleCameraCapture}
          />
        )}
      </form>
    </div>
  );
}