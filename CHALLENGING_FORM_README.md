# Challenging Form - Test Automation Challenge

## Overview

The Challenging Form is designed to test the skills of test automation engineers by presenting non-standard HTML structures and dynamic elements that require advanced locator strategies.

## Location

- **Route**: `/challenging-form` (with `.html`, `.php`, `.asp`, `.aspx`, `.jsp` extensions)
- **Navigation**: Advanced → Challenging Form
- **Component**: [ChallengingFormPage.tsx](src/pages/ChallengingFormPage.tsx)
- **Standalone HTML**: [challenging-form.html](challenging-form.html)

## Automation Challenges

### 1. Dynamic IDs

All element IDs are randomly generated on each page load using the format:

```
id_[random]_[timestamp]
```

**Example**: `id_xyz123abc_1702345678901`

**Why it's challenging**: Traditional ID-based selectors will fail on page refresh.

**Solution**: Must use alternative locator strategies.

### 2. Dynamic CSS Classes

All CSS classes have dynamically generated suffixes:

```
input_xyz123
dropdown_abc456
list_def789
option_ghi012
btn_jkl345
```

**Why it's challenging**: Class-based selectors become unreliable.

**Solution**: Use partial class matching or other attributes.

### 3. NO data-testid or data-value Attributes

Unlike the previous version, this form has **ZERO** stable attributes:

- ❌ No `data-testid`
- ❌ No `data-value`
- ❌ No `data-*` attributes
- ❌ No stable IDs
- ❌ No stable classes

**Why it's challenging**: Forces testers to use robust locator strategies.

**Solution**: Must rely on:

- Element types (`input[type="text"]`, `input[type="email"]`)
- Text content
- Label associations
- Position/hierarchy
- Element attributes like `placeholder`, `name`, `type`

### 4. Custom Dropdowns with `<p>` Tags

Instead of standard `<select>` and `<option>` elements, the form uses:

```html
<div class="custom-dropdown">
  <div class="dropdown_xyz123">
    <span class="selected-value">Select a country</span>
  </div>
  <div class="list_abc456">
    <p class="option_def789">United States</p>
    <p class="option_ghi012">United Kingdom</p>
  </div>
</div>
```

**Why it's challenging**:

- Standard `select()` methods won't work
- Requires click interactions on custom elements
- Dropdown visibility must be handled
- No `<option>` tags to query

**Solution**:

1. Find dropdown by label text or position
2. Click to open the dropdown
3. Wait for options to be visible
4. Select by text content
5. Verify selection through hidden input or displayed text

## Form Fields

1. **Name** (text input)

   - Type: `input[type="text"]`
   - Placeholder: "Enter your full name"
   - Label: "Full Name:"

2. **Email** (email input)

   - Type: `input[type="email"]`
   - Placeholder: "Enter your email"
   - Label: "Email Address:"

3. **Phone** (tel input)

   - Type: `input[type="tel"]`
   - Placeholder: "Enter your phone number"
   - Label: "Phone Number:"

4. **Country** (custom dropdown)

   - Label: "Country (Custom Dropdown with <p> tags):"
   - Options: United States, United Kingdom, Canada, Australia, Germany, France, Japan, Singapore
   - Hidden input: `input[name="country"]`

5. **Experience Level** (custom dropdown)

   - Label: "Experience Level (Another Custom Dropdown):"
   - Options: Beginner (0-1 years), Intermediate (2-4 years), Advanced (5-7 years), Expert (8+ years)
   - Hidden input: `input[name="experience"]`

6. **Programming Language** (custom dropdown)
   - Label: "Programming Language (Dynamic ID Dropdown):"
   - Options: JavaScript, Python, Java, C#, Ruby, Go, Rust, TypeScript
   - Hidden input: `input[name="language"]`

## Recommended Locator Strategies

### Strategy 1: Use Input Types and Placeholders

```java
// Find by type and placeholder
driver.findElement(By.cssSelector("input[type='text'][placeholder='Enter your full name']"))
```

### Strategy 2: Use Label Text to Find Associated Inputs

```java
// Find input by preceding label
driver.findElement(By.xpath("//label[contains(text(),'Full Name:')]/following-sibling::input"))
```

### Strategy 3: Use Text Content for Dropdowns

```java
// Click dropdown by finding label
driver.findElement(By.xpath("//label[contains(text(),'Country')]/following-sibling::div//div[contains(@class,'dropdown')]")).click();

// Select option by text content
driver.findElement(By.xpath("//p[text()='United States']")).click();
```

### Strategy 4: Use Hidden Input Names for Verification

```java
// Verify selection
String selectedCountry = driver.findElement(By.cssSelector("input[name='country']")).getAttribute("value");
```

### Strategy 5: Use Partial Class Matching

```java
// Find elements with dynamic classes using contains
driver.findElement(By.cssSelector("[class*='input']"))
driver.findElement(By.cssSelector("[class*='dropdown']"))
```

### Strategy 6: Use Position-Based Locators

```java
// First input in form
driver.findElements(By.tagName("input")).get(0)

// Third dropdown
driver.findElements(By.cssSelector("[class*='dropdown']")).get(2)
```

## Automation Examples

### Selenium/WebDriver (Java)

```java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

// Fill name using placeholder
driver.findElement(By.cssSelector("input[type='text'][placeholder*='full name']")).sendKeys("John Doe");

// Fill email using type
driver.findElement(By.cssSelector("input[type='email']")).sendKeys("john@example.com");

// Fill phone using type
driver.findElement(By.cssSelector("input[type='tel']")).sendKeys("1234567890");

// Select country dropdown
WebElement countryDropdown = driver.findElement(
    By.xpath("//label[contains(text(),'Country')]/following-sibling::div//div[contains(@class,'dropdown') or @class='dropdown-header']")
);
countryDropdown.click();

// Wait for options to appear and click
wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//p[text()='United States']")));
driver.findElement(By.xpath("//p[text()='United States']")).click();

// Select experience dropdown
driver.findElement(
    By.xpath("//label[contains(text(),'Experience')]/following-sibling::div//div[contains(@class,'dropdown') or @class='dropdown-header']")
).click();
driver.findElement(By.xpath("//p[contains(text(),'Intermediate')]")).click();

// Select language dropdown
driver.findElement(
    By.xpath("//label[contains(text(),'Language')]/following-sibling::div//div[contains(@class,'dropdown') or @class='dropdown-header']")
).click();
driver.findElement(By.xpath("//p[text()='JavaScript']")).click();

// Submit form using button type
driver.findElement(By.cssSelector("button[type='submit']")).click();

// Verify success message
wait.until(ExpectedConditions.visibilityOfElementLocated(
    By.xpath("//*[contains(text(),'Form Submitted Successfully')]")
));
```

### Playwright (JavaScript)

```javascript
// Fill text fields
await page.fill('input[type="text"]', "John Doe");
await page.fill('input[type="email"]', "john@example.com");
await page.fill('input[type="tel"]', "1234567890");

// Select from country dropdown
await page.click("text=Select a country");
await page.click("text=United States");

// Select from experience dropdown
await page.click("text=Select experience level");
await page.click("text=Intermediate");

// Select from language dropdown
await page.click("text=Select programming language");
await page.click("text=JavaScript");

// Submit form
await page.click('button[type="submit"]');

// Verify
await expect(page.locator("text=Form Submitted Successfully")).toBeVisible();
```

### Cypress

```javascript
// Fill form fields
cy.get('input[type="text"]').type("John Doe");
cy.get('input[type="email"]').type("john@example.com");
cy.get('input[type="tel"]').type("1234567890");

// Handle dropdowns
cy.contains("Select a country").click();
cy.contains("United States").click();

cy.contains("Select experience level").click();
cy.contains("Intermediate").click();

cy.contains("Select programming language").click();
cy.contains("JavaScript").click();

// Submit and verify
cy.get('button[type="submit"]').click();
cy.contains("Form Submitted Successfully").should("be.visible");
```

### Katalon Studio

```groovy
// Fill text inputs
WebUI.setText(findTestObject('Object Repository/input_type_text'), 'John Doe')
WebUI.setText(findTestObject('Object Repository/input_type_email'), 'john@example.com')
WebUI.setText(findTestObject('Object Repository/input_type_tel'), '1234567890')

// Custom XPath for dropdowns
WebUI.click(findTestObject('Object Repository/country_dropdown_xpath'))
WebUI.click(findTestObject('Object Repository/country_option_us_text'))

// Or using dynamic XPath
WebUI.click(findTestObject('null', ['xpath': '//p[text()="United States"]']))
```

## Verification Points

### 1. Hidden Input Verification

Check the value of hidden inputs to verify selections:

```java
String country = driver.findElement(By.cssSelector("input[name='country']")).getAttribute("value");
assertEquals("United States", country);
```

### 2. Display Text Verification

Check the displayed text in dropdown headers:

```java
String displayedText = driver.findElement(
    By.xpath("//label[contains(text(),'Country')]/following-sibling::div//span[@class='selected-value']")
).getText();
assertEquals("United States", displayedText);
```

### 3. Form Submission Verification

Verify the success message appears:

```java
WebElement successMessage = driver.findElement(
    By.xpath("//*[contains(text(),'Form Submitted Successfully')]")
);
assertTrue(successMessage.isDisplayed());
```

## Testing Tips

### 1. Avoid Fragile Locators

❌ **Don't use**:

- `#id_xyz123_1702345678901` (will change on refresh)
- `.input_abc123` (will change on refresh)
- Position-only selectors like `:nth-child(3)` (fragile)

✅ **Do use**:

- `input[type="email"]` (stable)
- `input[placeholder*="email"]` (stable)
- `//label[text()='Email Address:']/following-sibling::input` (semantic)
- Text content matching

### 2. Handle Dynamic Elements

- Always wait for elements to be visible before interacting
- Use explicit waits, not fixed sleeps
- Check element visibility and clickability

### 3. Dropdown Best Practices

- Click the header to open
- Wait for options container to be visible
- Find option by text content
- Click the option
- Verify selection in hidden input

### 4. Work with Labels

Labels are your friends - they're stable and semantic:

```xpath
//label[contains(text(),'Country')]/following-sibling::div
```

### 5. Use Multiple Attributes

Combine attributes for stronger selectors:

```css
input[type="text"][placeholder*="name"]
```

## Advanced Challenges

### Challenge 1: Page Refresh Resilience

- Write tests that pass even after page refresh
- Verify your locators don't depend on dynamic IDs/classes

### Challenge 2: Parallel Execution

- Ensure no timing issues with dropdown interactions
- Handle race conditions properly

### Challenge 3: Cross-Browser Testing

- Verify custom dropdowns work across browsers
- Test on Chrome, Firefox, Safari, Edge

### Challenge 4: Mobile Testing

- Test responsive behavior
- Verify touch interactions work

### Challenge 5: Dark Mode

- Test in both light and dark themes
- Verify element visibility in both modes

## Success Criteria

Your automation is successful if it can:

1. ✅ Fill all form fields correctly
2. ✅ Handle all three dropdown types without `data-testid` or `data-value`
3. ✅ Submit the form successfully
4. ✅ Verify the submitted data
5. ✅ Pass on page refresh (dynamic IDs and classes change)
6. ✅ Run reliably without flakiness
7. ✅ Use semantic, maintainable locators
8. ✅ Not depend on element position or dynamic attributes

## What Makes This Challenging?

This form eliminates all the "easy" locator strategies:

- No test IDs
- No stable classes
- No stable IDs
- No data attributes
- Non-standard HTML elements (`<p>` instead of `<option>`)
- Custom dropdown behavior (no native `<select>`)

This forces test automation engineers to:

- Think semantically about element selection
- Use text content and labels
- Understand HTML structure and relationships
- Write robust, maintainable locators
- Handle dynamic content properly

---

**Good luck with your automation challenge!** 🎯

This form will truly test your automation skills and help you become a better test engineer.
