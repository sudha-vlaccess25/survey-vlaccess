import React, { useState } from "react";
import { PlusIcon, TrashIcon } from "./Icons.jsx";

// Reusable components
const NumberField = ({ label, value, onChange, placeholder }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      min="0"
    />
  </div>
);

const RemarksField = ({ label, value, onChange, placeholder }) => (
  <div className="w-full">
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

const createCable = () => ({
  id: Date.now(),
  cat6Outdoor: 0,
  cat6Indoor: 0,
  ofc: 0,
  remarks: "",
});

export default function Cable() {
  const [cables, setCables] = useState([createCable()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const updateCable = (id, field, value) => {
    setCables((prev) =>
      prev.map((cable) => (cable.id === id ? { ...cable, [field]: value } : cable))
    );
  };

  const addCableRow = () => {
    setCables((prev) => [...prev, createCable()]);
  };

  const removeCableRow = (id) => {
    if (cables.length <= 1) return;
    setCables((prev) => prev.filter((cable) => cable.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Submitting Cables:", JSON.stringify(cables, null, 2));
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setCables([createCable()]);
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6 sm:p-4 rounded-xl border border-gray-200 shadow-md font-sans">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Cable</h2>
      <p className="text-sm text-gray-500 mb-6">
        Document different types of cables and their quantities.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {cables.map((cable) => (
          <div
            key={cable.id}
            className="relative p-4 rounded-lg border border-gray-200 bg-white shadow-sm space-y-4"
          >
            {/* Remove button */}
            <div className="flex justify-end sm:absolute sm:top-2 sm:right-2">
              <button
                type="button"
                onClick={() => removeCableRow(cable.id)}
                disabled={cables.length <= 1}
                className="p-2 text-gray-400 rounded-full transition hover:bg-red-100 hover:text-red-600 disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                <TrashIcon />
              </button>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <NumberField
                label="Cat 6 Outdoor"
                value={cable.cat6Outdoor}
                onChange={(val) => updateCable(cable.id, "cat6Outdoor", val)}
              />
              <NumberField
                label="Cat 6 Indoor"
                value={cable.cat6Indoor}
                onChange={(val) => updateCable(cable.id, "cat6Indoor", val)}
              />
              <NumberField
                label="OFC"
                value={cable.ofc}
                onChange={(val) => updateCable(cable.id, "ofc", val)}
              />
              <RemarksField
                label="Remarks"
                value={cable.remarks}
                onChange={(e) => updateCable(cable.id, "remarks", e.target.value)}
                placeholder="e.g., Damaged during installation."
              />
            </div>
          </div>
        ))}

        {/* Add Cable Button */}
        <button
          type="button"
          onClick={addCableRow}
          className="mt-4 inline-flex items-center px-2 py-1.5 border border-dashed border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white transition hover:bg-gray-100 sm:w-auto w-auto"
        >
          <PlusIcon className="mr-1 h-4 w-4" />
          Add Cable
        </button>

        {/* Submit Section */}
        <div className="mt-8 flex items-center justify-end space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-700 shadow-sm transition hover:bg-indigo-800 ${
              isSubmitting ? "bg-indigo-300 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
          {submitStatus === "success" && (
            <span className="text-green-600 text-sm font-medium">✅ Saved!</span>
          )}
        </div>
      </form>
    </div>
  );
}
