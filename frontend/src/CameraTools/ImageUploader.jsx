import React, { useState } from "react";
import { TrashIcon, CameraIcon, PhotoLibraryIcon } from "../components/Icons";

const ImageUploader = ({ images, onImagesChange, onTakeImage, galleryImages = [] }) => {
  const [showGallery, setShowGallery] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState([]);
  const btnBaseClass =
    "w-full flex items-center justify-center px-3 py-1.5 border border-dashed border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:border-indigo-500";

  const actions = [
    { label: "Take", icon: CameraIcon, onClick: onTakeImage },
    { label: "Gallery", icon: PhotoLibraryIcon, onClick: () => setShowGallery(true) },
  ];

  const handleGallerySelect = (img) => {
    setSelectedGallery((prev) =>
      prev.includes(img) ? prev.filter((i) => i !== img) : [...prev, img]
    );
  };

  const handleGalleryConfirm = () => {
    onImagesChange([...images, ...selectedGallery]);
    setShowGallery(false);
    setSelectedGallery([]);
  };

  return (
    <div>
      {/* Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">
            <h3 className="text-lg font-bold mb-4">Select from Gallery</h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {galleryImages.length === 0 && <div className="col-span-3 text-gray-400">No images in gallery.</div>}
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative border-2 rounded-md cursor-pointer ${selectedGallery.includes(img) ? 'border-indigo-500' : 'border-gray-200'}`}
                  onClick={() => handleGallerySelect(img)}
                >
                  <img src={img} alt="gallery" className="w-full h-20 object-cover rounded-md" />
                  {selectedGallery.includes(img) && (
                    <span className="absolute top-1 right-1 bg-indigo-500 text-white rounded-full px-1 text-xs">✓</span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="px-3 py-1 rounded bg-gray-200 text-gray-700"
                onClick={() => { setShowGallery(false); setSelectedGallery([]); }}
              >Cancel</button>
              <button
                type="button"
                className="px-3 py-1 rounded bg-indigo-600 text-white disabled:bg-indigo-300"
                disabled={selectedGallery.length === 0}
                onClick={handleGalleryConfirm}
              >Add Selected</button>
            </div>
          </div>
        </div>
      )}
      <label className="block text-sm font-medium text-gray-700">Images</label>

      {images.length > 0 && (
        <div className="mt-2 grid grid-cols-3 gap-2">
          {images.map((img, index) => (
            <div key={index} className="relative group">
              <img
                src={img}
                alt={`Upload ${index + 1}`}
                className="rounded-md border border-gray-300 w-full h-20 object-cover"
              />
              <button
                type="button"
                onClick={() =>
                  onImagesChange(images.filter((_, i) => i !== index))
                }
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5"
              >
                <TrashIcon className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* File input for selecting images from folder */}
      <input
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        id="image-uploader-input"
        onChange={e => {
          const files = Array.from(e.target.files);
          const readers = files.map(file => {
            return new Promise(resolve => {
              const reader = new FileReader();
              reader.onload = ev => resolve(ev.target.result);
              reader.readAsDataURL(file);
            });
          });
          Promise.all(readers).then(imgs => onImagesChange([...images, ...imgs]));
          e.target.value = null;
        }}
      />
      <div className="mt-2 flex items-center space-x-2">
        <label htmlFor="image-uploader-input" className={btnBaseClass} style={{ cursor: 'pointer' }}>
          <PhotoLibraryIcon className="h-4 w-4 mr-1" />
          Browse
        </label>
        {actions.map(({ label, icon: Icon, onClick }) => (
          <button key={label} type="button" onClick={onClick} className={btnBaseClass}>
            <Icon className="h-4 w-4 mr-1" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
