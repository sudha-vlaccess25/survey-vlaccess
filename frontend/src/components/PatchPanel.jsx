import React, { useState } from "react";
import { PlusIcon, TrashIcon } from "./Icons.jsx";
import "./PatchPanel.css";

// Reusable components included directly in this file
const QuantitySelector = ({ count, onChange, disabled = false }) => (
  <div className="quantity-selector">
    <button
      type="button"
      onClick={() => onChange(Math.max(0, count - 1))}
      disabled={disabled || count === 0}
      className={`quantity-button decrement ${disabled || count === 0 ? "disabled" : ""}`}
    >
      -
    </button>
    <span className={`quantity-display ${disabled ? "text-gray-400" : ""}`}>
      {String(count).padStart(2, "0")}
    </span>
    <button
      type="button"
      onClick={() => onChange(count + 1)}
      disabled={disabled}
      className={`quantity-button increment ${disabled ? "disabled" : ""}`}
    >
      +
    </button>
  </div>
);

const RemarksField = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="panel-label">{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows="2"
      className="remarks-textarea"
    />
  </div>
);

const PanelRow = ({ panel, updatePanel, removePanel, isRemovable = true }) => (
  <div key={panel.id} className="panel-group space-y-4">
    {isRemovable && (
      <button
        type="button"
        onClick={() => removePanel(panel.id)}
        className="remove-button"
      >
        <TrashIcon />
      </button>
    )}
    
    <div>
      <label className="panel-label">Panel Name</label>
      <input
        type="text"
        value={panel.name}
        onChange={(e) => updatePanel(panel.id, "name", e.target.value)}
        placeholder="e.g., Cat6 Patch Panel"
        className="panel-name-input"
        disabled={!isRemovable}
      />
    </div>

    <div className="flex-between">
      <label className="panel-label">Quantity</label>
      <QuantitySelector
        count={panel.quantity}
        onChange={(val) => updatePanel(panel.id, "quantity", val)}
      />
    </div>

    <RemarksField
      label="Remarks"
      value={panel.remarks}
      onChange={(e) => updatePanel(panel.id, "remarks", e.target.value)}
      placeholder="e.g., All ports working"
    />
  </div>
);

const createPanel = (name = "") => ({
  id: Date.now() + Math.random(),
  name,
  quantity: 0,
  remarks: "",
});

export default function PatchPanel() {
  const [panels, setPanels] = useState([
    createPanel("Copper Patch Panel"),
    createPanel("Fiber Patch Panel LIU"),
  ]);

  const updatePanel = (id, field, value) => {
    setPanels((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const addPanelRow = () => {
    setPanels((prev) => [...prev, createPanel("")]);
  };

  const removePanelRow = (id) => {
    setPanels((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Patch Panels:", panels);
    setPanels([createPanel("Copper Patch Panel"), createPanel("Fiber Patch Panel LIU")]);
  };

  return (
    <div className="patch-panel-container">
      <h2 className="main-heading">Patch Panel</h2>
      <p className="sub-heading">Configure and document patch panel specifications.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Default, non-removable panels */}
        <PanelRow
          panel={panels[0]}
          updatePanel={updatePanel}
          isRemovable={false}
        />
        <PanelRow
          panel={panels[1]}
          updatePanel={updatePanel}
          isRemovable={false}
        />

        {/* Custom, removable panels */}
        {panels.slice(2).map((p) => (
          <PanelRow
            key={p.id}
            panel={p}
            updatePanel={updatePanel}
            removePanel={removePanelRow}
            isRemovable={true}
          />
        ))}

        <button
          type="button"
          onClick={addPanelRow}
          className="mt-4 add-panel-button"
        >
          <PlusIcon className="mr-2" />
          Add New Panel
        </button>

        <div className="mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}