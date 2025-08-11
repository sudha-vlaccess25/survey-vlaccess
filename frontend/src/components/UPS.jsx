
// UPS.jsx - Component for managing Uninterruptible Power Supply (UPS) entries
import React, { useState } from "react";
import { PlusIcon, TrashIcon } from "./Icons.jsx";
import "./UPS.css";

// QuantitySelector: Increment/decrement control for numeric values (e.g., quantity)
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

// RemarksField: Textarea for entering remarks for a UPS device
const RemarksField = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows="2"
      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
);


// UPS types to display
const UPS_TYPES = [
  "Online UPS",
  "Offline UPS",
  "Line-Interactive UPS"
];


// UPS: Main component for managing a list of UPS devices

function UPS() {
  // State for all three UPS types
  const [upsDevices, setUpsDevices] = useState(
    UPS_TYPES.map((type) => ({
      name: type,
      quantity: 0,
      remarks: "",
    }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // updateUPS: Update a field for a specific UPS type by index
  const updateUPS = (idx, field, value) => {
    setUpsDevices((prev) =>
      prev.map((ups, i) => (i === idx ? { ...ups, [field]: value } : ups))
    );
  };

  // handleSubmit: Handle form submission, reset state, and show status
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Submitting UPS devices:", JSON.stringify(upsDevices, null, 2));
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setUpsDevices(UPS_TYPES.map((type) => ({ name: type, quantity: 0, remarks: "" })));
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 2000);
  };

  return (
    <div className="ups-container">
      <h2 className="main-heading">UPS</h2>
      <p className="sub-heading">Configure and document uninterruptible power supply specifications.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {upsDevices.map((ups, idx) => (
          <div key={ups.name} className="ups-group space-y-4">
            <div className="flex items-center justify-between">
              <label className="ups-label">{ups.name}</label>
              <QuantitySelector
                count={ups.quantity}
                onChange={(val) => updateUPS(idx, "quantity", val)}
              />
            </div>
            <RemarksField
              label="Remarks"
              value={ups.remarks}
              onChange={(e) => updateUPS(idx, "remarks", e.target.value)}
              placeholder="e.g., Working fine, requires maintenance."
            />
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
      </form>
    </div>
  );
}

export default UPS;