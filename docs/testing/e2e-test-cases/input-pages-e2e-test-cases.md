# Input Pages E2E Test Cases

## Scope

- Route: `/input/checkbox`
- Route: `/input/radio-search-submit`
- Route: `/input/form-inputs`

## Test Case Matrix

| Case ID | Route | Scenario | Preconditions | Steps | Expected Result | Tags | Automation Mapping |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E2E-INP-001 | `/input/checkbox` | Default checkbox summary | App is reachable | Open route, click `Show Selection` | Summary shows `Receive newsletter: Yes`, `Enable notifications: No`, `Accept terms and conditions: No` | `@regression` | `input-checkbox default summary` |
| E2E-INP-002 | `/input/checkbox` | Toggle checkbox summary | Route loaded | Uncheck newsletter, check notifications and terms, click `Show Selection` | Summary reflects `No/Yes/Yes` states | `@regression` | `input-checkbox toggle summary` |
| E2E-INP-003 | `/input/radio-search-submit` | Regular search with filters | Route loaded | Search `Wireless`, choose `Electronics` and `4+ Stars`, submit | Results table rows match keyword/category/rating filters | `@regression` | `input-radio-search-submit filtered results` |
| E2E-INP-004 | `/input/radio-search-submit` | No-result state | Route loaded | Search improbable keyword and submit | `Search Results (0 products found)` shown and empty-state message visible | `@regression` | `input-radio-search-submit no result state` |
| E2E-INP-005 | `/input/radio-search-submit` | Autocomplete keyboard selection | Route loaded | Switch to autocomplete mode, type keyword, select by keyboard, submit | Search input receives suggested value and returns results | `@regression` | `input-radio-search-submit autocomplete keyboard flow` |
| E2E-INP-006 | `/input/radio-search-submit` | Reset filters | Route loaded | Apply non-default mode and filters, click `Reset Filters` | Defaults restored (regular search, all radio defaults, empty query, all products heading) | `@regression` | `input-radio-search-submit reset restores defaults` |
| E2E-INP-007 | `/input/form-inputs` | Valid minimal submission | Route loaded | Fill valid email, verify CAPTCHA, submit | Result block shows submitted JSON including email and submitted timestamp | `@regression` | `input-form-inputs valid submission` |
| E2E-INP-008 | `/input/form-inputs` | Multi-field validation summary | Route loaded | Provide invalid SSN/phone/IPv4/LinkedIn with CAPTCHA verified, submit | Validation summary lists each field error and no success result is displayed | `@regression` | `input-form-inputs validation summary` |
| E2E-INP-009 | `/input/form-inputs` | Password mismatch validation | Route loaded | Enable change password, enter mismatched passwords, verify CAPTCHA, submit | Confirm-password error shown and submission result not rendered | `@regression` | `input-form-inputs password mismatch validation` |
| E2E-INP-010 | `/input/form-inputs` | Tracking mode exclusivity | Route loaded | Check `Don't track me`, then check `Enable tracking for me` | Two toggles remain mutually exclusive and field class switches between included/excluded modes | `@regression` | `input-form-inputs tracking mode exclusivity` |

## Script Location

- `tests/specs/regression/input-pages.regression.spec.ts`
- `tests/framework/pages/inputE2eFlows.ts`
