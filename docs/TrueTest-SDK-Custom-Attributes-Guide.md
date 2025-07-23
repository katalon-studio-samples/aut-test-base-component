# TrueTest SDK Custom Attributes Usage Guide

This guide explains how to use the implemented components (`SettingsPage.tsx` and `trueTestDetector.ts`) to set custom attributes for TrueTest sessions using the TrueTest SDK.

## Overview

The TrueTest SDK provides a method `TrueTest.setSessionAttributes()` to set custom attributes for tracking and testing sessions. Our implementation provides multiple ways to interact with this SDK method while maintaining persistence and synchronization.

## TrueTest SDK Integration

### SDK Method Signature

```javascript
TrueTest.setSessionAttributes(attributes)
```

**Parameters:**
- `attributes` (Object): Key-value pairs of session attributes

**Example:**
```javascript
TrueTest.setSessionAttributes({
  userRole: "admin",
  experimentGroup: "B",
  userId: "user_1234",
  environment: "production"
});
```

## Implementation Components

### 1. TrueTestDetector (`src/utils/trueTestDetector.ts`)

The detector automatically intercepts and manages TrueTest SDK calls.

#### Key Methods for SDK Integration

```typescript
// Automatically calls TrueTest.setSessionAttributes with stored attributes
trueTestDetector.callTrueTestSetSessionAttributes(): void

// Calls TrueTest.setSessionAttributes with specific attributes
trueTestDetector.callTrueTestSetSessionAttributesWithData(attributes: Record<string, string>): void

// Sets attributes in storage AND calls TrueTest SDK
trueTestDetector.setMultipleAttributesAndCallSDK(attributes: Record<string, string>): void
```

#### Automatic SDK Integration

The detector automatically:
1. **Intercepts SDK calls** - Detects when `TrueTest.setSessionAttributes` is called
2. **Stores attributes** - Saves them to localStorage for persistence
3. **Auto-applies on load** - Calls SDK with stored attributes when page loads
4. **Syncs across tabs** - Updates SDK when localStorage changes in other tabs

### 2. SettingsPage (`src/pages/SettingsPage.tsx`)

The settings page provides UI for managing attributes that automatically integrate with the TrueTest SDK.

#### SDK Integration Points

```typescript
// When saving attributes manually
const saveAllAttributes = () => {
  // ... prepare attributes
  trueTestDetector.setMultipleAttributesAndCallSDK(attributes);
  // This calls TrueTest.setSessionAttributes(attributes) automatically
};

// When loading from query parameters
const loadFromQueryParams = () => {
  // ... parse parameters
  trueTestDetector.setMultipleAttributesAndCallSDK(params);
  // This calls TrueTest.setSessionAttributes(params) automatically
};

// When clearing attributes
const clearAllAttributes = () => {
  trueTestDetector.clearAllAttributes();
  trueTestDetector.callTrueTestSetSessionAttributesWithData({});
  // This calls TrueTest.setSessionAttributes({}) to clear the session
};
```

## Usage Methods

### Method 1: Using the Settings UI

**Step 1:** Navigate to `/settings`

**Step 2:** Add custom attributes using the form:
```
Key: userRole        Value: admin
Key: experimentGroup Value: B
Key: userId          Value: user_1234
Key: environment     Value: production
```

**Step 3:** Click "Save All Attributes"

**Result:** The system will:
1. Store attributes in localStorage
2. Call `TrueTest.setSessionAttributes({userRole: "admin", experimentGroup: "B", userId: "user_1234", environment: "production"})`
3. Display success message
4. Show console log: `"TrueTest.setSessionAttributes called with: {userRole: "admin", ...}"`

### Method 2: Using URL Parameters

**Access URL:**
```
/settings?userRole=admin&experimentGroup=B&userId=user_1234&environment=production
```

**Result:** The system will:
1. Parse URL parameters automatically
2. Store attributes in localStorage
3. Call `TrueTest.setSessionAttributes({userRole: "admin", experimentGroup: "B", userId: "user_1234", environment: "production"})`
4. Update UI to show loaded attributes
5. Clean URL (remove parameters)

### Method 3: Programmatic Usage

**Direct SDK Call (Detected):**
```javascript
// This call will be automatically detected and stored
TrueTest.setSessionAttributes({
  userRole: "admin",
  experimentGroup: "B",
  userId: "user_1234"
});
```

**Using Detector Methods:**
```javascript
import { trueTestDetector } from './utils/trueTestDetector';

// Method 1: Set and call SDK
trueTestDetector.setMultipleAttributesAndCallSDK({
  userRole: "admin",
  experimentGroup: "B",
  userId: "user_1234"
});

// Method 2: Set individual attributes, then call SDK
trueTestDetector.setSessionAttribute("userRole", "admin");
trueTestDetector.setSessionAttribute("experimentGroup", "B");
trueTestDetector.callTrueTestSetSessionAttributes();

// Method 3: Call SDK with specific data
trueTestDetector.callTrueTestSetSessionAttributesWithData({
  userRole: "admin",
  experimentGroup: "B"
});
```

### Method 4: Clear Session Attributes

**Option 1:** URL-based clear
```
/settings?clear=true
/settings?
```

**Option 2:** UI-based clear
- Click "Clear All" button in settings page

**Option 3:** Programmatic clear
```javascript
trueTestDetector.clearAllAttributes();
trueTestDetector.callTrueTestSetSessionAttributesWithData({});
```

**Result:** All methods will:
1. Clear localStorage
2. Call `TrueTest.setSessionAttributes({})` to reset the session
3. Update UI to show empty state

## Common Use Cases

### 1. User Role-Based Testing

```javascript
// Set user role for testing different user experiences
TrueTest.setSessionAttributes({
  userRole: "admin",        // or "user", "moderator"
  permissions: "full",      // or "limited", "read-only"
  accountType: "premium"    // or "free", "trial"
});
```

### 2. A/B Testing

```javascript
// Set experiment groups for A/B testing
TrueTest.setSessionAttributes({
  experimentGroup: "A",     // or "B", "control"
  variant: "new-ui",        // or "old-ui", "beta-ui"
  testId: "homepage-test-001"
});
```

### 3. Environment Configuration

```javascript
// Set environment-specific attributes
TrueTest.setSessionAttributes({
  environment: "staging",   // or "production", "development"
  region: "us-west",        // or "us-east", "eu-central"
  version: "2.1.0"
});
```

### 4. User Context

```javascript
// Set user-specific context
TrueTest.setSessionAttributes({
  userId: "user_12345",
  sessionId: "sess_abcdef",
  loginMethod: "oauth",     // or "password", "sso"
  deviceType: "desktop"     // or "mobile", "tablet"
});
```

## Console Output Examples

When attributes are set successfully, you'll see console logs like:

```
TrueTest.setSessionAttributes called with: {userRole: "admin", experimentGroup: "B"}
Calling TrueTest.setSessionAttributes with current session attributes...
```

When localStorage changes are detected:
```
localStorage trueTestSessionAttributes changed, updating TrueTest session...
TrueTest.setSessionAttributes called with: {userRole: "admin", experimentGroup: "B"}
```

## Persistence and Synchronization

### Automatic Persistence
- All attributes are automatically saved to localStorage
- Attributes persist across browser sessions
- No manual save required when using detector methods

### Cross-Tab Synchronization
- Changes in one tab automatically sync to other tabs
- Each tab calls `TrueTest.setSessionAttributes` with updated values
- Real-time synchronization using storage events

### Page Load Behavior
- On page load, stored attributes are automatically applied
- `TrueTest.setSessionAttributes` is called with stored values
- No manual initialization required

## Error Handling

### SDK Not Available
If TrueTest SDK is not loaded, you'll see:
```
TrueTest.setSessionAttributes is not available. Make sure the TrueTest SDK is loaded.
```

**Solution:** Ensure the SDK script is included in your HTML:
```html
<script src="https://static.qa.katalon.com/libs/traffic-agent/v1/truetest-sdk.min.js"></script>
```

### Storage Issues
If localStorage is not available:
- Attributes will still work for the current session
- No persistence across browser sessions
- Cross-tab sync will not work

## Best Practices

### 1. Attribute Naming
```javascript
// Good: Descriptive, consistent naming
TrueTest.setSessionAttributes({
  userRole: "admin",
  experimentGroup: "variant-a",
  featureFlag: "new-checkout"
});

// Avoid: Generic or unclear names
TrueTest.setSessionAttributes({
  type: "1",
  group: "a",
  flag: "true"
});
```

### 2. Value Consistency
```javascript
// Good: Consistent string values
TrueTest.setSessionAttributes({
  isLoggedIn: "true",      // String "true", not boolean
  userCount: "1234",       // String number
  status: "active"         // String status
});
```

### 3. Clearing Attributes
```javascript
// Always clear attributes when context changes
// Example: User logs out
trueTestDetector.clearAllAttributes();
trueTestDetector.callTrueTestSetSessionAttributesWithData({});
```

### 4. Testing Different Scenarios
```javascript
// Use the settings page to quickly test different attribute combinations
// Navigate to: /settings?userRole=admin&experimentGroup=B&environment=staging
```

## Integration Checklist

- [ ] TrueTest SDK script included in HTML
- [ ] TrueTestDetector imported in main.tsx
- [ ] Settings page route configured
- [ ] Navigation link to settings added
- [ ] Test attribute setting via UI
- [ ] Test attribute setting via URL parameters
- [ ] Verify console logs show SDK calls
- [ ] Test cross-tab synchronization
- [ ] Test persistence across browser sessions

## Troubleshooting

### Attributes Not Being Set
1. Check console for SDK availability warnings
2. Verify TrueTest SDK script is loaded
3. Ensure detector is imported in main.tsx
4. Check localStorage for `trueTestSessionAttributes` key

### Cross-Tab Sync Not Working
1. Ensure both tabs are on the same domain
2. Check if localStorage is enabled
3. Verify storage events are firing (check console)
4. Test with simple attribute changes

### URL Parameters Not Loading
1. Check URL format is correct
2. Verify React Router is handling the route
3. Check console for parameter parsing logs
4. Ensure useSearchParams hook is working

This guide provides comprehensive instructions for using the implemented components to set custom TrueTest session attributes via the SDK, ensuring proper integration, persistence, and synchronization across your application.
