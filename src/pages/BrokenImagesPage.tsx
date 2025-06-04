import React from "react";

const images = [
  {
    src: "https://picsum.photos/200",
    alt: "Valid image",
    description: "This image should load correctly",
  },
  {
    src: "https://example.com/broken-image.jpg",
    alt: "Broken image 1",
    description: "This image URL does not exist",
  },
  {
    src: "invalid-url",
    alt: "Broken image 2",
    description: "This image has an invalid URL format",
  },
];

export const BrokenImagesPage: React.FC = () => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Broken Images
      </h1>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        This page contains both valid and broken images to test image loading
        error handling.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
            data-test={`image-container-${index}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-48 object-cover mb-4 bg-gray-100 dark:bg-gray-700"
              data-test={`image-${index}`}
            />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {image.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
