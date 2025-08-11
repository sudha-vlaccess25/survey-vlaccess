import React, { useState } from "react";
import { PlusIcon, TrashIcon } from "./Icons.jsx";

// Reusable components included directly in this file
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
      <span className={`text-gray-800 font-medium w-8 text-center ${disabled ? "text-gray-400" : ""}`}>
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

const createNewTransreceiver = () => ({
  id: Date.now(),
  oneGQuantity: 0,
  tenGQuantity: 0,
  oneGRemarks: "",
  tenGRemarks: "",
});

const createCustomPort = (name = "") => ({
  id: Date.now() + Math.random(),
  portName: name,
  quantity: 0,
  remarks: "",
});

const TransreceiverModule = () => {
  const [transreceivers, setTransreceivers] = useState([createNewTransreceiver()]);
  const [customPorts, setCustomPorts] = useState([]);
  const [newPort, setNewPort] = useState({ portName: "", quantity: 0, remarks: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const updateTransreceiver = (id, field, value) => {
    setTransreceivers((prev) =>
      prev.map((tr) => (tr.id === id ? { ...tr, [field]: value } : tr))
    );
  };


  const addCustomPort = () => {
    if (!newPort.portName.trim()) return;
    setCustomPorts((prev) => [...prev, { ...createCustomPort(newPort.portName), quantity: newPort.quantity, remarks: newPort.remarks }]);
    setNewPort({ portName: "", quantity: 0, remarks: "" });
  };

  const removeCustomPort = (id) => {
    setCustomPorts((prev) => prev.filter((p) => p.id !== id));
  };

  const removeTransreceiverRow = (id) => {
    if (transreceivers.length <= 1) return;
    setTransreceivers(transreceivers.filter((tr) => tr.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Submitting Transreceiver Modules:", JSON.stringify(transreceivers, null, 2));
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setTransreceivers([createNewTransreceiver()]);
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 2000);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm w-full mx-auto font-sans">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Transreceiver Module</h2>
      <p className="text-sm text-gray-500 mb-6">Configure and document transreceiver module specifications.</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          {/* Default 1G/10G section */}
          {transreceivers.map((tr) => (
            <div key={tr.id} className="relative p-4 rounded-lg border border-gray-200 space-y-6">
              {/* 1G Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">1G Quantity</label>
                  <QuantitySelector
                    count={tr.oneGQuantity}
                    setCount={(val) => updateTransreceiver(tr.id, "oneGQuantity", val)}
                  />
                </div>
                <RemarksField
                  label="1G Remarks"
                  value={tr.oneGRemarks}
                  onChange={(e) => updateTransreceiver(tr.id, "oneGRemarks", e.target.value)}
                  placeholder="e.g., Working fine"
                />
              </div>
              {/* 10G Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">10G Quantity</label>
                  <QuantitySelector
                    count={tr.tenGQuantity}
                    setCount={(val) => updateTransreceiver(tr.id, "tenGQuantity", val)}
                  />
                </div>
                <RemarksField
                  label="10G Remarks"
                  value={tr.tenGRemarks}
                  onChange={(e) => updateTransreceiver(tr.id, "tenGRemarks", e.target.value)}
                  placeholder="e.g., Not working"
                />
              </div>
            </div>
          ))}

          {/* Custom ports section */}
          {customPorts.map((port) => (
            <div key={port.id} className="relative p-4 rounded-lg border border-gray-200 space-y-4">
              <div className="absolute top-2 right-2">
                <button
                  type="button"
                  onClick={() => removeCustomPort(port.id)}
                  className="p-2 text-gray-400 rounded-full hover:bg-red-100 hover:text-red-600"
                  aria-label="Remove port"
                >
                  <TrashIcon />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Port Name</label>
                  <input
                    type="text"
                    value={port.portName}
                    disabled
                    className="block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-800 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <QuantitySelector
                    count={port.quantity}
                    setCount={(val) => setCustomPorts((prev) => prev.map((p) => p.id === port.id ? { ...p, quantity: val } : p))}
                  />
                </div>
                <RemarksField
                  label="Remarks"
                  value={port.remarks}
                  onChange={(e) => setCustomPorts((prev) => prev.map((p) => p.id === port.id ? { ...p, remarks: e.target.value } : p))}
                  placeholder="e.g., Custom port remarks"
                />
              </div>
            </div>
          ))}

          {/* Add new port section */}
          <div className="p-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Port Name</label>
                <input
                  type="text"
                  value={newPort.portName}
                  onChange={(e) => setNewPort((prev) => ({ ...prev, portName: e.target.value }))}
                  placeholder="e.g., 2G, 3G, SFP+"
                  className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <QuantitySelector
                  count={newPort.quantity}
                  setCount={(val) => setNewPort((prev) => ({ ...prev, quantity: val }))}
                />
              </div>
              <RemarksField
                label="Remarks"
                value={newPort.remarks}
                onChange={(e) => setNewPort((prev) => ({ ...prev, remarks: e.target.value }))}
                placeholder="e.g., Custom port remarks"
              />
            </div>
            <button
              type="button"
              onClick={addCustomPort}
              className="inline-flex items-center px-3 py-1.5 border border-dashed border-gray-400 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100"
            >
              <PlusIcon className="mr-2" />
              Add Port
            </button>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
              isSubmitting
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
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
};

export default TransreceiverModule;