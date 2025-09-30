/**
 * Helper functions for testing elements within Shadow DOM
 */

/**
 * Traverses through multiple layers of shadow DOM to find an element
 * @param rootElement - The root element to start traversal from
 * @param selector - CSS selector to find the target element
 * @param maxDepth - Maximum depth to traverse (default: 10)
 * @returns The found element or null
 */
export function findElementInShadowDOM(
  rootElement: Element,
  selector: string,
  maxDepth: number = 10,
): Element | null {
  if (maxDepth <= 0) return null;

  // Try to find element in current level
  const element = rootElement.querySelector(selector);
  if (element) return element;

  // Look for shadow roots and traverse them
  const allElements = rootElement.querySelectorAll("*");
  for (const el of allElements) {
    if (el.shadowRoot) {
      const found = findElementInShadowDOM(
        el.shadowRoot,
        selector,
        maxDepth - 1,
      );
      if (found) return found;
    }
  }

  return null;
}

/**
 * Gets all shadow roots in a given element tree
 * @param rootElement - The root element to start from
 * @returns Array of shadow roots found
 */
export function getAllShadowRoots(rootElement: Element): ShadowRoot[] {
  const shadowRoots: ShadowRoot[] = [];

  function traverse(element: Element) {
    if (element.shadowRoot) {
      shadowRoots.push(element.shadowRoot);
      // Recursively traverse the shadow root
      const shadowElements = element.shadowRoot.querySelectorAll("*");
      shadowElements.forEach(traverse);
    }

    // Traverse regular DOM children
    const children = element.querySelectorAll("*");
    children.forEach(traverse);
  }

  traverse(rootElement);
  return shadowRoots;
}

/**
 * Waits for an element to appear in shadow DOM
 * @param rootElement - The root element to start traversal from
 * @param selector - CSS selector to find the target element
 * @param timeout - Maximum time to wait in milliseconds (default: 5000)
 * @returns Promise that resolves with the element or rejects on timeout
 */
export function waitForElementInShadowDOM(
  rootElement: Element,
  selector: string,
  timeout: number = 5000,
): Promise<Element> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    function check() {
      const element = findElementInShadowDOM(rootElement, selector);
      if (element) {
        resolve(element);
        return;
      }

      if (Date.now() - startTime > timeout) {
        reject(
          new Error(
            `Element with selector "${selector}" not found in shadow DOM within ${timeout}ms`,
          ),
        );
        return;
      }

      setTimeout(check, 100);
    }

    check();
  });
}

/**
 * Test automation constants for TinyMCE in Shadow DOM
 */
export const TINYMCE_SHADOW_SELECTORS = {
  CONTAINER: '[data-test="shadow-dom-container"]',
  SUBMIT_BUTTON: '[data-test="tinymce-submit-btn"]',
  CLEAR_BUTTON: '[data-test="tinymce-clear-btn"]',
  CONTENT_PREVIEW: '[data-test="tinymce-content-preview"]',
  TINYMCE_IFRAME: 'iframe[id*="tiny-react"]',
  TINYMCE_BODY: 'body[data-id*="tiny-react"]',
  TINYMCE_TOOLBAR: ".tox-toolbar",
  TINYMCE_EDITOR: ".tox-edit-area",
} as const;
