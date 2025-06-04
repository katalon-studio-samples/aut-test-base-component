import React, { useState } from "react";
import { simulateNetworkDelay } from "../utils/delay";

const VALID_CREDENTIALS = {
  username: "admin",
  password: "admin",
};

export const AuthPage: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    await simulateNetworkDelay();

    if (
      credentials.username === VALID_CREDENTIALS.username &&
      credentials.password === VALID_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
    } else {
      setError("Invalid username or password");
    }

    setIsLoading(false);
  };

  if (isAuthenticated) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-green-100 p-4 rounded" data-test="auth-success">
          <h2 className="text-xl font-semibold text-green-800">
            Successfully authenticated!
          </h2>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            data-test="logout-button"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-bold mb-6">Basic Authentication</h1>
      <div className="max-w-md mx-auto">
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          data-test="auth-form"
        >
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              data-test="username-input"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              data-test="password-input"
            />
          </div>

          {error && (
            <div className="text-red-600" data-test="auth-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            data-test="login-button"
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          <p>Use these credentials to log in:</p>
          <ul className="list-disc list-inside">
            <li>Username: admin</li>
            <li>Password: admin</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
