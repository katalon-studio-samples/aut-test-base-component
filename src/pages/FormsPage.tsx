import React from "react";
import { LoginForm } from "../components/LoginForm";

export const FormsPage: React.FC = () => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-bold mb-6">Forms and Validation</h1>
      <p className="mb-6">
        Practice form interactions, validation, and error handling. This example
        includes input validation, error messages, and simulated network delays.
      </p>
      <LoginForm />
    </div>
  );
};
