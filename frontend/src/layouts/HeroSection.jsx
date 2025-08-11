import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import ImplementationVerticals from "../components/ImplementationVerticals";
import GeneralInformationForm from "../components/GeneralInformationForm";
import NavigationButtons from "./NavigationButtons";
import PoleInfrastructureForm from "../components/PoleInfrastructureForm";
import SubLocationSelector from "../components/SubLocationSelector";
import CameraTypesAndMounting from "../components/CameraTypesAndMounting";
import Announcements from "../components/Announcements";
import NetworkSwitch from "../components/NetworkSwitch";
import TransreceiverModule from "../components/TransreceiverModule";
import PatchPanel from "../components/PatchPanel";
import Rack from "../components/Rack";
import UPS from "../components/UPS";
import TrafficAvailability from "../components/TrafficAvailability";
import Cable from "../components/Cable";

const HeroSection = () => {
  const { currentStep, setCurrentStep, steps } = useOutletContext();
  const totalSteps = steps.length;

  const [implementationType, setImplementationType] = useState("City Surveillance");

  const [formData, setFormData] = useState({
    dateOfSurvey: new Date().toISOString().split("T")[0],
    surveyTeamName: "",
    surveyTeamContact: "",
    implementationAgencyName: "",
    locationSiteName: "",
    cityDistrict: "",
    zoneSectorWardNumber: "",
    latitude: "",
    longitude: "",
    mapMarking: "",
  });

  const [gpsMessage, setGpsMessage] = useState("Unable to retrieve your location");
  const [gpsMessageColor, setGpsMessageColor] = useState("text-red-500");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGpsClick = () => {
    setGpsMessage("Fetching current location...");
    setGpsMessageColor("text-blue-500");

    if (!navigator.geolocation) {
      setGpsMessage("Geolocation is not supported by your browser.");
      setGpsMessageColor("text-red-500");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setFormData((prev) => ({
          ...prev,
          latitude: coords.latitude.toFixed(6),
          longitude: coords.longitude.toFixed(6),
        }));
        setGpsMessage("Location retrieved successfully!");
        setGpsMessageColor("text-green-600");
      },
      (error) => {
        const messages = {
          1: "Location permission denied.",
          2: "Location information unavailable.",
          3: "Location request timed out.",
        };
        setGpsMessage(messages[error.code] || "An unknown error occurred.");
        setGpsMessageColor("text-red-500");
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const handleClearGps = () => {
    setFormData((prev) => ({
      ...prev,
      latitude: "",
      longitude: "",
    }));
    setGpsMessage("Location cleared.");
    setGpsMessageColor("text-yellow-500");
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Survey Finished!", { implementationType, ...formData });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSkip = () => {
    // Skipping a step is functionally the same as proceeding to the next one
    // without saving the current step's data. Since `handleNext` already
    // does this, we can just reuse it.
    handleNext();
  };

  return (
    <div className="flex-grow flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        {currentStep === 1 && (
          <ImplementationVerticals
            selectedType={implementationType}
            onTypeChange={setImplementationType}
          />
        )}
        {currentStep === 2 && (
          <GeneralInformationForm
            formData={formData}
            handleChange={handleChange}
            handleGpsClick={handleGpsClick}
            handleClearGps={handleClearGps}
            gpsMessage={gpsMessage}
            gpsMessageColor={gpsMessageColor}
          />
        )}
        {currentStep === 3 && (
          <SubLocationSelector
            formData={formData}
            handleChange={handleChange}
            implementationType={implementationType}
          />
        )}
        {currentStep === 4 && <PoleInfrastructureForm />}
        {currentStep === 5 && <CameraTypesAndMounting />}
        {currentStep === 6 && <Announcements />}
        {currentStep === 7 && <NetworkSwitch />}
        {currentStep === 8 && <TransreceiverModule />}
        {currentStep === 9 && <PatchPanel />}
        {currentStep === 10 && <Rack />}
        {currentStep === 11 && <UPS />}
        {currentStep === 12 && <TrafficAvailability />}
        {currentStep === 13 && <Cable />}
      </div>
      <div className="mt-auto pt-6">
        <NavigationButtons
          onPrevious={handleBack}
          onNext={handleNext}
          onSkip={currentStep >= 4 ? handleSkip : undefined}
          disablePrevious={currentStep === 1}
          isLastPage={currentStep === totalSteps}
          finishText="Submit Survey"
        />
      </div>
    </div>
  );
};

export default HeroSection;
