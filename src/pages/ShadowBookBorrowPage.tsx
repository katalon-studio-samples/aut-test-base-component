import React, { useEffect, useRef, useState } from "react";

interface BorrowRegistration {
  borrowerName: string;
  email: string;
  phone: string;
  libraryCard: string;
  bookTitle: string;
  borrowDate: string;
  dueDate: string;
  termsAccepted: boolean;
}

const initialRegistration: BorrowRegistration = {
  borrowerName: "",
  email: "",
  phone: "",
  libraryCard: "",
  bookTitle: "",
  borrowDate: "",
  dueDate: "",
  termsAccepted: false,
};

export const ShadowBookBorrowPage: React.FC = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);
  const [registration, setRegistration] =
    useState<BorrowRegistration>(initialRegistration);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!hostRef.current) {
      return;
    }

    const shadowRoot =
      hostRef.current.shadowRoot ||
      hostRef.current.attachShadow({ mode: "open" });
    shadowRootRef.current = shadowRoot;
    shadowRoot.replaceChildren();

    const style = document.createElement("style");
    style.textContent = `
      * {
        box-sizing: border-box;
      }

      .borrow-panel {
        border: 1px solid #d1d5db;
        border-radius: 8px;
        background: #ffffff;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: #111827;
      }

      .shadow-label {
        display: inline-flex;
        align-items: center;
        border-radius: 999px;
        background: #eef2ff;
        color: #3730a3;
        font-size: 12px;
        font-weight: 700;
        padding: 4px 10px;
        margin-bottom: 16px;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .field.full {
        grid-column: 1 / -1;
      }

      label,
      legend {
        font-size: 13px;
        font-weight: 700;
        color: #374151;
      }

      input,
      select {
        width: 100%;
        border: 1px solid #9ca3af;
        border-radius: 6px;
        padding: 9px 10px;
        font-size: 14px;
        color: #111827;
        background: #ffffff;
      }

      input:focus,
      select:focus {
        outline: 2px solid #2563eb;
        outline-offset: 1px;
      }

      .checkbox-row {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        margin-top: 16px;
        font-size: 14px;
        color: #374151;
      }

      .checkbox-row input {
        width: auto;
        margin-top: 2px;
      }

      .actions {
        display: flex;
        gap: 10px;
        margin-top: 18px;
      }

      button {
        border: 0;
        border-radius: 6px;
        padding: 10px 14px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
      }

      .submit-button {
        background: #2563eb;
        color: #ffffff;
      }

      .reset-button {
        background: #e5e7eb;
        color: #111827;
      }

      @media (max-width: 720px) {
        .form-grid {
          grid-template-columns: 1fr;
        }
      }
    `;

    const wrapper = document.createElement("div");
    wrapper.className = "borrow-panel";
    wrapper.innerHTML = `
      <div class="shadow-label">Shadow DOM book borrow form</div>
      <form data-test="shadow-book-borrow-form">
        <div class="form-grid">
          <div class="field">
            <label for="borrower-name">Borrower name</label>
            <input id="borrower-name" data-test="shadow-borrower-name" name="borrowerName" type="text" autocomplete="name" required />
          </div>
          <div class="field">
            <label for="borrower-email">Email</label>
            <input id="borrower-email" data-test="shadow-borrower-email" name="email" type="email" autocomplete="email" required />
          </div>
          <div class="field">
            <label for="borrower-phone">Phone number</label>
            <input id="borrower-phone" data-test="shadow-borrower-phone" name="phone" type="tel" autocomplete="tel" required />
          </div>
          <div class="field">
            <label for="library-card">Library card number</label>
            <input id="library-card" data-test="shadow-library-card" name="libraryCard" type="text" required />
          </div>
          <div class="field full">
            <label for="book-title">Book title</label>
            <select id="book-title" data-test="shadow-book-title" name="bookTitle" required>
              <option value="">Select a book</option>
              <option value="Clean Code">Clean Code</option>
              <option value="Designing Data-Intensive Applications">Designing Data-Intensive Applications</option>
              <option value="The Pragmatic Programmer">The Pragmatic Programmer</option>
            </select>
          </div>
          <div class="field">
            <label for="borrow-date">Borrow date</label>
            <input id="borrow-date" data-test="shadow-borrow-date" name="borrowDate" type="date" required />
          </div>
          <div class="field">
            <label for="due-date">Due date</label>
            <input id="due-date" data-test="shadow-due-date" name="dueDate" type="date" required />
          </div>
        </div>
        <label class="checkbox-row">
          <input data-test="shadow-borrow-terms" name="termsAccepted" type="checkbox" required />
          <span>I confirm the borrower accepts library loan terms.</span>
        </label>
        <div class="actions">
          <button class="submit-button" data-test="shadow-borrow-submit" type="submit">Register borrow</button>
          <button class="reset-button" data-test="shadow-borrow-reset" type="reset">Reset</button>
        </div>
      </form>
    `;

    const form = wrapper.querySelector(
      '[data-test="shadow-book-borrow-form"]',
    ) as HTMLFormElement | null;

    const handleSubmit = (event: SubmitEvent) => {
      event.preventDefault();
      if (!form) {
        return;
      }

      const data = new FormData(form);
      setRegistration({
        borrowerName: String(data.get("borrowerName") || ""),
        email: String(data.get("email") || ""),
        phone: String(data.get("phone") || ""),
        libraryCard: String(data.get("libraryCard") || ""),
        bookTitle: String(data.get("bookTitle") || ""),
        borrowDate: String(data.get("borrowDate") || ""),
        dueDate: String(data.get("dueDate") || ""),
        termsAccepted: data.get("termsAccepted") === "on",
      });
      setSubmitted(true);
    };

    const handleReset = () => {
      setRegistration(initialRegistration);
      setSubmitted(false);
    };

    form?.addEventListener("submit", handleSubmit);
    form?.addEventListener("reset", handleReset);

    shadowRoot.append(style, wrapper);

    return () => {
      form?.removeEventListener("submit", handleSubmit);
      form?.removeEventListener("reset", handleReset);
      shadowRoot.replaceChildren();
      shadowRootRef.current = null;
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1
          className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
          data-test="shadow-book-borrow-heading"
        >
          Shadow DOM Book Borrow Registration
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Register a borrowed book using form controls encapsulated inside an
          open Shadow DOM root.
        </p>
      </div>

      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
        <div ref={hostRef} data-test="shadow-book-borrow-host" />
      </section>

      <section className="mt-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Borrow Registration Result
        </h2>
        <div
          className="rounded-md bg-gray-50 dark:bg-gray-900 p-4 text-sm text-gray-800 dark:text-gray-100"
          data-test="shadow-book-borrow-result"
        >
          {submitted ? (
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <dt className="font-semibold">Borrower</dt>
                <dd>{registration.borrowerName}</dd>
              </div>
              <div>
                <dt className="font-semibold">Email</dt>
                <dd>{registration.email}</dd>
              </div>
              <div>
                <dt className="font-semibold">Phone</dt>
                <dd>{registration.phone}</dd>
              </div>
              <div>
                <dt className="font-semibold">Library card</dt>
                <dd>{registration.libraryCard}</dd>
              </div>
              <div>
                <dt className="font-semibold">Book</dt>
                <dd>{registration.bookTitle}</dd>
              </div>
              <div>
                <dt className="font-semibold">Loan window</dt>
                <dd>
                  {registration.borrowDate} to {registration.dueDate}
                </dd>
              </div>
            </dl>
          ) : (
            "No borrow registration submitted."
          )}
        </div>
      </section>
    </div>
  );
};
