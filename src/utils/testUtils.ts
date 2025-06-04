import { simulateNetworkDelay } from "./delay";

// Retry mechanism for flaky tests
export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delay = 1000,
): Promise<T> => {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await simulateNetworkDelay(delay, delay);
      }
    }
  }

  throw lastError;
};

// Custom test data attributes
export const getTestId = (id: string) => `[data-test="${id}"]`;

// Wait for element helper
export const waitForElement = async (
  selector: string,
  timeout = 5000,
): Promise<Element | null> => {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const element = document.querySelector(selector);
    if (element) return element;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return null;
};

// Custom assertions
export const assertElementState = {
  isVisible: async (element: Element): Promise<boolean> => {
    const style = window.getComputedStyle(element);
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.opacity !== "0"
    );
  },

  hasText: (element: Element, text: string): boolean => {
    return element.textContent?.includes(text) ?? false;
  },
};
