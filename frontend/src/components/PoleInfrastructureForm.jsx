// PoleInfrastructureForm.jsx
// This component manages the pole infrastructure survey form, including existing and new poles, cantilevers, gantry, images, and remarks.
// It uses reusable child components and handles complex nested state for dynamic form sections.
import React, { useState, useRef, useEffect, useMemo } from "react";
import CameraModal from "../cameraTools/CameraModal.jsx";
import ImageUploader from "../cameraTools/ImageUploader.jsx";

// --- Helper Icons (imported from Icons.jsx, reusable with className prop) ---
import {
  TrashIcon,
  CameraIcon,
  PhotoLibraryIcon,
  CheckCircleIcon,
  UploadCloudIcon,
  PlusIcon,
} from "./Icons.jsx";

// --- Reusable Child Components ---

// QuantitySelector: Allows increment/decrement of a numeric value, used for pole/cantilever counts
const QuantitySelector = ({ count, setCount, disabled = false }) => {
  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => (prev > 0 ? prev - 1 : 0));
  return (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        onClick={decrement}
        disabled={count === 0 || disabled}
        className={`w-7 h-7 flex items-center justify-center rounded-full text-white text-lg font-bold transition ${
          count === 0 || disabled
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


// CantileverAdder: Manages cantilever selection and quantity for each pole
const CantileverAdder = ({ poleIndex, cantilevers, onAddCantilever, onChangeCantilever, onRemoveCantilever }) => {
  const cantileverOptions = ["1 Meter", "2 Meter", "3 Meter", "4 Meter"];
  return (
    <div className="mt-2 pl-4 space-y-2 border-l border-gray-300">
      <p className="text-sm font-medium text-gray-600">Cantilevers for Pole #{poleIndex + 1}</p>
      {cantilevers.map((cantilever, cIndex) => (
        <div key={cIndex} className="flex items-center space-x-2">
          <select
            className="mt-1 block w-2/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={cantilever.length}
            onChange={(e) => onChangeCantilever(poleIndex, cIndex, 'length', e.target.value)}
          >
            <option value="">Select Length</option>
            {cantileverOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <QuantitySelector
            count={cantilever.quantity}
            setCount={(updater) => onChangeCantilever(poleIndex, cIndex, 'quantity', updater(cantilever.quantity))}
          />
          <button type="button" onClick={() => onRemoveCantilever(poleIndex, cIndex)} className="text-red-500 hover:text-red-700">
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onAddCantilever(poleIndex)} className="mt-2 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800">
        <PlusIcon className="h-4 w-4 mr-1" /> Add Cantilever
      </button>
    </div>
  );
};

// NewPoleSection: Renders a section for a specific type of new pole, including quantity, cantilevers, images, and remarks
const NewPoleSection = ({ title, poleType, poles, onPoleQuantityChange, onAddCantilever, onChangeCantilever, onRemoveCantilever, images, onImagesChange, remarks, onRemarksChange }) => {
  const totalCount = useMemo(() => poles.length, [poles]);

  return (
    <div className="p-4 rounded-lg border border-gray-200 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Total:</span>
          <span className="font-bold text-gray-800 text-lg">
            {String(totalCount).padStart(2, "0")}
          </span>
        </div>
      </div>
      <div className="pl-4 space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm text-gray-700">
            Number of Poles
          </label>
          <QuantitySelector
            count={poles.length}
            setCount={onPoleQuantityChange}
          />
        </div>
        {poles.length > 0 && (
          <div className="space-y-4 animate-fade-in">
            {poles.map((pole, poleIndex) => (
              <CantileverAdder
                key={poleIndex}
                poleIndex={poleIndex}
                cantilevers={pole.cantilevers}
                onAddCantilever={() => onAddCantilever(poleType, poleIndex)}
                onChangeCantilever={(pIndex, cIndex, field, value) => onChangeCantilever(poleType, pIndex, cIndex, field, value)}
                onRemoveCantilever={(pIndex, cIndex) => onRemoveCantilever(poleType, pIndex, cIndex)}
              />
            ))}
          </div>
        )}
        <ImageUploader
          images={images}
          onImagesChange={onImagesChange}
          label={`${title} Images`}
        />
        <div>
          <label htmlFor={`${title}-remarks`} className="block text-sm font-medium text-gray-700">
            {title} Remarks
          </label>
          <textarea
            id={`${title}-remarks`}
            rows={2}
            value={remarks}
            onChange={(e) => onRemarksChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
};

// New reusable RadioInput component
// RadioInput: Reusable radio button input for permission required field
const RadioInput = ({ id, name, value, checked, onChange, label, className }) => (
  <div className="flex items-center">
    <input
      id={id}
      name={name}
      type="radio"
      value={value}
      checked={checked}
      onChange={onChange}
      className={`h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 ${className}`}
    />
    <label
      htmlFor={id}
      className="ml-3 block text-sm font-medium text-gray-800"
    >
      {label}
    </label>
  </div>
);

// --- Main Form Component ---

// initialFormData: Defines the initial state structure for the form
const initialFormData = {
  existingPoleCounts: {},
  existingPoleImages: [],
  existingPoleRemarks: "",
  newPoles: {
    "Surveillance pole": [],
    "ALPR pole": [],
    "Traffic pole": [],
  },
  departmentData: {
    "Surveillance pole": { images: [], remarks: "" },
    "ALPR pole": { images: [], remarks: "" },
    "Traffic pole": { images: [], remarks: "" }
  },
  gantry: {
    quantity: 0,
    images: [],
    remarks: ""
  },
  distance: "",
  permissionRequired: null,
};

// PoleInfrastructureForm: Main form component for pole infrastructure survey
const PoleInfrastructureForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // updateFormData: Generic state updater for top-level form fields
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // handlePoleQuantityChange: Updates the number of poles for a given pole type
  const handlePoleQuantityChange = (poleType) => (updater) => {
    setFormData(prev => {
      const newQuantity = updater(prev.newPoles[poleType].length);
      const currentPoles = prev.newPoles[poleType];
      const updatedPoles = newQuantity > currentPoles.length
        ? [...currentPoles, ...Array(newQuantity - currentPoles.length).fill(null).map(() => ({ cantilevers: [] }))]
        : currentPoles.slice(0, newQuantity);

      return { ...prev, newPoles: { ...prev.newPoles, [poleType]: updatedPoles } };
    });
  };

  // handleAddCantilever: Adds a new cantilever to a specific pole
  const handleAddCantilever = (poleType, poleIndex) => {
    setFormData(prev => {
      const newPoles = [...prev.newPoles[poleType]];
      newPoles[poleIndex] = {
        ...newPoles[poleIndex],
        cantilevers: [...newPoles[poleIndex].cantilevers, { length: "", quantity: 1 }]
      };
      return { ...prev, newPoles: { ...prev.newPoles, [poleType]: newPoles } };
    });
  };

  // handleChangeCantilever: Updates cantilever properties (length/quantity) for a specific pole
  const handleChangeCantilever = (poleType, poleIndex, cantileverIndex, field, value) => {
    setFormData(prev => {
      const newPoles = [...prev.newPoles[poleType]];
      newPoles[poleIndex].cantilevers[cantileverIndex] = {
        ...newPoles[poleIndex].cantilevers[cantileverIndex],
        [field]: value
      };
      return { ...prev, newPoles: { ...prev.newPoles, [poleType]: newPoles } };
    });
  };

  // handleRemoveCantilever: Removes a cantilever from a specific pole
  const handleRemoveCantilever = (poleType, poleIndex, cantileverIndex) => {
    setFormData(prev => {
      const newPoles = [...prev.newPoles[poleType]];
      newPoles[poleIndex] = {
        ...newPoles[poleIndex],
        cantilevers: newPoles[poleIndex].cantilevers.filter((_, index) => index !== cantileverIndex)
      };
      return { ...prev, newPoles: { ...prev.newPoles, [poleType]: newPoles } };
    });
  };

  // handleGantryImagesChange: Updates gantry images
  const handleGantryImagesChange = (newImages) => {
    setFormData(prev => ({ ...prev, gantry: { ...prev.gantry, images: newImages } }));
  };
  // handleGantryRemarksChange: Updates gantry remarks
  const handleGantryRemarksChange = (newRemarks) => {
    setFormData(prev => ({ ...prev, gantry: { ...prev.gantry, remarks: newRemarks } }));
  };
  // handleGantryQuantityChange: Updates gantry quantity
  const handleGantryQuantityChange = (updater) => {
    setFormData(prev => ({ ...prev, gantry: { ...prev.gantry, quantity: updater(prev.gantry.quantity) } }));
  };

  // handleDepartmentImagesChange: Updates images for a department pole type
  const handleDepartmentImagesChange = (poleType) => (newImages) => {
    setFormData(prev => ({ ...prev, departmentData: { ...prev.departmentData, [poleType]: { ...prev.departmentData[poleType], images: newImages } } }));
  };

  // handleDepartmentRemarksChange: Updates remarks for a department pole type
  const handleDepartmentRemarksChange = (poleType) => (newRemarks) => {
    setFormData(prev => ({ ...prev, departmentData: { ...prev.departmentData, [poleType]: { ...prev.departmentData[poleType], remarks: newRemarks } } }));
  };

  // handleExistingPoleCountChange: Updates count for an existing pole subtype
  const handleExistingPoleCountChange = (subType) => (updater) => {
    setFormData(prev => ({ ...prev, existingPoleCounts: { ...prev.existingPoleCounts, [subType]: updater(prev.existingPoleCounts[subType] || 0) } }));
  };

  // handleExistingPoleImagesChange: Updates images for existing poles
  const handleExistingPoleImagesChange = (newImages) => {
    setFormData(prev => ({ ...prev, existingPoleImages: newImages }));
  };

  // handleExistingPoleRemarksChange: Updates remarks for existing poles
  const handleExistingPoleRemarksChange = (newRemarks) => {
    setFormData(prev => ({ ...prev, existingPoleRemarks: newRemarks }));
  };

  // handleSubmit: Handles form submission, resets form and shows success message
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    console.log("Submitting Form Data:", JSON.stringify(formData, null, 2));
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData(initialFormData);
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 2000);
  };

  // newPoleSections: Array of configuration objects for rendering new pole sections
  const newPoleSections = [
    {
      title: "Surveillance Pole",
      poleType: "Surveillance pole",
      poles: formData.newPoles["Surveillance pole"],
      onPoleQuantityChange: handlePoleQuantityChange("Surveillance pole"),
      onAddCantilever: handleAddCantilever,
      onChangeCantilever: handleChangeCantilever,
      onRemoveCantilever: handleRemoveCantilever,
      images: formData.departmentData["Surveillance pole"].images,
      onImagesChange: handleDepartmentImagesChange("Surveillance pole"),
      remarks: formData.departmentData["Surveillance pole"].remarks,
      onRemarksChange: handleDepartmentRemarksChange("Surveillance pole"),
    },
    {
      title: "ALPR Pole",
      poleType: "ALPR pole",
      poles: formData.newPoles["ALPR pole"],
      onPoleQuantityChange: handlePoleQuantityChange("ALPR pole"),
      onAddCantilever: handleAddCantilever,
      onChangeCantilever: handleChangeCantilever,
      onRemoveCantilever: handleRemoveCantilever,
      images: formData.departmentData["ALPR pole"].images,
      onImagesChange: handleDepartmentImagesChange("ALPR pole"),
      remarks: formData.departmentData["ALPR pole"].remarks,
      onRemarksChange: handleDepartmentRemarksChange("ALPR pole"),
    },
    {
      title: "Traffic Pole",
      poleType: "Traffic pole",
      poles: formData.newPoles["Traffic pole"],
      onPoleQuantityChange: handlePoleQuantityChange("Traffic pole"),
      onAddCantilever: handleAddCantilever,
      onChangeCantilever: handleChangeCantilever,
      onRemoveCantilever: handleRemoveCantilever,
      images: formData.departmentData["Traffic pole"].images,
      onImagesChange: handleDepartmentImagesChange("Traffic pole"),
      remarks: formData.departmentData["Traffic pole"].remarks,
      onRemarksChange: handleDepartmentRemarksChange("Traffic pole"),
    },
  ];

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm w-[100%] mx-auto">
      <h2 className="text-2xl font-bold text-green-400 mb-6">
        Pole Infrastructure
      </h2>
      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Existing Poles Section */}
        <div className="p-4 rounded-lg border border-gray-200 space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Existing Pole Details</h3>
          <div className="pl-4 space-y-3">
            {["Iron Pole", "Concrete Pole", "Telecom Pole"].map((subType) => (
              <div key={subType} className="flex items-center justify-between">
                <label className="block text-sm text-gray-700">{subType}</label>
                <QuantitySelector
                  count={formData.existingPoleCounts[subType] || 0}
                  setCount={handleExistingPoleCountChange(subType)}
                />
              </div>
            ))}
          </div>
          <ImageUploader
            images={formData.existingPoleImages}
            onImagesChange={handleExistingPoleImagesChange}
            label="Existing Pole Images"
          />
          <div>
            <label
              htmlFor="existing-remarks"
              className="block text-sm font-medium text-gray-700"
            >
              Existing Pole Remarks
            </label>
            <textarea
              id="existing-remarks"
              rows={2}
              value={formData.existingPoleRemarks}
              onChange={(e) => handleExistingPoleRemarksChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-green-400 mt-8 mb-4">
          New Pole Installations
        </h3>
        {/* New Poles (Departmental Sections) */}
        {newPoleSections.map((section) => (
          <NewPoleSection key={section.poleType} {...section} />
        ))}

        {/* Gantry Section */}
        <div className="p-4 rounded-lg border border-gray-200 space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Gantry Details</h3>
          <div className="pl-4 space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm text-gray-700">Gantry Quantity</label>
              <QuantitySelector
                count={formData.gantry.quantity}
                setCount={handleGantryQuantityChange}
              />
            </div>
            <ImageUploader
              images={formData.gantry.images}
              onImagesChange={handleGantryImagesChange}
              label="Gantry Images"
            />
            <div>
              <label htmlFor="gantry-remarks" className="block text-sm font-medium text-gray-700">
                Gantry Remarks
              </label>
              <textarea
                id="gantry-remarks"
                rows={2}
                value={formData.gantry.remarks}
                onChange={(e) => handleGantryRemarksChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Common Fields */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="distance"
              className="block text-sm font-medium text-gray-700"
            >
              Distance between poles (if multiple Racks) - meters
            </label>
            <textarea
              id="distance"
              name="distance"
              rows={2}
              value={formData.distance}
              onChange={(e) =>
                updateFormData('distance', e.target.value)
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Is permission required? <span className="text-red-500">*</span>
            </label>
            <div className="mt-2 space-x-6 flex">
              <RadioInput
                id="permission-yes"
                name="permission"
                value="yes"
                checked={formData.permissionRequired === "yes"}
                onChange={(e) =>
                  updateFormData('permissionRequired', e.target.value)
                }
                label="Yes"
              />
              <RadioInput
                id="permission-no"
                name="permission"
                value="no"
                checked={formData.permissionRequired === "no"}
                onChange={(e) =>
                  updateFormData('permissionRequired', e.target.value)
                }
                label="No"
              />
            </div>
          </div>
        </div>
        
        <div className="pt-5">
          <div className="flex justify-end items-center">
            {submitStatus === "success" && (
              <div className="flex items-center text-green-600 mr-4 animate-fade-in">
                <CheckCircleIcon />
                <span>Successfully Uploaded!</span>
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
        </div>
      </form>
    </div>
  );
};

export default PoleInfrastructureForm;