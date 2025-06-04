// Test data constants
export const TEST_IDS = {
  // Navigation
  NAV_MENU: "main-navigation",
  HOME_LINK: "home-link",

  // Forms
  LOGIN_FORM: "login-form",
  USERNAME_INPUT: "username-input",
  PASSWORD_INPUT: "password-input",
  SUBMIT_BUTTON: "submit-button",

  // Tables
  DATA_TABLE: "dynamic-table",
  TABLE_ROW: "table-row",
  TABLE_CELL: "table-cell",

  // File Operations
  FILE_UPLOAD: "file-uploader",
  DROP_ZONE: "drop-zone",
  FILE_INPUT: "file-input",
} as const;

// Test timeouts
export const TIMEOUTS = {
  ANIMATION: 1000,
  NETWORK: 5000,
  RENDER: 2000,
  TRANSITION: 500,
} as const;

// Test user data
export const TEST_USERS = {
  ADMIN: {
    username: "admin",
    password: "admin123",
    role: "admin",
  },
  REGULAR: {
    username: "user",
    password: "user123",
    role: "user",
  },
} as const;
