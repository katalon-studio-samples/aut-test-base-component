import React, { useEffect, useMemo, useRef, useState } from "react";

const esFileUploadMarkup = `
<div _ngcontent-ng-c623308458="" class="es-form-field -es-aligned">
  <label _ngcontent-ng-c623308458="" for="_2-col-cb0" class="es-label -es-required">Upload File</label>
  <div _ngcontent-ng-c623308458="" class="es-file-control">
    <div _ngcontent-ng-c623308458="" class="es-file-name">
      <input _ngcontent-ng-c623308458="" id="txtFileName" type="text" class="es-file-input -es-disabled">
    </div>
    <div _ngcontent-ng-c623308458="" class="es-action">
      <input _ngcontent-ng-c623308458="" id="btnselect" type="button" value="Select file" class="es-button">
    </div>
    <div _ngcontent-ng-c623308458="" class="es-hidden-file-input">
      <input _ngcontent-ng-c623308458="" id="btnFileDialog" type="file" onclick="this.value=null">
    </div>
  </div>
  <!---->
</div>
`.trim();

const esFileUploadStyles = `
.es-form-field {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.es-form-field .es-label {
  font-size: 0.95rem;
  color: #1f2937;
  min-width: 110px;
}

.es-form-field .es-label.-es-required::after {
  content: " *";
  color: #dc2626;
}

.es-file-control {
  display: flex;
  align-items: stretch;
  gap: 0;
}

.es-file-name {
  flex: 1 1 320px;
}

.es-file-name .es-file-input {
  width: 100%;
  padding: 0.55rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem 0 0 0.375rem;
  background-color: #e5e7eb;
  color: #111827;
  font-size: 0.95rem;
}

.es-file-name .es-file-input.-es-disabled {
  cursor: not-allowed;
}

.es-action {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: -1px;
}

.es-action .es-button {
  padding: 0.55rem 0.85rem;
  border: 1px solid #d1d5db;
  font-size: 0.95rem;
  font-weight: 500;
  background-color: #f9fafb;
  color: #1f2937;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.es-action .es-button:first-of-type {
  border-radius: 0 0.375rem 0.375rem 0;
}

.es-action .es-button:first-of-type:hover {
  background-color: #f3f4f6;
}

.es-action .es-button.-es-primary {
  border-radius: 0.375rem;
  background-color: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
}

.es-action .es-button.-es-primary:hover {
  background-color: #1d4ed8;
  border-color: #1d4ed8;
}

.es-hidden-file-input input[type="file"] {
  display: none;
}

.es-section {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.es-section-header h2 {
  font-size: 1.15rem;
  font-weight: 600;
  color: #111827;
}

.es-section-header p {
  margin-top: 0.35rem;
  color: #4b5563;
  font-size: 0.95rem;
}

.es-select-control {
  flex: 1 1 320px;
}

.es-select {
  width: 100%;
  padding: 0.55rem 0.75rem;
  padding-right: 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: #f9fafb;
  color: #111827;
  font-size: 0.95rem;
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, #6b7280 50%),
    linear-gradient(135deg, #6b7280 50%, transparent 50%);
  background-position: calc(100% - 18px) calc(1rem + 1px),
    calc(100% - 13px) calc(1rem + 1px);
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
}

.es-select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 1px #2563eb40;
}

.es-info-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-left: 0.3rem;
  border-radius: 9999px;
  background: #e5f2ff;
  color: #2563eb;
  font-size: 11px;
  font-weight: 600;
}

.es-footnote {
  font-size: 0.85rem;
  color: #6b7280;
}

.es-footnote .es-required-indicator {
  color: #dc2626;
  margin-right: 0.25rem;
}

.es-section-actions {
  display: flex;
  justify-content: flex-end;
}

.es-button-next {
  padding: 0.6rem 1.5rem;
  border-radius: 0.5rem;
  background-color: #1f7665;
  color: #ffffff;
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.es-button-next:hover:not(:disabled) {
  background-color: #176053;
}

.es-button-next:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.es-result-section {
  margin-top: 1.5rem;
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #f9fafb;
  color: #1f2937;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.es-result-section h3 {
  font-size: 1rem;
  font-weight: 600;
}

.es-result-section pre {
  max-height: 320px;
  overflow: auto;
  padding: 0.75rem;
  background-color: #111827;
  color: #10b981;
  border-radius: 0.5rem;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.9rem;
}

.es-feedback {
  min-height: 1.25rem;
}

@media (max-width: 640px) {
  .es-form-field {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .es-file-control {
    flex-direction: column;
    align-items: stretch;
  }

  .es-action {
    margin-left: 0;
    gap: 0.5rem;
  }

  .es-action .es-button:first-of-type {
    border-radius: 0.375rem;
  }
}
`.trim();

type OrganizationOption = {
  id: string;
  name: string;
  studies: { id: string; name: string }[];
  mappings: { id: string; name: string }[];
};

const organizationData: OrganizationOption[] = [
  {
    id: "org-aai-pharma",
    name: "AAI Pharma",
    studies: [
      { id: "study_mf1", name: "study_mf1" },
      { id: "study_mf2", name: "study_mf2" },
    ],
    mappings: [
      { id: "map-aai", name: "AAI Pharma" },
      { id: "map-aai-safety", name: "AAI Pharma - Safety" },
    ],
  },
  {
    id: "org-katalon",
    name: "Katalon Research",
    studies: [
      { id: "study_automation", name: "study_automation" },
      { id: "study_regression", name: "study_regression" },
    ],
    mappings: [
      { id: "map-katalon", name: "Katalon Standard Mapping" },
      { id: "map-katalon-pii", name: "Katalon PII Mapping" },
    ],
  },
];

export const ESFileUploadPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markupContainerRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [selectedOrgId, setSelectedOrgId] = useState<string>(
    organizationData[0]?.id ?? "",
  );
  const [selectedStudyId, setSelectedStudyId] = useState<string>(
    organizationData[0]?.studies[0]?.id ?? "",
  );
  const [selectedMappingId, setSelectedMappingId] = useState<string>(
    organizationData[0]?.mappings[0]?.id ?? "",
  );

  const selectedOrg = useMemo(
    () => organizationData.find((org) => org.id === selectedOrgId),
    [selectedOrgId],
  );

  useEffect(() => {
    if (!selectedOrg) {
      return;
    }

    const firstStudy = selectedOrg.studies[0]?.id ?? "";
    const firstMapping = selectedOrg.mappings[0]?.id ?? "";

    if (!selectedOrg.studies.find((study) => study.id === selectedStudyId)) {
      setSelectedStudyId(firstStudy);
    }

    if (
      !selectedOrg.mappings.find((mapping) => mapping.id === selectedMappingId)
    ) {
      setSelectedMappingId(firstMapping);
    }
  }, [selectedOrg, selectedStudyId, selectedMappingId]);

  useEffect(() => {
    const host = markupContainerRef.current;
    if (!host) {
      return;
    }

    host.innerHTML = esFileUploadMarkup;

    const selectButton = host.querySelector<HTMLInputElement>("#btnselect");
    const hiddenFileInput =
      host.querySelector<HTMLInputElement>("#btnFileDialog");
    const textInput = host.querySelector<HTMLInputElement>("#txtFileName");

    if (!selectButton || !hiddenFileInput || !textInput) {
      return;
    }

    const handleSelectClick = () => {
      hiddenFileInput.click();
    };

    const handleFileChange = () => {
      const file = hiddenFileInput.files?.[0];
      const name = file?.name ?? "";
      textInput.value = name;
      textInput.readOnly = true;
      setSelectedFile(file ?? null);
      setFileContent("");
      setSelectedFileName(name);
      setStatus("idle");
    };

    selectButton.addEventListener("click", handleSelectClick);
    hiddenFileInput.addEventListener("change", handleFileChange);

    return () => {
      selectButton.removeEventListener("click", handleSelectClick);
      hiddenFileInput.removeEventListener("change", handleFileChange);
    };
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) {
      setStatus("error");
      setFileContent("");
      return;
    }

    setStatus("processing");
    setFileContent("");

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setFileContent(result);
      setStatus("success");
    };
    reader.onerror = () => {
      setStatus("error");
      setFileContent("");
    };
    reader.readAsText(selectedFile);
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        ES File Upload DOM
      </h1>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        This page renders the exact DOM structure for the ES upload control,
        matching the original tag and attribute values.
      </p>
      <div
        ref={containerRef}
        className="rounded-md border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 space-y-4"
      >
        <style>{esFileUploadStyles}</style>
        <form className="es-section" onSubmit={handleSubmit}>
          <div className="es-section-header">
            <h2>1. Select organization and Study</h2>
            <p>
              Before uploading your file, select the Organization and Study you
              will be uploading the users to.
            </p>
          </div>
          <div className="es-form-field">
            <label className="es-label -es-required" htmlFor="orgSelect">
              Select Organization
              <span
                className="es-info-icon"
                role="img"
                aria-label="Information about selecting organization"
              >
                i
              </span>
            </label>
            <div className="es-select-control">
              <select
                id="orgSelect"
                className="es-select"
                value={selectedOrgId}
                onChange={(event) => {
                  setSelectedOrgId(event.target.value);
                  setStatus("idle");
                }}
              >
                {organizationData.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="es-form-field">
            <label className="es-label -es-required" htmlFor="studySelect">
              Select Study
            </label>
            <div className="es-select-control">
              <select
                id="studySelect"
                className="es-select"
                value={selectedStudyId}
                onChange={(event) => {
                  setSelectedStudyId(event.target.value);
                  setStatus("idle");
                }}
              >
                {(selectedOrg?.studies ?? []).map((study) => (
                  <option key={study.id} value={study.id}>
                    {study.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="es-form-field">
            <label className="es-label -es-required" htmlFor="mappingSelect">
              Select Mapping
            </label>
            <div className="es-select-control">
              <select
                id="mappingSelect"
                className="es-select"
                value={selectedMappingId}
                onChange={(event) => {
                  setSelectedMappingId(event.target.value);
                  setStatus("idle");
                }}
              >
                {(selectedOrg?.mappings ?? []).map((mapping) => (
                  <option key={mapping.id} value={mapping.id}>
                    {mapping.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div ref={markupContainerRef} />
          <div className="es-feedback text-sm" aria-live="polite">
            {status === "processing" && (
              <span className="text-blue-600 dark:text-blue-400">
                Reading file contents...
              </span>
            )}
            {status === "success" && (
              <span className="text-green-600 dark:text-green-400">
                “{selectedFileName}” ready to upload.
              </span>
            )}
            {status === "error" && (
              <span className="text-red-600 dark:text-red-400">
                Please select a readable file before continuing.
              </span>
            )}
          </div>
          <div className="es-footnote">
            <span className="es-required-indicator">*</span>
            Mandatory fields
          </div>
          <div className="es-section-actions">
            <button
              type="submit"
              className="es-button-next"
              disabled={
                status === "processing" ||
                !selectedFile ||
                !selectedStudyId ||
                !selectedMappingId ||
                !selectedOrgId
              }
            >
              Next
            </button>
          </div>
        </form>
        {status === "success" && (
          <div className="es-result-section">
            <h3>File Preview</h3>
            {fileContent ? (
              <pre>{fileContent}</pre>
            ) : (
              <p>No content found in the uploaded file.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
