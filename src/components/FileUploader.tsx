import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { simulateNetworkDelay } from "../utils/delay";
import type { FileUploadResponse } from "../types";

export const FileUploader: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = [...e.dataTransfer.files];
    await handleFiles(files);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? [...e.target.files] : [];
    await handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    setLoading(true);
    await simulateNetworkDelay(2000, 4000);

    const newFiles: FileUploadResponse[] = files.map((file) => ({
      success: true,
      filename: file.name,
      size: file.size,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    setLoading(false);
  };

  return (
    <div className="space-y-4 px-2 sm:px-0" data-test="file-uploader">
      <div
        className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-600"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        data-test="drop-zone"
      >
        <Upload className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Drag and drop files here, or{" "}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            data-test="file-select-button"
          >
            browse
          </button>
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileInput}
          data-test="file-input"
        />
      </div>

      {loading && (
        <div
          className="text-center text-gray-700 dark:text-gray-300"
          data-test="upload-loading"
        >
          <p>Uploading...</p>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="mt-4" data-test="uploaded-files">
          <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
            Uploaded Files
          </h3>
          <ul className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded"
                data-test={`uploaded-file-${index}`}
              >
                <span className="truncate max-w-[70%] text-gray-900 dark:text-white">
                  {file.filename}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {(file.size / 1024).toFixed(2)} KB
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
