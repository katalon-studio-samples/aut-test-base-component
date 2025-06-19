import React, { useState } from "react";
import { simulateNetworkDelay } from "../utils/delay";

// Sauce Demo credentials
const VALID_CREDENTIALS = {
  standard_user: { password: "secret_sauce", locked: false },
  locked_out_user: { password: "secret_sauce", locked: true },
  problem_user: { password: "secret_sauce", locked: false },
  performance_glitch_user: { password: "secret_sauce", locked: false },
};

// Mock inventory data
const INVENTORY_ITEMS = [
  {
    id: 1,
    name: "Sauce Labs Backpack",
    description:
      "carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.",
    price: 29.99,
    image: null,
  },
  {
    id: 2,
    name: "Sauce Labs Bike Light",
    description:
      "A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.",
    price: 9.99,
    image: null,
  },
  {
    id: 3,
    name: "Sauce Labs Bolt T-Shirt",
    description:
      "Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.",
    price: 15.99,
    image: null,
  },
  {
    id: 4,
    name: "Sauce Labs Fleece Jacket",
    description:
      "It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.",
    price: 49.99,
    image: null,
  },
  {
    id: 5,
    name: "Sauce Labs Onesie",
    description:
      "Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won't unravel.",
    price: 7.99,
    image: null,
  },
  {
    id: 6,
    name: "Test.allTheThings() T-Shirt (Red)",
    description:
      "This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton.",
    price: 15.99,
    image: null,
  },
];

export const SauceLoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [cartItems, setCartItems] = useState<number[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate network delay for performance_glitch_user
    if (credentials.username === "performance_glitch_user") {
      await simulateNetworkDelay(2000, 4000);
    } else {
      await simulateNetworkDelay(500, 1500);
    }

    const userCredential =
      VALID_CREDENTIALS[credentials.username as keyof typeof VALID_CREDENTIALS];

    if (!userCredential) {
      setError(
        "Epic sadface: Username and password do not match any user in this service",
      );
    } else if (userCredential.password !== credentials.password) {
      setError(
        "Epic sadface: Username and password do not match any user in this service",
      );
    } else if (userCredential.locked) {
      setError("Epic sadface: Sorry, this user has been locked out.");
    } else {
      setIsAuthenticated(true);
      setCurrentUser(credentials.username);
    }

    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser("");
    setCredentials({ username: "", password: "" });
    setError("");
    setCartItems([]);
  };

  const addToCart = (itemId: number) => {
    setCartItems((prev) => [...prev, itemId]);
  };

  const removeFromCart = (itemId: number) => {
    setCartItems((prev) => prev.filter((id) => id !== itemId));
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  Sauce Demo
                </h1>
              </div>
              <div className="flex items-center space-x-8">
                <div className="relative flex items-center justify-center">
                  <button className="p-2 text-gray-600 hover:text-gray-900 flex items-center justify-center">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5.5 8h13l-1.5 9h-10l-1.5-9zm2.5 0V6a4 4 0 118 0v2"
                      />
                    </svg>
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">
                    Welcome, {currentUser}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition-colors"
                    data-test="logout-button"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Products</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {INVENTORY_ITEMS.map((item) => {
                const isInCart = cartItems.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="aspect-w-1 aspect-h-1 w-full">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/300x200?text=Image+Not+Found";
                          }}
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl mb-2">🛍️</div>
                            <div className="text-sm text-gray-600 font-medium">
                              {item.name}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">
                          ${item.price}
                        </span>
                        <button
                          onClick={() =>
                            isInCart
                              ? removeFromCart(item.id)
                              : addToCart(item.id)
                          }
                          className={`px-4 py-2 rounded-md text-sm font-medium ${
                            isInCart
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                          data-test={`add-to-cart-${item.id}`}
                        >
                          {isInCart ? "Remove" : "Add to cart"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Swag Labs
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your credentials to access the application
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
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
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Enter username"
                data-test="username-input"
                required
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
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Enter password"
                data-test="password-input"
                required
              />
            </div>

            {error && (
              <div
                className="bg-red-50 border border-red-200 rounded-md p-4 relative"
                data-test="auth-error"
              >
                <button
                  type="button"
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                  aria-label="Close error"
                  onClick={() => setError("")}
                  data-test="close-error"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                data-test="login-button"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                Available Test Credentials:
              </h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>
                  <strong>standard_user</strong> - Normal user access
                </p>
                <p>
                  <strong>locked_out_user</strong> - Locked out user (will show
                  error)
                </p>
                <p>
                  <strong>problem_user</strong> - User with UI issues
                </p>
                <p>
                  <strong>performance_glitch_user</strong> - User with slow
                  loading
                </p>
                <p className="text-xs mt-2">
                  Password for all users: <strong>secret_sauce</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
