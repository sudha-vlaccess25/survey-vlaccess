import React, { useState } from "react";
import { PlusIcon, TrashIcon } from "./Icons.jsx";


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

const PortSection = ({ label, count, remarks, onCountChange, onRemarksChange }) => (
  <>
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <QuantitySelector count={count} onChange={onCountChange} />
    </div>
    <RemarksField
      label="Remarks"
      value={remarks}
      onChange={onRemarksChange}
      placeholder="e.g., Working fine"
    />
  </>
);

const createSwitch = () => ({
  id: Date.now(),
  multiSFP: 0,
  multiSFPRemarks: "",
  fourPortSFP: 0,
  fourPortSFPRemarks: "",
  twoPortSFP: 0,
  twoPortSFPRemarks: "",
  customPorts: [],
});

const createCustomPort = () => ({
  portId: Date.now(),
  name: "",
  quantity: 0,
  remarks: "",
});

export default function NetworkSwitch() {
  const [switches, setSwitches] = useState([createSwitch()]);

  const updateField = (id, field, value) =>
    setSwitches((prev) =>
      prev.map((sw) => (sw.id === id ? { ...sw, [field]: value } : sw))
    );

  const updateCustomPort = (switchId, portId, field, value) =>
    setSwitches((prev) =>
      prev.map((sw) =>
        sw.id === switchId
          ? {
              ...sw,
              customPorts: sw.customPorts.map((p) =>
                p.portId === portId ? { ...p, [field]: value } : p
              ),
            }
          : sw
      )
    );

  const addCustomPort = (id) =>
    setSwitches((prev) =>
      prev.map((sw) =>
        sw.id === id ? { ...sw, customPorts: [...sw.customPorts, createCustomPort()] } : sw
      )
    );

  const removeCustomPort = (switchId, portId) =>
    updateField(
      switchId,
      "customPorts",
      switches.find((sw) => sw.id === switchId).customPorts.filter((p) => p.portId !== portId)
    );

  const removeSwitch = (id) => {
    if (switches.length > 1) setSwitches((prev) => prev.filter((sw) => sw.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting:", switches);
    setSwitches([createSwitch()]);
  };

  const portConfig = [
    { key: "multiSFP", label: "Multi SFP" },
    { key: "fourPortSFP", label: "4 Port SFP" },
    { key: "twoPortSFP", label: "2 Port SFP" },
  ];

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm w-full mx-auto font-sans">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Network Switch</h2>
      <p className="text-sm text-gray-500 mb-6">Configure and document network switch specifications.</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {switches.map((sw) => (
          <div key={sw.id} className="relative p-4 rounded-lg border border-gray-200 space-y-4">
            <button
              type="button"
              onClick={() => removeSwitch(sw.id)}
              disabled={switches.length <= 1}
              className="absolute top-2 right-2 z-10 p-2 text-gray-400 rounded-full hover:bg-red-100 hover:text-red-600 disabled:text-gray-300"
            >
              <TrashIcon />
            </button>

            {portConfig.map(({ key, label }) => (
              <PortSection
                key={key}
                label={label}
                count={sw[key]}
                remarks={sw[`${key}Remarks`]}
                onCountChange={(val) => updateField(sw.id, key, val)}
                onRemarksChange={(e) => updateField(sw.id, `${key}Remarks`, e.target.value)}
              />
            ))}

            {sw.customPorts.map((port) => (
              <div key={port.portId} className="space-y-4 p-4 border rounded-lg bg-gray-50 relative">
                <button
                  type="button"
                  onClick={() => removeCustomPort(sw.id, port.portId)}
                  className="absolute top-2 right-2 p-1 text-gray-400 rounded-full hover:bg-red-100 hover:text-red-600"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
                <input
                  type="text"
                  value={port.name}
                  onChange={(e) => updateCustomPort(sw.id, port.portId, "name", e.target.value)}
                  placeholder="Port Name e.g., 6 Port SFP"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Quantity</label>
                  <QuantitySelector
                    count={port.quantity}
                    onChange={(val) => updateCustomPort(sw.id, port.portId, "quantity", val)}
                  />
                </div>
                <RemarksField
                  label="Remarks"
                  value={port.remarks}
                  onChange={(e) => updateCustomPort(sw.id, port.portId, "remarks", e.target.value)}
                  placeholder="e.g., Working fine"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => addCustomPort(sw.id)}
              className="inline-flex items-center px-3 py-1.5 border border-dashed border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 z-0 relative"
            >
              <PlusIcon className="mr-2" />
              Add New Port
            </button>
          </div>
        ))}
      </form>
    </div>
  );
}
