import React, { useState } from "react";
import { Download, AlertCircle, File, FileType, FileText } from "lucide-react";
import { downloadFile } from "../utils/download";

export const FileDownloadPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  const files = [
    {
      name: "Sample Text",
      filename: "sample.txt",
      type: "TXT",
      size: "1 KB",
      url: "https://raw.githubusercontent.com/moatazeldebsy/test-automation-practice/main/sample-files/sample.txt",
      icon: FileText,
    },
    {
      name: "Sample CSV",
      filename: "sample.csv",
      type: "CSV",
      size: "2 KB",
      url: "https://raw.githubusercontent.com/moatazeldebsy/test-automation-practice/main/sample-files/sample.csv",
      icon: FileType,
    },
    {
      name: "Sample PDF",
      filename: "sample.pdf",
      type: "PDF",
      size: "20 KB",
      url: "https://raw.githubusercontent.com/moatazeldebsy/test-automation-practice/main/sample-files/sample.pdf",
      icon: File,
    },
  ];

  const handleDownload = async (file: (typeof files)[0]) => {
    try {
      setError(null);
      setDownloading(file.filename);
      await downloadFile(file.url, file.filename);
    } catch (err) {
      setError(
        `Failed to download ${file.name}. Please try again later or contact support if the issue persists.`,
      );
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        File Download
      </h1>

      {error && (
        <div
          className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start"
          data-test="error-message"
        >
          <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {files.map((file, index) => {
              const Icon = file.icon;
              return (
                <div
                  key={index}
                  className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
                  data-test={`download-card-${index}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Icon className="w-6 h-6 text-gray-400 dark:text-gray-500 mt-1" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {file.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {file.type} • {file.size}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(file)}
                      disabled={downloading === file.filename}
                      className={`p-2 rounded-full transition-colors ${
                        downloading === file.filename
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                          : "text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      data-test={`download-button-${index}`}
                    >
                      <Download
                        className={`w-5 h-5 ${downloading === file.filename ? "animate-bounce" : ""}`}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
