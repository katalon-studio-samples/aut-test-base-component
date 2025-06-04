import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";

export const AboutPage: React.FC = () => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        About Test Automation Practice
      </h1>
      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              Purpose
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              This platform is designed to help QA engineers and developers
              practice test automation with a variety of real-world scenarios
              and challenges. Each example provides unique testing opportunities
              and edge cases commonly found in web applications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              Features
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Form validations and dynamic inputs</li>
              <li>Interactive UI elements and animations</li>
              <li>File upload and download scenarios</li>
              <li>Authentication and authorization flows</li>
              <li>Dynamic content loading and state management</li>
              <li>Cross-browser compatibility challenges</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              Technologies
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Built with modern web technologies including React, TypeScript,
              and Tailwind CSS. The platform is designed to be responsive,
              accessible, and easy to test.
            </p>
          </section>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Project Team
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Project Owner */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Moataz Nabil
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Project Owner
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Software Engineering Manager, and Developer Advocate with 15+
                years of experience in test automation and quality assurance.
                Passionate about creating robust testing frameworks.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/moatazeldebsy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  data-test="github-link"
                >
                  <Github className="w-5 h-5" />
                  <span className="sr-only">GitHub Profile</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/moataz-nabil/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  data-test="linkedin-link"
                >
                  <Linkedin className="w-5 h-5" />
                  <span className="sr-only">LinkedIn Profile</span>
                </a>
                <a
                  href="mailto:moatazeldebsy@gmail.com"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  data-test="email-link"
                >
                  <Mail className="w-5 h-5" />
                  <span className="sr-only">Email Contact</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
