<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Base AUT Existing Case Response Fixture</title>
    <style>
      * {
        box-sizing: border-box;
      }

      body {
        background: #dfe3e7;
        color: #222;
        font-family: Arial, Helvetica, sans-serif;
        margin: 0;
      }

      .topbar {
        align-items: center;
        background: #2d98c6;
        color: #fff;
        display: flex;
        height: 34px;
        justify-content: center;
      }

      .topbar-inner {
        align-items: center;
        display: flex;
        justify-content: space-between;
        max-width: 1040px;
        width: 100%;
      }

      .brand {
        align-items: center;
        background: #fff;
        border: 1px solid #c7c7c7;
        color: #1a3848;
        display: flex;
        font-size: 12px;
        font-weight: 700;
        height: 26px;
        justify-content: center;
        line-height: 12px;
        width: 88px;
      }

      .nav {
        display: flex;
        gap: 34px;
        font-size: 13px;
        font-weight: 700;
      }

      .shell {
        background: #fff;
        margin: 0 auto;
        min-height: 760px;
        width: 1040px;
      }

      .case-header {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 20px;
        padding: 18px 8px 0;
      }

      .case-meta {
        color: #333;
        display: grid;
        font-size: 12px;
        gap: 6px;
        grid-template-columns: 160px 120px 1fr;
      }

      .case-actions {
        align-items: start;
        display: flex;
        gap: 4px;
      }

      .case-actions button,
      .case-actions select {
        border: 1px solid #2a88b4;
        border-radius: 2px;
        color: #256c8d;
        font-size: 12px;
        height: 26px;
        padding: 0 8px;
      }

      .case-actions button {
        background: #eef8fc;
        cursor: pointer;
        font-weight: 700;
      }

      .tabs {
        align-items: end;
        border-bottom: 4px solid #185d7b;
        display: flex;
        gap: 8px;
        margin-top: 24px;
        padding-left: 332px;
      }

      .tab {
        color: #2c9bc7;
        font-size: 14px;
        font-weight: 700;
        padding: 11px 28px;
      }

      .tab.active {
        background: #5fa3c9;
        color: #d9edf6;
      }

      .content {
        padding: 16px 8px 40px;
      }

      .status-grid {
        border-bottom: 1px solid #d0d0d0;
        display: grid;
        grid-template-columns: 160px 160px 1fr;
        margin-bottom: 20px;
        padding-bottom: 12px;
      }

      .status-grid div {
        border-right: 1px solid #d0d0d0;
        min-height: 44px;
        padding-right: 12px;
      }

      .status-grid div:last-child {
        border-right: 0;
      }

      .label {
        color: #555;
        display: block;
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 7px;
      }

      .value {
        color: #333;
        font-size: 12px;
        text-decoration: underline;
      }

      .section-title {
        border-bottom: 2px solid #2e95c4;
        font-size: 16px;
        font-weight: 400;
        margin: 0 0 12px;
        padding-bottom: 8px;
      }

      .form-grid {
        display: grid;
        gap: 12px 18px;
        grid-template-columns: 1fr 1fr;
      }

      .field label {
        color: #333;
        display: block;
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 5px;
      }

      .field input,
      .field select {
        background: #eee;
        border: 1px solid #d0d0d0;
        border-radius: 4px;
        color: #555;
        height: 28px;
        padding: 4px 8px;
        width: 100%;
      }

      .open-popup-button {
        background: #2e95c4;
        border: 1px solid #0a6799;
        border-radius: 4px;
        color: #fff;
        cursor: pointer;
        font-size: 14px;
        font-weight: 700;
        height: 36px;
        margin-top: 22px;
        padding: 0 16px;
      }

      .origin-note {
        color: #555;
        font-size: 12px;
        margin-top: 14px;
      }

      .popup-root[hidden] {
        display: none;
      }

      .overlay {
        background: rgba(0, 0, 0, 0.55);
        bottom: 0;
        left: 0;
        position: fixed;
        right: 0;
        top: 0;
        z-index: 10;
      }

      .modal {
        background: #fff;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
        left: 4px;
        min-height: 742px;
        position: fixed;
        top: 5px;
        width: min(600px, calc(100% - 12px));
        z-index: 11;
      }

      .modal-header {
        align-items: center;
        background: #2e95c4;
        color: #fff;
        display: flex;
        height: 54px;
        justify-content: space-between;
        padding: 0 14px;
      }

      .modal-title {
        font-size: 17px;
        font-weight: 700;
        margin: 0;
      }

      .close-icon {
        background: transparent;
        border: 0;
        color: #fff;
        cursor: pointer;
        font-size: 28px;
        font-weight: 700;
        line-height: 1;
      }

      .modal-body {
        padding: 34px 26px;
      }

      .attachment-title {
        color: #0d8ed4;
        font-size: 18px;
        font-weight: 700;
        margin: 0 0 12px;
      }

      .modal label {
        display: block;
        font-size: 15px;
        margin-bottom: 6px;
      }

      .modal-field {
        margin-bottom: 16px;
      }

      .modal input[type="text"],
      .modal textarea {
        border: 1px solid #c7c7c7;
        border-radius: 4px;
        color: #2d4b63;
        font-size: 14px;
        padding: 7px 8px;
        width: 100%;
      }

      .modal input[type="text"]:focus,
      .modal textarea:focus {
        border-color: #2998e8;
        box-shadow: 0 0 7px rgba(41, 152, 232, 0.75);
        outline: none;
      }

      .modal textarea {
        height: 94px;
        resize: none;
      }

      .file-row {
        display: flex;
      }

      .file-display {
        background: #f4f4f4;
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
        flex: 1;
      }

      .browse-button {
        background: #f7f7f7;
        border: 1px solid #0e74ad;
        border-bottom-right-radius: 4px;
        border-left: 0;
        border-top-right-radius: 4px;
        color: #0b6fa8;
        cursor: pointer;
        font-size: 14px;
        font-weight: 700;
        padding: 0 13px;
      }

      .modal-actions {
        display: grid;
        gap: 20px;
        grid-template-columns: 1fr 1fr;
        margin-bottom: 64px;
      }

      .primary-button,
      .secondary-button {
        border: 1px solid #0a6799;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 700;
        height: 35px;
      }

      .primary-button {
        background: #2e95c4;
        color: #fff;
      }

      .secondary-button {
        background: #fff;
        color: #0a6799;
      }

      .attachments-table {
        border: 1px solid #d9d9d9;
        padding-top: 26px;
      }

      .table-title {
        color: #0d8ed4;
        font-size: 18px;
        margin: 0 0 22px;
      }

      table {
        border-collapse: collapse;
        width: 100%;
      }

      th {
        border-bottom: 2px solid #d7d7d7;
        font-size: 14px;
        font-weight: 400;
        padding: 0 6px 12px;
        text-align: left;
      }

      .sr-only {
        height: 1px;
        left: -10000px;
        overflow: hidden;
        position: absolute;
        top: auto;
        width: 1px;
      }
    </style>
  </head>
  <body>
    <header class="topbar">
      <div class="topbar-inner">
        <div class="brand">Base AUT<br />Fixture</div>
        <nav class="nav" aria-label="Demo application navigation">
          <span>My Cases</span>
          <span>Need Assistance?</span>
          <span>Welcome First Name Last Name</span>
        </nav>
      </div>
    </header>

    <main class="shell">
      <section class="case-header" aria-label="Case header">
        <div class="case-meta">
          <span>HMRXXPQCW, AUTox<br />Base AUT</span>
          <span>LSW 10-G</span>
          <span data-testid="fixture-origin-text">Origin: base-component.aut.katalon.com</span>
        </div>
        <div class="case-actions">
          <button id="btnCaseNotes" name="btnCaseNotes" type="button" data-testid="case-notes-button">
            Case Notes
          </button>
          <button id="btnSave" name="btnSave" type="button" data-testid="save-button">Save</button>
          <button id="btnViewForms" name="btnViewForms" type="button" data-testid="view-forms-button">
            View Forms
          </button>
          <select id="caseActions" name="caseActions" data-testid="case-actions-select">
            <option>Case Actions</option>
            <option>Open Attachments</option>
          </select>
        </div>
      </section>

      <nav class="tabs" aria-label="Case tabs">
        <span class="tab active">Case Information</span>
        <span class="tab">Application</span>
      </nav>

      <section class="content">
        <div class="status-grid">
          <div>
            <span class="label">Status</span>
            <span class="value">Part 2 In Progress</span>
          </div>
          <div>
            <span class="label">Date Modified</span>
            <span>06/29/2026</span>
          </div>
          <div></div>
        </div>

        <h1 class="section-title">Proposed Insured</h1>
        <div class="form-grid">
          <div class="field">
            <label for="txtFirstName">First Name</label>
            <input id="txtFirstName" name="txtFirstName" value="AUTox" readonly data-testid="first-name" />
          </div>
          <div class="field">
            <label for="txtLastName">Last Name</label>
            <input id="txtLastName" name="txtLastName" value="HMRXXPQCW" readonly data-testid="last-name" />
          </div>
          <div class="field">
            <label for="txtDateOfBirth">Date of Birth</label>
            <input id="txtDateOfBirth" name="txtDateOfBirth" value="01 / 12 / 1956" readonly data-testid="date-of-birth" />
          </div>
          <div class="field">
            <label for="ddlGender">Gender</label>
            <select id="ddlGender" name="ddlGender" data-testid="gender-select">
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
        </div>

        <button
          id="openAttachmentPopupInFrame"
          name="openAttachmentPopupInFrame"
          type="button"
          class="open-popup-button"
          data-testid="open-attachment-popup-in-frame"
        >
          Open Attachments popup
        </button>
        <p class="origin-note">
          This same-origin iframe is served from the current Base AUT host using an iPipeline-like path.
        </p>
      </section>
    </main>

    <div id="attachmentPopupRoot" class="popup-root" data-testid="attachment-popup-root" hidden>
      <div class="overlay" aria-hidden="true"></div>

      <section
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="attachments-modal-title"
        data-testid="attachments-modal"
      >
        <header class="modal-header">
          <h1 id="attachments-modal-title" class="modal-title">Attachments</h1>
          <button
            id="btnCloseAttachmentModalIcon"
            name="btnCloseAttachmentModalIcon"
            type="button"
            class="close-icon"
            aria-label="Close attachments modal"
            data-testid="attachment-close-icon"
          >
            &times;
          </button>
        </header>

        <form id="frmAttachment" name="frmAttachment" class="modal-body" data-testid="attachment-form">
          <h2 class="attachment-title">Attach New File</h2>

          <div class="modal-field">
            <label for="txtDisplayName">Display Name</label>
            <input
              id="txtDisplayName"
              name="txtDisplayName"
              type="text"
              value="ATTACH_PIBENE_INSURANCE_OPTIONS"
              data-testid="attachment-display-name"
            />
          </div>

          <div class="modal-field">
            <label for="txtDescription">Description</label>
            <textarea
              id="txtDescription"
              name="txtDescription"
              data-testid="attachment-description"
            ></textarea>
          </div>

          <div class="modal-field">
            <label for="txtFileLocation">File Location</label>
            <div class="file-row">
              <input
                id="txtFileLocation"
                name="txtFileLocation"
                type="text"
                class="file-display"
                readonly
                data-testid="attachment-file-location"
              />
              <button
                id="btnBrowseAttachment"
                name="btnBrowseAttachment"
                type="button"
                class="browse-button"
                data-testid="attachment-browse-button"
              >
                Browse...
              </button>
            </div>
            <label for="fileAttachment" class="sr-only">Choose attachment file</label>
            <input
              id="fileAttachment"
              name="fileAttachment"
              type="file"
              class="sr-only"
              data-testid="attachment-file-input"
            />
          </div>

          <div class="modal-actions">
            <button
              id="btnAttach"
              name="btnAttach"
              type="submit"
              class="primary-button"
              data-testid="attachment-attach-button"
            >
              Attach
            </button>
            <button
              id="btnCloseAttachmentModal"
              name="btnCloseAttachmentModal"
              type="button"
              class="secondary-button"
              data-testid="attachment-close-button"
            >
              Close
            </button>
          </div>

          <section class="attachments-table" aria-labelledby="attachments-table-title">
            <h2 id="attachments-table-title" class="table-title">Attachments</h2>
            <table>
              <thead>
                <tr>
                  <th scope="col">File Name</th>
                  <th scope="col">Display Name</th>
                  <th scope="col">File Size</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody id="attachmentTableBody" data-testid="attachment-table-body"></tbody>
            </table>
          </section>
        </form>
      </section>
    </div>

    <script>
      const popupRoot = document.getElementById("attachmentPopupRoot");
      const openButton = document.getElementById("openAttachmentPopupInFrame");
      const form = document.getElementById("frmAttachment");
      const fileInput = document.getElementById("fileAttachment");
      const fileLocation = document.getElementById("txtFileLocation");
      const browseButton = document.getElementById("btnBrowseAttachment");
      const closeButtons = [
        document.getElementById("btnCloseAttachmentModalIcon"),
        document.getElementById("btnCloseAttachmentModal")
      ];

      const openPopup = () => {
        popupRoot.hidden = false;
        document.getElementById("txtDisplayName").focus();
      };

      const closePopup = () => {
        popupRoot.hidden = true;
        openButton.focus();
      };

      openButton.addEventListener("click", openPopup);
      closeButtons.forEach((button) => button.addEventListener("click", closePopup));
      browseButton.addEventListener("click", () => fileInput.click());
      fileInput.addEventListener("change", () => {
        fileLocation.value = fileInput.files && fileInput.files.length ? fileInput.files[0].name : "";
      });
      form.addEventListener("submit", (event) => {
        event.preventDefault();
      });
      window.addEventListener("message", (event) => {
        if (
          event.origin === window.location.origin &&
          event.data &&
          event.data.source === "same-domain-attachment-form-fixture" &&
          event.data.action === "openAttachmentPopup"
        ) {
          openPopup();
        }
      });
    </script>
  </body>
</html>
