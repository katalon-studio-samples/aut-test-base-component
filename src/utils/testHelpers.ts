// Custom test event helpers
export const testEvents = {
  // Mouse events
  click: (element: Element) => {
    element.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      }),
    );
  },

  // Keyboard events
  type: (element: Element, value: string) => {
    if (element instanceof HTMLInputElement) {
      element.value = value;
      element.dispatchEvent(new Event("input", { bubbles: true }));
      element.dispatchEvent(new Event("change", { bubbles: true }));
    }
  },

  // Form events
  submit: (form: HTMLFormElement) => {
    form.dispatchEvent(
      new Event("submit", {
        bubbles: true,
        cancelable: true,
      }),
    );
  },

  // Drag and Drop events
  drag: (source: Element, target: Element) => {
    const dragStartEvent = new DragEvent("dragstart", {
      bubbles: true,
      cancelable: true,
    });

    const dropEvent = new DragEvent("drop", {
      bubbles: true,
      cancelable: true,
    });

    source.dispatchEvent(dragStartEvent);
    target.dispatchEvent(dropEvent);
  },
};

// Screenshot helper
export const takeScreenshot = async (element: Element): Promise<string> => {
  // Implementation would depend on testing framework
  return "screenshot-data";
};

// Network request mocking
export const mockNetworkRequest = (url: string, response: any) => {
  // Implementation would depend on testing framework
  console.log(`Mocking ${url} with`, response);
};
