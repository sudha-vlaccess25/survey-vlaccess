// CameraModal: Modal for capturing images from webcam

import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { CameraIcon } from "../components/Icons";

const CameraModal = ({ isOpen, onCapture, onClose }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const startStream = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("Camera API is not supported in this browser.");
        alert(
          "Camera not supported. Please use a modern browser like Chrome or Firefox."
        );
        onClose();
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        alert(
          "Could not access the camera. Please ensure permissions are granted."
        );
        onClose();
      }
    };

    const stopStream = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };

    if (isOpen) {
      startStream();
    } else {
      stopStream();
    }

    return () => {
      stopStream();
    };
  }, [isOpen, onClose]);

  const handleCaptureClick = () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    if (video && video.videoWidth > 0) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        .getContext("2d")
        .drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      onCapture(canvas.toDataURL("image/png"));
      onClose(); // Close modal after capture
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full max-w-4xl h-auto rounded-lg mb-4 border-2 border-gray-600"
      ></video>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleCaptureClick}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Capture
        </button>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CameraModal;