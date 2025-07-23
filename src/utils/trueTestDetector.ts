export class TrueTestDetector {
  private static instance: TrueTestDetector;
  private sessionData: Map<string, string> = new Map();
  private listeners: Array<(key: string, value: string) => void> = [];

  private constructor() {
    this.initializeDetection();
    this.loadFromLocalStorage();
    this.autoCallSDKIfAttributesExist();
    this.setupStorageListener();
  }

  public static getInstance(): TrueTestDetector {
    if (!TrueTestDetector.instance) {
      TrueTestDetector.instance = new TrueTestDetector();
    }
    return TrueTestDetector.instance;
  }

  private initializeDetection(): void {
    // Create TrueTest object if it doesn't exist
    if (typeof window !== "undefined") {
      (window as any).TrueTest = (window as any).TrueTest || {};

      // Override setSessionAttributes method to detect calls
      const originalSetSessionAttributes = (window as any).TrueTest
        .setSessionAttributes;

      (window as any).TrueTest.setSessionAttributes = (
        attributes: Record<string, string>,
      ) => {
        console.log("TrueTest.setSessionAttributes called with:", attributes);

        // Store in our session data
        Object.entries(attributes).forEach(([key, value]) => {
          this.setSessionAttribute(key, value);
        });

        // Call original method if it existed
        if (
          originalSetSessionAttributes &&
          typeof originalSetSessionAttributes === "function"
        ) {
          return originalSetSessionAttributes.call(
            (window as any).TrueTest,
            attributes,
          );
        }

        return attributes;
      };

      // Also provide a getter method
      (window as any).TrueTest.getSessionAttributes = () => {
        return Object.fromEntries(this.sessionData);
      };
    }
  }

  public setSessionAttribute(key: string, value: string): void {
    this.sessionData.set(key, value);
    this.saveToLocalStorage();

    // Notify listeners
    this.listeners.forEach((listener) => listener(key, value));
  }

  public getSessionAttribute(key: string): string | undefined {
    return this.sessionData.get(key);
  }

  public getAllSessionAttributes(): Record<string, string> {
    return Object.fromEntries(this.sessionData);
  }

  public setMultipleAttributes(attributes: Record<string, string>): void {
    Object.entries(attributes).forEach(([key, value]) => {
      this.sessionData.set(key, value);
    });
    this.saveToLocalStorage();

    // Notify listeners for each attribute
    Object.entries(attributes).forEach(([key, value]) => {
      this.listeners.forEach((listener) => listener(key, value));
    });
  }

  public setMultipleAttributesAndCallSDK(
    attributes: Record<string, string>,
  ): void {
    // First store the attributes internally
    this.setMultipleAttributes(attributes);

    // Then call TrueTest.setSessionAttributes which will be detected
    if (typeof window !== "undefined") {
      // Ensure TrueTest object exists
      (window as any).TrueTest = (window as any).TrueTest || {};

      // Call setSessionAttributes - this will be detected by our detector
      if (typeof (window as any).TrueTest.setSessionAttributes === "function") {
        (window as any).TrueTest.setSessionAttributes(attributes);
      } else {
        console.warn(
          "TrueTest.setSessionAttributes is not available. Make sure the TrueTest SDK is loaded.",
        );
      }
    }
  }

  public removeSessionAttribute(key: string): void {
    this.sessionData.delete(key);
    this.saveToLocalStorage();
  }

  public clearAllAttributes(): void {
    this.sessionData.clear();
    this.saveToLocalStorage();
  }

  public addListener(callback: (key: string, value: string) => void): void {
    this.listeners.push(callback);
  }

  public removeListener(callback: (key: string, value: string) => void): void {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  public callTrueTestSetSessionAttributesWithData(
    attributes: Record<string, string>,
  ): void {
    // Use the current session attributes instead of hardcoded test data

    if (typeof window !== "undefined") {
      // Ensure TrueTest object exists
      (window as any).TrueTest = (window as any).TrueTest || {};

      // Call setSessionAttributes - this will be detected by our detector
      if (typeof (window as any).TrueTest.setSessionAttributes === "function") {
        console.log(
          "Calling TrueTest.setSessionAttributes with current session attributes...",
        );
        (window as any).TrueTest.setSessionAttributes(attributes);
      } else {
        console.warn(
          "TrueTest.setSessionAttributes is not available. Make sure the TrueTest SDK is loaded.",
        );
      }
    }
  }

  public callTrueTestSetSessionAttributes(): void {
    // Use the current session attributes from storage
    const currentAttributes = this.getAllSessionAttributes();
    this.callTrueTestSetSessionAttributesWithData(currentAttributes);
  }

  private saveToLocalStorage(): void {
    if (typeof window !== "undefined" && window.localStorage) {
      const data = Object.fromEntries(this.sessionData);
      window.localStorage.setItem(
        "trueTestSessionAttributes",
        JSON.stringify(data),
      );
    }
  }

  private loadFromLocalStorage(): void {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = window.localStorage.getItem("trueTestSessionAttributes");
      if (stored) {
        try {
          const data = JSON.parse(stored);
          Object.entries(data).forEach(([key, value]) => {
            this.sessionData.set(key, value as string);
          });
        } catch (error) {
          console.warn(
            "Failed to load TrueTest session attributes from storage:",
            error,
          );
        }
      }
    }
  }

  private autoCallSDKIfAttributesExist(): void {
    const currentAttributes = this.getAllSessionAttributes();
    // Always call SDK, even if attributes are empty {} to properly clear/reset TrueTest session
    this.callTrueTestSetSessionAttributes();
  }

  private setupStorageListener(): void {
    if (typeof window !== "undefined" && window.addEventListener) {
      window.addEventListener("storage", (event) => {
        if (event.key === "trueTestSessionAttributes") {
          console.log(
            "localStorage trueTestSessionAttributes changed, updating TrueTest session...",
          );
          // Reload the data from localStorage
          this.loadFromLocalStorage();
          // Call TrueTest SDK with the updated values
          this.autoCallSDKIfAttributesExist();
        }
      });
    }
  }
}

export const trueTestDetector = TrueTestDetector.getInstance();
