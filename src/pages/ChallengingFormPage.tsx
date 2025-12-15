import React, { useEffect, useState } from "react";

export const ChallengingFormPage: React.FC = () => {
  const [dynamicIds, setDynamicIds] = useState<Record<string, string>>({});
  const [dynamicClasses, setDynamicClasses] = useState<Record<string, string>>(
    {},
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    experience: "",
    language: "",
  });
  const [showResult, setShowResult] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const generateDynamicId = () => {
    return "id_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
  };

  const generateDynamicClass = (base: string) => {
    return base + "_" + Math.random().toString(36).substr(2, 6);
  };

  useEffect(() => {
    const ids: Record<string, string> = {
      nameInput: generateDynamicId(),
      emailInput: generateDynamicId(),
      phoneInput: generateDynamicId(),
      countryDropdown: generateDynamicId(),
      experienceDropdown: generateDynamicId(),
      languageDropdown: generateDynamicId(),
      submitBtn: generateDynamicId(),
      resultDiv: generateDynamicId(),
      countryList: generateDynamicId(),
      experienceList: generateDynamicId(),
      languageList: generateDynamicId(),
    };

    const optionIds: Record<string, string> = {};
    ["us", "uk", "ca", "au", "de", "fr", "jp", "sg"].forEach((country) => {
      optionIds[`country-${country}`] = generateDynamicId();
    });
    ["beginner", "intermediate", "advanced", "expert"].forEach((level) => {
      optionIds[`experience-${level}`] = generateDynamicId();
    });
    [
      "javascript",
      "python",
      "java",
      "csharp",
      "ruby",
      "go",
      "rust",
      "typescript",
    ].forEach((lang) => {
      optionIds[`language-${lang}`] = generateDynamicId();
    });

    const classes: Record<string, string> = {
      inputField: generateDynamicClass("input"),
      dropdownHeader: generateDynamicClass("dropdown"),
      dropdownList: generateDynamicClass("list"),
      dropdownOption: generateDynamicClass("option"),
      submitButton: generateDynamicClass("btn"),
    };

    setDynamicIds({ ...ids, ...optionIds });
    setDynamicClasses(classes);
    console.log("Dynamic IDs and classes generated!", {
      ids: { ...ids, ...optionIds },
      classes,
    });
  }, []);

  const handleDropdownSelect = (
    field: string,
    value: string,
    label: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setOpenDropdown(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResult(true);
    console.log("Form submitted:", formData);
  };

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const countries = [
    { value: "us", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "ca", label: "Canada" },
    { value: "au", label: "Australia" },
    { value: "de", label: "Germany" },
    { value: "fr", label: "France" },
    { value: "jp", label: "Japan" },
    { value: "sg", label: "Singapore" },
  ];

  const experienceLevels = [
    { value: "beginner", label: "Beginner (0-1 years)" },
    { value: "intermediate", label: "Intermediate (2-4 years)" },
    { value: "advanced", label: "Advanced (5-7 years)" },
    { value: "expert", label: "Expert (8+ years)" },
  ];

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "ruby", label: "Ruby" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "typescript", label: "TypeScript" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
          🎯 Test Automation Challenge Form
        </h1>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-6 rounded">
          <h3 className="font-bold text-yellow-800 dark:text-yellow-300 mb-2">
            Automation Challenges:
          </h3>
          <ul className="list-disc list-inside text-yellow-700 dark:text-yellow-400 space-y-1 text-sm">
            <li>All element IDs are dynamically generated on page load</li>
            <li>
              All CSS classes are dynamically generated with random suffixes
            </li>
            <li>NO data-testid or data-value attributes available</li>
            <li>
              Dropdown options use &lt;p&gt; tags instead of standard
              &lt;option&gt;
            </li>
            <li>Custom dropdown implementation (not native &lt;select&gt;)</li>
            <li>IDs and classes change every time the page is refreshed</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} id="challengeForm">
          <div className="mb-5">
            <label className="block mb-2 font-bold text-gray-700 dark:text-gray-300">
              Full Name:
            </label>
            <input
              type="text"
              id={dynamicIds.nameInput}
              className={`${dynamicClasses.inputField} w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter your full name"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-bold text-gray-700 dark:text-gray-300">
              Email Address:
            </label>
            <input
              type="email"
              id={dynamicIds.emailInput}
              className={`${dynamicClasses.inputField} w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-bold text-gray-700 dark:text-gray-300">
              Phone Number:
            </label>
            <input
              type="tel"
              id={dynamicIds.phoneInput}
              className={`${dynamicClasses.inputField} w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="Enter your phone number"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-bold text-gray-700 dark:text-gray-300">
              Country (Custom Dropdown with &lt;p&gt; tags):
            </label>
            <div className="relative">
              <div
                id={dynamicIds.countryDropdown}
                className={`${dynamicClasses.dropdownHeader} w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded cursor-pointer bg-white dark:bg-gray-700 flex justify-between items-center hover:border-gray-400 dark:hover:border-gray-500`}
                onClick={() => toggleDropdown("country")}
              >
                <span className="text-gray-700 dark:text-gray-300">
                  {formData.country
                    ? countries.find((c) => c.value === formData.country)?.label
                    : "Select a country"}
                </span>
                <span
                  className={`transition-transform ${openDropdown === "country" ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </div>
              {openDropdown === "country" && (
                <div
                  id={dynamicIds.countryList}
                  className={`${dynamicClasses.dropdownList} absolute w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-b max-h-48 overflow-y-auto z-50 shadow-lg`}
                >
                  {countries.map((country) => (
                    <p
                      key={country.value}
                      id={dynamicIds[`country-${country.value}`]}
                      className={`${dynamicClasses.dropdownOption} px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 m-0 ${
                        formData.country === country.value
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                      onClick={() =>
                        handleDropdownSelect(
                          "country",
                          country.value,
                          country.label,
                        )
                      }
                    >
                      {country.label}
                    </p>
                  ))}
                </div>
              )}
              <input type="hidden" name="country" value={formData.country} />
            </div>
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-bold text-gray-700 dark:text-gray-300">
              Experience Level (Another Custom Dropdown):
            </label>
            <div className="relative">
              <div
                id={dynamicIds.experienceDropdown}
                className={`${dynamicClasses.dropdownHeader} w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded cursor-pointer bg-white dark:bg-gray-700 flex justify-between items-center hover:border-gray-400 dark:hover:border-gray-500`}
                onClick={() => toggleDropdown("experience")}
              >
                <span className="text-gray-700 dark:text-gray-300">
                  {formData.experience
                    ? experienceLevels.find(
                        (e) => e.value === formData.experience,
                      )?.label
                    : "Select experience level"}
                </span>
                <span
                  className={`transition-transform ${openDropdown === "experience" ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </div>
              {openDropdown === "experience" && (
                <div
                  id={dynamicIds.experienceList}
                  className={`${dynamicClasses.dropdownList} absolute w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-b max-h-48 overflow-y-auto z-50 shadow-lg`}
                >
                  {experienceLevels.map((level) => (
                    <p
                      key={level.value}
                      id={dynamicIds[`experience-${level.value}`]}
                      className={`${dynamicClasses.dropdownOption} px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 m-0 ${
                        formData.experience === level.value
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                      onClick={() =>
                        handleDropdownSelect(
                          "experience",
                          level.value,
                          level.label,
                        )
                      }
                    >
                      {level.label}
                    </p>
                  ))}
                </div>
              )}
              <input
                type="hidden"
                name="experience"
                value={formData.experience}
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-bold text-gray-700 dark:text-gray-300">
              Programming Language (Dynamic ID Dropdown):
            </label>
            <div className="relative">
              <div
                id={dynamicIds.languageDropdown}
                className={`${dynamicClasses.dropdownHeader} w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded cursor-pointer bg-white dark:bg-gray-700 flex justify-between items-center hover:border-gray-400 dark:hover:border-gray-500`}
                onClick={() => toggleDropdown("language")}
              >
                <span className="text-gray-700 dark:text-gray-300">
                  {formData.language
                    ? languages.find((l) => l.value === formData.language)
                        ?.label
                    : "Select programming language"}
                </span>
                <span
                  className={`transition-transform ${openDropdown === "language" ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </div>
              {openDropdown === "language" && (
                <div
                  id={dynamicIds.languageList}
                  className={`${dynamicClasses.dropdownList} absolute w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-b max-h-48 overflow-y-auto z-50 shadow-lg`}
                >
                  {languages.map((lang) => (
                    <p
                      key={lang.value}
                      id={dynamicIds[`language-${lang.value}`]}
                      className={`${dynamicClasses.dropdownOption} px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 m-0 ${
                        formData.language === lang.value
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                      onClick={() =>
                        handleDropdownSelect("language", lang.value, lang.label)
                      }
                    >
                      {lang.label}
                    </p>
                  ))}
                </div>
              )}
              <input type="hidden" name="language" value={formData.language} />
            </div>
          </div>

          <button
            type="submit"
            id={dynamicIds.submitBtn}
            className={`${dynamicClasses.submitButton} w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded mt-6 transition-colors`}
          >
            Submit Form
          </button>
        </form>

        {showResult && (
          <div
            id={dynamicIds.resultDiv}
            className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800"
          >
            <h3 className="font-bold text-green-800 dark:text-green-300 mb-3">
              Form Submitted Successfully! ✅
            </h3>
            <div className="space-y-2 text-sm text-green-700 dark:text-green-400">
              <p>
                <strong>Name:</strong> {formData.name}
              </p>
              <p>
                <strong>Email:</strong> {formData.email}
              </p>
              <p>
                <strong>Phone:</strong> {formData.phone}
              </p>
              <p>
                <strong>Country:</strong> {formData.country}
              </p>
              <p>
                <strong>Experience:</strong> {formData.experience}
              </p>
              <p>
                <strong>Language:</strong> {formData.language}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
