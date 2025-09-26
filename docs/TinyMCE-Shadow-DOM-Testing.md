# TinyMCE in Shadow DOM - Testing Guide

This document provides guidance on how to test TinyMCE editor embedded within 4 layers of Shadow DOM.

## Page Structure

The TinyMCE editor is nested within 4 layers of Shadow DOM:

- Layer 1: Outer shadow root container
- Layer 2: Second shadow root wrapper
- Layer 3: Third shadow root wrapper
- Layer 4: Final shadow root containing TinyMCE

## Test Automation Examples

### Playwright Example

```javascript
// Navigate to the page
await page.goto("/tinymce-shadow-dom");

// Function to traverse shadow DOM layers
async function getShadowElement(page, selector, shadowLayers = 4) {
  let element = await page.locator('[data-test="shadow-dom-container"]');

  for (let i = 0; i < shadowLayers; i++) {
    element = element.locator("xpath=.").evaluateHandle((el) => el.shadowRoot);
    element = element.locator("div"); // Navigate to the wrapper div
  }

  return element.locator(selector);
}

// Test: Fill TinyMCE editor and submit form
test("should fill TinyMCE editor in shadow DOM and submit", async ({
  page,
}) => {
  // Get the TinyMCE iframe within shadow DOM
  const tinymceFrame = await getShadowElement(page, 'iframe[id*="tiny-react"]');

  // Switch to TinyMCE iframe context
  const frame = await tinymceFrame.contentFrame();

  // Fill the editor
  await frame
    .locator('body[data-id*="tiny-react"]')
    .fill("Hello from Shadow DOM!");

  // Submit the form
  const submitButton = await getShadowElement(
    page,
    '[data-test="tinymce-submit-btn"]',
  );
  await submitButton.click();

  // Verify submission
  await expect(page.locator("text=Form submitted successfully!")).toBeVisible();
});
```

### Selenium Example

```java
// Java Selenium example
public void testTinyMCEInShadowDOM() {
    driver.get("/tinymce-shadow-dom");

    // Navigate through shadow DOM layers
    WebElement shadowContainer = driver.findElement(By.cssSelector("[data-test='shadow-dom-container']"));

    JavascriptExecutor js = (JavascriptExecutor) driver;

    // Traverse 4 shadow DOM layers
    WebElement finalShadowRoot = (WebElement) js.executeScript(
        "let element = arguments[0];" +
        "for(let i = 0; i < 4; i++) {" +
        "  element = element.shadowRoot.querySelector('div');" +
        "}" +
        "return element;", shadowContainer
    );

    // Find TinyMCE iframe
    WebElement tinymceIframe = (WebElement) js.executeScript(
        "return arguments[0].querySelector('iframe[id*=\"tiny-react\"]');", finalShadowRoot
    );

    // Switch to iframe and fill content
    driver.switchTo().frame(tinymceIframe);
    WebElement editorBody = driver.findElement(By.cssSelector("body[data-id*='tiny-react']"));
    editorBody.sendKeys("Hello from Shadow DOM!");

    // Switch back to main content
    driver.switchTo().defaultContent();

    // Find and click submit button
    WebElement submitButton = (WebElement) js.executeScript(
        "return arguments[0].querySelector('[data-test=\"tinymce-submit-btn\"]');", finalShadowRoot
    );
    submitButton.click();
}
```

### Katalon Studio Example

```groovy
// Navigate to page
WebUI.navigateToUrl('/tinymce-shadow-dom')

// Custom keyword to traverse shadow DOM
def traverseShadowDOM(TestObject shadowContainer, String selector, int layers = 4) {
    String script = """
        let element = arguments[0];
        for(let i = 0; i < ${layers}; i++) {
            element = element.shadowRoot.querySelector('div');
        }
        return element.querySelector('${selector}');
    """
    return WebUI.executeJavaScript(script, [WebUI.findWebElement(shadowContainer)])
}

// Test steps
TestObject shadowContainer = findTestObject('Object Repository/shadow-dom-container')
WebElement tinymceIframe = traverseShadowDOM(shadowContainer, 'iframe[id*="tiny-react"]')

// Switch to TinyMCE iframe and fill content
WebUI.switchToFrame(tinymceIframe, 10)
WebUI.setText(findTestObject('Object Repository/tinymce-body'), 'Hello from Shadow DOM!')

// Switch back and submit
WebUI.switchToDefaultContent()
WebElement submitButton = traverseShadowDOM(shadowContainer, '[data-test="tinymce-submit-btn"]')
WebUI.click(submitButton)

// Verify
WebUI.verifyElementPresent(findTestObject('Object Repository/success-message'), 10)
```

## Key Testing Points

1. **Shadow DOM Traversal**: Must traverse through 4 layers of shadow DOM
2. **TinyMCE Iframe**: TinyMCE creates its own iframe that needs to be accessed
3. **Content Editing**: The actual content is in a contenteditable body element
4. **Form Submission**: Submit button is also within the shadow DOM
5. **Content Validation**: Check the preview area for submitted content

## Test Selectors

- Shadow DOM Container: `[data-test="shadow-dom-container"]`
- TinyMCE Submit Button: `[data-test="tinymce-submit-btn"]`
- TinyMCE Clear Button: `[data-test="tinymce-clear-btn"]`
- Content Preview: `[data-test="tinymce-content-preview"]`
- TinyMCE Iframe: `iframe[id*="tiny-react"]`
- TinyMCE Body: `body[data-id*="tiny-react"]`

## Common Challenges

1. **Shadow DOM Access**: Requires JavaScript execution to access shadow roots
2. **Iframe Switching**: TinyMCE uses iframes that require context switching
3. **Timing Issues**: Shadow DOM and TinyMCE initialization may require waits
4. **Cross-browser Compatibility**: Shadow DOM support varies across browsers
