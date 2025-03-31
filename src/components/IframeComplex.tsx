import React, { useState, useEffect } from 'react';
import type { IframeContent } from '../types';

const iframeContents: IframeContent[] = [
  {
    id: 'simple-form',
    title: 'Simple Form',
    content: `
      <html>
        <head>
          <style>
            body { 
              font-family: system-ui; 
              padding: 2rem;
              background-color: #f5f5f5;
            }
            .form-group {
              margin-bottom: 1rem;
            }
            label {
              display: block;
              margin-bottom: 0.5rem;
              font-weight: 500;
            }
            input, select {
              width: 100%;
              padding: 0.5rem;
              border: 1px solid #ddd;
              border-radius: 4px;
              margin-bottom: 0.5rem;
            }
            button {
              background-color: #1890ff;
              color: white;
              padding: 0.5rem 1rem;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            }
            button:hover {
              background-color: #40a9ff;
            }
          </style>
        </head>
        <body>
          <form id="simpleForm" onsubmit="handleSubmit(event)">
            <div class="form-group">
              <label for="name">Name:</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" name="email" required />
            </div>
            <button type="submit">Submit Form</button>
          </form>
          <script>
            function handleSubmit(event) {
              event.preventDefault();
              const formData = new FormData(event.target);
              const data = Object.fromEntries(formData.entries());
              window.top.postMessage({
                type: 'FORM_SUBMIT',
                formId: 'simpleForm',
                data: data
              }, '*');
            }
          </script>
        </body>
      </html>
    `
  },
  {
    id: 'complex-form',
    title: 'Complex Form',
    content: `
      <html>
        <head>
          <style>
            body { 
              font-family: system-ui; 
              padding: 2rem;
              background-color: #f5f5f5;
            }
            .form-container {
              background: white;
              padding: 2rem;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .form-section {
              margin-bottom: 2rem;
              padding-bottom: 1rem;
              border-bottom: 1px solid #eee;
            }
            .form-group {
              margin-bottom: 1rem;
              margin-left: 0.5rem;
            }
            .form-row {
              display: flex;
              gap: 1rem;
              margin-bottom: 1rem;
            }
            label {
              display: block;
              margin-bottom: 0.5rem;
              font-weight: 500;
            }
            input, select, textarea {
              width: 100%;
              padding: 0.5rem;
              border: 1px solid #ddd;
              border-radius: 4px;
              margin-bottom: 0.5rem;
            }
            button {
              background-color: #1890ff;
              color: white;
              padding: 0.5rem 1rem;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            }
            button:hover {
              background-color: #40a9ff;
            }
          </style>
        </head>
        <body>
          <div class="form-container">
            <form id="complexForm" onsubmit="handleComplexSubmit(event)">
              <div class="form-section">
                <h3>Personal Information</h3>
                <div class="form-row">
                  <div class="form-group">
                    <label for="firstName">First Name:</label>
                    <input type="text" id="firstName" name="firstName" required />
                  </div>
                  <div class="form-group">
                    <label for="lastName">Last Name:</label>
                    <input type="text" id="lastName" name="lastName" required />
                  </div>
                </div>
                <div class="form-group">
                  <label for="email">Email:</label>
                  <input type="email" id="email" name="email" required />
                </div>
              </div>

              <div class="form-section">
                <h3>Address</h3>
                <div class="form-group">
                  <label for="street">Street Address:</label>
                  <input type="text" id="street" name="street" required />
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="city">City:</label>
                    <input type="text" id="city" name="city" required />
                  </div>
                  <div class="form-group">
                    <label for="state">State:</label>
                    <select id="state" name="state" required>
                      <option value="">Select State</option>
                      <option value="CA">California</option>
                      <option value="NY">New York</option>
                      <option value="TX">Texas</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="zip">ZIP Code:</label>
                    <input type="text" id="zip" name="zip" required pattern="[0-9]{5}" />
                  </div>
                </div>
              </div>

              <div class="form-section">
                <h3>Additional Information</h3>
                <div class="form-group">
                  <label for="comments">Comments:</label>
                  <textarea id="comments" name="comments" rows="4"></textarea>
                </div>
              </div>

              <button type="submit">Submit Complex Form</button>
            </form>
          </div>
          <script>
            function handleComplexSubmit(event) {
              event.preventDefault();
              const formData = new FormData(event.target);
              const data = Object.fromEntries(formData.entries());
              window.top.postMessage({
                type: 'FORM_SUBMIT',
                formId: 'complexForm',
                data: data
              }, '*');
            }
          </script>
        </body>
      </html>
    `
  },
  {
    id: 'complex-page',
    title: 'Complex Page with Native Elements',
    content: `
      <html>
        <head>
          <style>
            body { 
              font-family: system-ui; 
              padding: 2rem;
              background-color: #f5f5f5;
              color: #333;
            }
            .page-container {
              max-width: 1200px;
              margin: 0 auto;
              background: white;
              padding: 2rem;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .section {
              margin-bottom: 2rem;
              padding-bottom: 1rem;
              border-bottom: 1px solid #eee;
            }
            .form-group {
              margin-bottom: 1.5rem;
              margin-left: 0.5rem;
            }
            .form-row {
              display: flex;
              gap: 1rem;
              margin-bottom: 1rem;
              flex-wrap: wrap;
            }
            label {
              display: block;
              margin-bottom: 0.5rem;
              font-weight: 500;
            }
            input[type="text"],
            input[type="email"],
            input[type="number"],
            input[type="date"],
            input[type="time"],
            input[type="color"],
            select,
            textarea {
              width: 100%;
              padding: 0.5rem;
              border: 1px solid #ddd;
              border-radius: 4px;
              margin-bottom: 0.5rem;
              font-size: 1rem;
            }
            select[multiple] {
              height: 120px;
            }
            .checkbox-group,
            .radio-group {
              display: flex;
              gap: 1rem;
              flex-wrap: wrap;
            }
            .checkbox-item,
            .radio-item {
              display: flex;
              align-items: center;
              gap: 0.5rem;
            }
            input[type="checkbox"],
            input[type="radio"] {
              width: 1rem;
              height: 1rem;
            }
            input[type="range"] {
              width: 100%;
              margin: 1rem 0;
            }
            button {
              background-color: #1890ff;
              color: white;
              padding: 0.5rem 1rem;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 1rem;
            }
            button:hover {
              background-color: #40a9ff;
            }
            button.secondary {
              background-color: #f0f0f0;
              color: #333;
            }
            button.secondary:hover {
              background-color: #e0e0e0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 1rem 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 0.75rem;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
              font-weight: 600;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            dialog {
              padding: 2rem;
              border: none;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            dialog::backdrop {
              background-color: rgba(0,0,0,0.5);
            }
            .range-value {
              text-align: center;
              margin-top: -0.5rem;
              font-weight: 500;
            }
            .color-preview {
              width: 100px;
              height: 40px;
              border: 1px solid #ddd;
              border-radius: 4px;
              margin-top: 0.5rem;
            }
          </style>
        </head>
        <body>
          <div class="page-container">
            <form id="complexPageForm" onsubmit="handleComplexPageSubmit(event)">
              <div class="section">
                <h2>Text Inputs</h2>
                <div class="form-row">
                  <div class="form-group" style="flex: 1">
                    <label for="text">Text Input:</label>
                    <input type="text" id="text" name="text" placeholder="Enter text" required />
                  </div>
                  <div class="form-group" style="flex: 1">
                    <label for="email">Email Input:</label>
                    <input type="email" id="email" name="email" placeholder="Enter email" required />
                  </div>
                </div>
                <div class="form-group">
                  <label for="textarea">Textarea:</label>
                  <textarea id="textarea" name="textarea" rows="4" placeholder="Enter long text"></textarea>
                </div>
              </div>

              <div class="section">
                <h2>Select Elements</h2>
                <div class="form-row">
                  <div class="form-group" style="flex: 1">
                    <label for="select">Single Select:</label>
                    <select id="select" name="select" required>
                      <option value="">Choose an option</option>
                      <option value="option1">Option 1</option>
                      <option value="option2">Option 2</option>
                      <option value="option3">Option 3</option>
                    </select>
                  </div>
                  <div class="form-group" style="flex: 1">
                    <label for="multiSelect">Multi Select:</label>
                    <select id="multiSelect" name="multiSelect" multiple>
                      <option value="multi1">Multi Option 1</option>
                      <option value="multi2">Multi Option 2</option>
                      <option value="multi3">Multi Option 3</option>
                      <option value="multi4">Multi Option 4</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="section">
                <h2>Checkboxes and Radio Buttons</h2>
                <div class="form-group">
                  <label>Checkboxes:</label>
                  <div class="checkbox-group">
                    <div class="checkbox-item">
                      <input type="checkbox" id="checkbox1" name="checkbox1" value="check1" />
                      <label for="checkbox1">Checkbox 1</label>
                    </div>
                    <div class="checkbox-item">
                      <input type="checkbox" id="checkbox2" name="checkbox2" value="check2" />
                      <label for="checkbox2">Checkbox 2</label>
                    </div>
                    <div class="checkbox-item">
                      <input type="checkbox" id="checkbox3" name="checkbox3" value="check3" />
                      <label for="checkbox3">Checkbox 3</label>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label>Radio Buttons:</label>
                  <div class="radio-group">
                    <div class="radio-item">
                      <input type="radio" id="radio1" name="radioGroup" value="radio1" required />
                      <label for="radio1">Radio 1</label>
                    </div>
                    <div class="radio-item">
                      <input type="radio" id="radio2" name="radioGroup" value="radio2" />
                      <label for="radio2">Radio 2</label>
                    </div>
                    <div class="radio-item">
                      <input type="radio" id="radio3" name="radioGroup" value="radio3" />
                      <label for="radio3">Radio 3</label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="section">
                <h2>Range and Color</h2>
                <div class="form-row">
                  <div class="form-group" style="flex: 1">
                    <label for="range">Range Slider:</label>
                    <input 
                      type="range" 
                      id="range" 
                      name="range" 
                      min="0" 
                      max="100" 
                      value="50"
                      oninput="document.getElementById('rangeValue').textContent = this.value"
                    />
                    <div id="rangeValue" class="range-value">50</div>
                  </div>
                  <div class="form-group" style="flex: 1">
                    <label for="color">Color Picker:</label>
                    <input 
                      type="color" 
                      id="color" 
                      name="color" 
                      value="#1890ff"
                      oninput="document.getElementById('colorPreview').style.backgroundColor = this.value"
                    />
                    <div id="colorPreview" class="color-preview" style="background-color: #1890ff"></div>
                  </div>
                </div>
              </div>

              <div class="section">
                <h2>Date and Time</h2>
                <div class="form-row">
                  <div class="form-group" style="flex: 1">
                    <label for="date">Date:</label>
                    <input type="date" id="date" name="date" required />
                  </div>
                  <div class="form-group" style="flex: 1">
                    <label for="time">Time:</label>
                    <input type="time" id="time" name="time" required />
                  </div>
                </div>
              </div>

              <div class="section">
                <h2>Table</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Header 1</th>
                      <th>Header 2</th>
                      <th>Header 3</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Row 1, Cell 1</td>
                      <td>Row 1, Cell 2</td>
                      <td>Row 1, Cell 3</td>
                    </tr>
                    <tr>
                      <td>Row 2, Cell 1</td>
                      <td>Row 2, Cell 2</td>
                      <td>Row 2, Cell 3</td>
                    </tr>
                    <tr>
                      <td>Row 3, Cell 1</td>
                      <td>Row 3, Cell 2</td>
                      <td>Row 3, Cell 3</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="section">
                <h2>Dialog</h2>
                <button 
                  type="button" 
                  class="secondary"
                  onclick="document.getElementById('dialogExample').showModal()"
                >
                  Open Dialog
                </button>
                <dialog id="dialogExample">
                  <h3>Dialog Title</h3>
                  <p>This is a native HTML dialog element. Click the button below to close it.</p>
                  <button 
                    type="button"
                    onclick="document.getElementById('dialogExample').close()"
                  >
                    Close Dialog
                  </button>
                </dialog>
              </div>

              <div class="section">
                <h2>Interactive Table</h2>
                <table id="interactiveTable">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Category</th>
                      <th>Tags</th>
                      <th>Active</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <input 
                          type="text" 
                          name="row1_name" 
                          value="John Doe"
                          style="margin: 0;"
                        />
                      </td>
                      <td>
                        <select name="row1_status" style="margin: 0;">
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending</option>
                        </select>
                      </td>
                      <td>
                        <select name="row1_category" style="margin: 0;">
                          <option value="cat1">Category 1</option>
                          <option value="cat2">Category 2</option>
                          <option value="cat3">Category 3</option>
                        </select>
                      </td>
                      <td>
                        <select name="row1_tags" multiple style="height: 80px; margin: 0;">
                          <option value="tag1">Tag 1</option>
                          <option value="tag2">Tag 2</option>
                          <option value="tag3">Tag 3</option>
                          <option value="tag4">Tag 4</option>
                        </select>
                      </td>
                      <td>
                        <div class="checkbox-item" style="margin: 0; justify-content: center;">
                          <input 
                            type="checkbox" 
                            id="row1_active" 
                            name="row1_active" 
                            checked
                          />
                        </div>
                      </td>
                      <td>
                        <button 
                          type="button" 
                          class="secondary" 
                          style="margin: 0 0.25rem;"
                          onclick="handleRowAction('edit', 1)"
                        >
                          Edit
                        </button>
                        <button 
                          type="button" 
                          style="background-color: #ff4d4f; margin: 0 0.25rem;"
                          onclick="handleRowAction('delete', 1)"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input 
                          type="text" 
                          name="row2_name" 
                          value="Jane Smith"
                          style="margin: 0;"
                        />
                      </td>
                      <td>
                        <select name="row2_status" style="margin: 0;">
                          <option value="active">Active</option>
                          <option value="inactive" selected>Inactive</option>
                          <option value="pending">Pending</option>
                        </select>
                      </td>
                      <td>
                        <select name="row2_category" style="margin: 0;">
                          <option value="cat1">Category 1</option>
                          <option value="cat2" selected>Category 2</option>
                          <option value="cat3">Category 3</option>
                        </select>
                      </td>
                      <td>
                        <select name="row2_tags" multiple style="height: 80px; margin: 0;">
                          <option value="tag1">Tag 1</option>
                          <option value="tag2">Tag 2</option>
                          <option value="tag3">Tag 3</option>
                          <option value="tag4">Tag 4</option>
                        </select>
                      </td>
                      <td>
                        <div class="checkbox-item" style="margin: 0; justify-content: center;">
                          <input 
                            type="checkbox" 
                            id="row2_active" 
                            name="row2_active"
                          />
                        </div>
                      </td>
                      <td>
                        <button 
                          type="button" 
                          class="secondary" 
                          style="margin: 0 0.25rem;"
                          onclick="handleRowAction('edit', 2)"
                        >
                          Edit
                        </button>
                        <button 
                          type="button" 
                          style="background-color: #ff4d4f; margin: 0 0.25rem;"
                          onclick="handleRowAction('delete', 2)"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input 
                          type="text" 
                          name="row3_name" 
                          value="Bob Johnson"
                          style="margin: 0;"
                        />
                      </td>
                      <td>
                        <select name="row3_status" style="margin: 0;">
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending" selected>Pending</option>
                        </select>
                      </td>
                      <td>
                        <select name="row3_category" style="margin: 0;">
                          <option value="cat1">Category 1</option>
                          <option value="cat2">Category 2</option>
                          <option value="cat3" selected>Category 3</option>
                        </select>
                      </td>
                      <td>
                        <select name="row3_tags" multiple style="height: 80px; margin: 0;">
                          <option value="tag1">Tag 1</option>
                          <option value="tag2">Tag 2</option>
                          <option value="tag3">Tag 3</option>
                          <option value="tag4">Tag 4</option>
                        </select>
                      </td>
                      <td>
                        <div class="checkbox-item" style="margin: 0; justify-content: center;">
                          <input 
                            type="checkbox" 
                            id="row3_active" 
                            name="row3_active" 
                            checked
                          />
                        </div>
                      </td>
                      <td>
                        <button 
                          type="button" 
                          class="secondary" 
                          style="margin: 0 0.25rem;"
                          onclick="handleRowAction('edit', 3)"
                        >
                          Edit
                        </button>
                        <button 
                          type="button" 
                          style="background-color: #ff4d4f; margin: 0 0.25rem;"
                          onclick="handleRowAction('delete', 3)"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="section">
                <h2>Table Actions</h2>
                <button 
                  type="button" 
                  class="secondary"
                  style="margin-right: 1rem;"
                  onclick="handleTableAction('add')"
                >
                  Add Row
                </button>
                <button 
                  type="button"
                  onclick="handleTableAction('save')"
                >
                  Save Changes
                </button>
              </div>

              <div class="section">
                <button type="submit">Submit Form</button>
              </div>
            </form>
          </div>
          <script>
            function handleComplexPageSubmit(event) {
              event.preventDefault();
              const formData = new FormData(event.target);
              const data = Object.fromEntries(formData.entries());
              
              // Handle multi-select values
              const multiSelect = document.getElementById('multiSelect');
              data.multiSelect = Array.from(multiSelect.selectedOptions).map(option => option.value);
              
              // Handle checkboxes
              data.checkboxes = ['checkbox1', 'checkbox2', 'checkbox3']
                .filter(id => document.getElementById(id).checked)
                .map(id => document.getElementById(id).value);
              
              window.top.postMessage({
                type: 'FORM_SUBMIT',
                formId: 'complexPageForm',
                data: data
              }, '*');
            }

            function handleTableAction(action) {
              if (action === 'add') {
                const tbody = document.querySelector('#interactiveTable tbody');
                if (!tbody) {
                  console.error('Table body not found');
                  return;
                }
                const currentRows = tbody.querySelectorAll('tr');
                const newRowId = currentRows.length + 1;
                const newRow = createNewRow(newRowId);
                tbody.appendChild(newRow);
              } else if (action === 'save') {
                try {
                  const tbody = document.querySelector('#interactiveTable tbody');
                  if (!tbody) {
                    throw new Error('Table body not found');
                  }
                  const rows = tbody.querySelectorAll('tr');
                  const tableData = [];
                  
                  rows.forEach((row, index) => {
                    const rowId = index + 1;
                    const elements = {
                      name: row.querySelector(\`input[name="row\${rowId}_name"]\`),
                      status: row.querySelector(\`select[name="row\${rowId}_status"]\`),
                      category: row.querySelector(\`select[name="row\${rowId}_category"]\`),
                      tags: row.querySelector(\`select[name="row\${rowId}_tags"]\`),
                      active: row.querySelector(\`input[name="row\${rowId}_active"]\`)
                    };

                    if (!elements.name || !elements.status || !elements.category || !elements.tags || !elements.active) {
                      throw new Error(\`Required form elements not found for row \${rowId}\`);
                    }

                    const rowData = {
                      rowId,
                      name: elements.name.value,
                      status: elements.status.value,
                      category: elements.category.value,
                      tags: Array.from(elements.tags.selectedOptions).map(opt => opt.value),
                      active: elements.active.checked
                    };
                    tableData.push(rowData);
                  });

                  window.top.postMessage({
                    type: 'TABLE_ACTION',
                    action,
                    data: tableData
                  }, '*');

                  console.log('Table data saved:', tableData);
                } catch (error) {
                  console.error('Error collecting table data:', error);
                }
              }
            }

            function handleRowAction(action, rowId) {
              if (action === 'delete') {
                const tbody = document.querySelector('#interactiveTable tbody');
                if (!tbody) {
                  console.error('Table body not found');
                  return;
                }
                const rows = tbody.querySelectorAll('tr');
                const row = rows[rowId - 1];
                if (row) {
                  row.remove();
                  // Reindex remaining rows
                  tbody.querySelectorAll('tr').forEach((row, index) => {
                    const newId = index + 1;
                    row.querySelectorAll('[name^="row"]').forEach(element => {
                      const oldName = element.getAttribute('name');
                      if (oldName) {
                        element.setAttribute('name', oldName.replace(/row\\d+/, \`row\${newId}\`));
                      }
                    });
                    row.querySelectorAll('button').forEach(button => {
                      if (button.getAttribute('onclick')?.includes('edit')) {
                        button.setAttribute('onclick', \`handleRowAction('edit', \${newId})\`);
                      } else if (button.getAttribute('onclick')?.includes('delete')) {
                        button.setAttribute('onclick', \`handleRowAction('delete', \${newId})\`);
                      }
                    });
                  });
                }
              }
              window.top.postMessage({
                type: 'TABLE_ACTION',
                action,
                rowId
              }, '*');
            }

            function createNewRow(rowId) {
              const tr = document.createElement('tr');
              tr.innerHTML = \`
                <td>
                  <input 
                    type="text" 
                    name="row\${rowId}_name" 
                    value=""
                    style="margin: 0;"
                  />
                </td>
                <td>
                  <select name="row\${rowId}_status" style="margin: 0;">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </td>
                <td>
                  <select name="row\${rowId}_category" style="margin: 0;">
                    <option value="cat1">Category 1</option>
                    <option value="cat2">Category 2</option>
                    <option value="cat3">Category 3</option>
                  </select>
                </td>
                <td>
                  <select name="row\${rowId}_tags" multiple style="height: 80px; margin: 0;">
                    <option value="tag1">Tag 1</option>
                    <option value="tag2">Tag 2</option>
                    <option value="tag3">Tag 3</option>
                    <option value="tag4">Tag 4</option>
                  </select>
                </td>
                <td>
                  <div class="checkbox-item" style="margin: 0; justify-content: center;">
                    <input 
                      type="checkbox" 
                      id="row\${rowId}_active" 
                      name="row\${rowId}_active"
                    />
                  </div>
                </td>
                <td>
                  <button 
                    type="button" 
                    class="secondary" 
                    style="margin: 0 0.25rem;"
                    onclick="handleRowAction('edit', \${rowId})"
                  >
                    Edit
                  </button>
                  <button 
                    type="button" 
                    style="background-color: #ff4d4f; margin: 0 0.25rem;"
                    onclick="handleRowAction('delete', \${rowId})"
                  >
                    Delete
                  </button>
                </td>
              \`;
              return tr;
            }
          </script>
        </body>
      </html>
    `
  }
];

export const IframeComplex: React.FC = () => {
  const [messages, setMessages] = useState<Array<{type: string; formId: string; data: unknown}>>([]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'FORM_SUBMIT') {
        setMessages(prev => [...prev, event.data]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const simpleAndComplexForms = iframeContents.slice(0, 2);
  const complexPage = iframeContents[2];

  return (
    <div className="space-y-6" data-test="iframe-complex-container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {simpleAndComplexForms.map(({ id, title, content }) => (
          <div key={id} className="border rounded-lg p-4 bg-white shadow-sm" data-test={`iframe-wrapper-${id}`}>
            <h3 className="text-lg font-medium mb-4">{title}</h3>
            <iframe
              srcDoc={content}
              className="w-full h-[600px] border-0 bg-white"
              sandbox="allow-scripts allow-forms"
              data-test={`iframe-${id}`}
            />
          </div>
        ))}
      </div>

      <div className="border rounded-lg p-4 bg-white shadow-sm" data-test={`iframe-wrapper-${complexPage.id}`}>
        <h3 className="text-lg font-medium mb-4">{complexPage.title}</h3>
        <iframe
          srcDoc={complexPage.content}
          className="w-full h-[800px] border-0 bg-white"
          sandbox="allow-scripts allow-forms"
          data-test={`iframe-${complexPage.id}`}
        />
      </div>

      {messages.length > 0 && (
        <div className="mt-6 p-6 bg-white rounded-lg shadow-sm" data-test="iframe-messages">
          <h3 className="text-lg font-medium mb-4">Form Submissions:</h3>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className="p-4 bg-gray-50 rounded-md"
                data-test={`iframe-message-${index}`}
              >
                <p className="font-medium mb-2">Form ID: {message.formId}</p>
                <pre className="whitespace-pre-wrap text-sm">
                  {JSON.stringify(message.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 