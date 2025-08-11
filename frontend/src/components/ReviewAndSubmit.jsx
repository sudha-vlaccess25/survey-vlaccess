import React from 'react';
import { CheckCircleIcon } from './Icons.jsx';
import './ReviewAndSubmit.css';

// Reusable component to display a simple key-value pair
const InfoItem = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-200">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <span className="text-sm text-gray-900">{value}</span>
  </div>
);

// Component to display a list of items (e.g., custom ports)
const InfoList = ({ title, items }) => (
  <div className="mt-4 border-t border-gray-200 pt-4">
    <h4 className="text-lg font-bold text-gray-700">{title}</h4>
    <ul className="mt-2 space-y-2">
      {items.map((item, index) => (
        <li key={index} className="bg-gray-50 p-3 rounded-lg">
          <InfoItem label="Name" value={item.name || "N/A"} />
          <InfoItem label="Quantity" value={item.quantity} />
          <InfoItem label="Remarks" value={item.remarks || "N/A"} />
        </li>
      ))}
    </ul>
  </div>
);

// Main review component
export default function ReviewAndSubmit({ subLocation, data, onSubmit }) {
  if (!data) {
    return <div>Loading data...</div>;
  }

  const {
    networkSwitches,
    transreceivers,
    patchPanels,
    racks,
    trafficAvailability,
    cables
  } = data;

  return (
    <div className="review-container">
      <div className="review-header">
        <h2 className="review-heading">Review & Submit</h2>
        <p className="sub-heading">Final check for sub-location: <span className="font-semibold text-indigo-600">{subLocation}</span></p>
      </div>

      <div className="review-content">
        {/* Network Switch Section */}
        <div className="review-section">
          <h3 className="section-heading">Network Switches</h3>
          {networkSwitches && networkSwitches.map((sw, index) => (
            <div key={index} className="review-item-group">
              <h4 className="item-title">Switch #{index + 1}</h4>
              <InfoItem label="Multi SFP" value={sw.multiSFP} />
              <InfoItem label="Multi SFP Remarks" value={sw.multiSFPRemarks || "N/A"} />
              <InfoItem label="4 Port SFP" value={sw.fourPortSFP} />
              <InfoItem label="4 Port SFP Remarks" value={sw.fourPortSFPRemarks || "N/A"} />
              <InfoItem label="2 Port SFP" value={sw.twoPortSFP} />
              <InfoItem label="2 Port SFP Remarks" value={sw.twoPortSFPRemarks || "N/A"} />
              {sw.customPorts && sw.customPorts.length > 0 && (
                <InfoList title="Custom Ports" items={sw.customPorts} />
              )}
            </div>
          ))}
        </div>

        {/* Transreceiver Module Section */}
        <div className="review-section">
          <h3 className="section-heading">Transreceiver Modules</h3>
          {transreceivers && transreceivers.map((tr, index) => (
            <div key={index} className="review-item-group">
              <h4 className="item-title">Module #{index + 1}</h4>
              <InfoItem label="Port Name" value={tr.name || "N/A"} />
              <InfoItem label="Quantity" value={tr.quantity} />
              <InfoItem label="Remarks" value={tr.remarks || "N/A"} />
            </div>
          ))}
        </div>
        
        {/* Patch Panel Section */}
        <div className="review-section">
          <h3 className="section-heading">Patch Panels</h3>
          {patchPanels && patchPanels.map((p, index) => (
            <div key={index} className="review-item-group">
              <h4 className="item-title">Panel #{index + 1}</h4>
              <InfoItem label="Name" value={p.name || "N/A"} />
              <InfoItem label="Quantity" value={p.quantity} />
              <InfoItem label="Remarks" value={p.remarks || "N/A"} />
            </div>
          ))}
        </div>

        {/* Rack Section */}
        <div className="review-section">
          <h3 className="section-heading">Racks</h3>
          {racks && racks.racks.map((r, index) => (
            <div key={index} className="review-item-group">
              <h4 className="item-title">Rack #{index + 1}</h4>
              <h5 className="sub-item-title">Indoor</h5>
              <InfoItem label="Remarks" value={r.indoorRemarks || "N/A"} />
              <h5 className="sub-item-title mt-2">Outdoor</h5>
              <InfoItem label="Remarks" value={r.outdoorRemarks || "N/A"} />
              {/* Display Images Placeholder */}
              {(r.indoorImages.length > 0 || r.outdoorImages.length > 0) && (
                <p className="mt-2 text-sm text-gray-500">Images attached</p>
              )}
            </div>
          ))}
        </div>
        
        {/* Traffic Availability Section */}
        <div className="review-section">
          <h3 className="section-heading">Traffic Availability</h3>
          <div className="review-item-group">
            <InfoItem label="Is Available?" value={trafficAvailability.isAvailable ? "Yes" : "No"} />
            {trafficAvailability.isAvailable && (
              <>
                <InfoItem label="Remarks" value={trafficAvailability.remarks || "N/A"} />
                {trafficAvailability.images.length > 0 && (
                  <p className="mt-2 text-sm text-gray-500">Images attached</p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Cable Section */}
        <div className="review-section">
          <h3 className="section-heading">Cables</h3>
          {cables && cables.map((c, index) => (
            <div key={index} className="review-item-group">
              <h4 className="item-title">Cable #{index + 1}</h4>
              <InfoItem label="Cat 6 Outdoor" value={c.cat6Outdoor} />
              <InfoItem label="Cat 6 Indoor" value={c.cat6Indoor} />
              <InfoItem label="OFC" value={c.ofc} />
              <InfoItem label="Remarks" value={c.remarks || "N/A"} />
            </div>
          ))}
        </div>

      </div>

      <div className="submit-actions">
        <button
          onClick={onSubmit}
          className="submit-button"
        >
          <CheckCircleIcon className="h-5 w-5 mr-2" />
          Submit All Data
        </button>
      </div>
    </div>
  );
}