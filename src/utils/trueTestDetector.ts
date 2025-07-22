export class TrueTestDetector {
  private static instance: TrueTestDetector;
  private sessionData: Map<string, string> = new Map();
  private listeners: Array<(key: string, value: string) => void> = [];

  private constructor() {
    this.initializeDetection();
    this.loadFromSessionStorage();
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
    this.saveToSessionStorage();

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
    this.saveToSessionStorage();

    // Notify listeners for each attribute
    Object.entries(attributes).forEach(([key, value]) => {
      this.listeners.forEach((listener) => listener(key, value));
    });
  }

  public removeSessionAttribute(key: string): void {
    this.sessionData.delete(key);
    this.saveToSessionStorage();
  }

  public clearAllAttributes(): void {
    this.sessionData.clear();
    this.saveToSessionStorage();
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

  private saveToSessionStorage(): void {
    if (typeof window !== "undefined" && window.sessionStorage) {
      const data = Object.fromEntries(this.sessionData);
      window.sessionStorage.setItem(
        "trueTestSessionAttributes",
        JSON.stringify(data),
      );
    }
  }

  private loadFromSessionStorage(): void {
    if (typeof window !== "undefined" && window.sessionStorage) {
      const stored = window.sessionStorage.getItem("trueTestSessionAttributes");
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
}

export const trueTestDetector = TrueTestDetector.getInstance();
