# TrueTest Object Clustering Static Sample

Standalone static HTML/CSS/JavaScript app for testing TrueTest TestObject clustering and matching.

## Run

Open directly from disk:

```text
file:///.../public/true-test-clustering/index.html?version=A
file:///.../public/true-test-clustering/index.html?version=B
```

When using the local Vite server:

```text
http://localhost:5173/true-test-clustering/index.html?version=A
http://localhost:5173/true-test-clustering/index.html?version=B
```

Routes are selected inside the standalone app through hash navigation:

- `#/query-template`
- `#/studies/123/queries/456`
- `#/admin/permissions`
- `#/profile/settings`
- `#/dashboard`

Example:

```text
file:///.../public/true-test-clustering/index.html?version=B#/studies/123/queries/456
```

## Scenario Matrix

| ID | Page | Object type | Version A implementation | Version B implementation | Stable signals | Changed signals | Expected classification | Expected TrueTest behavior | Risk |
|---:|---|---|---|---|---|---|---|---|---|
| 1 | `/query-template` | Issue input | Label `Issue`, placeholder `Enter issue name`, role `textbox`, `data-testid=issue_value`, id `cr-input-0svzb-2`, class `ng-untouched ng-pristine ng-valid` | Same label/placeholder/test id, id `cr-input-2kd04-5`, class `ng-pristine ng-valid ng-touched`, wrapper added before input | URL pattern, role, label, placeholder, data-testid | Generated id, class order, XPath index | `same_object_variant` | Same logical TestObject | false duplicate |
| 2 | `/query-template` | Save button | Text `Save`, id `save-button`, class `btn btn-primary` | Text `Save`, id `save-button-v2`, class `button button-main`, moved into sticky footer | URL pattern, role, visible text, action result | id, CSS locator, wrapper, XPath | `same_object_variant` | Same logical Save button | false duplicate |
| 3 | `/query-template` | Filter inputs | `ID`, `Name`, `Description` use same structure and generated classes | Same structure and similar generated ids | Labels and placeholders identify each field | Generated ids/classes | `related_distinct_objects` | Must split by label or placeholder | false merge |
| 4 | `/studies/123/queries/456` | Repeated status buttons | 15 rows, ids `query-row-1` to `query-row-15`, normal order | Rows reordered, one new row near top, generated row ids/classes changed | Table context, Query ID, Query Name, repeated row structure | Row index, raw XPath, row id/class | `collection_family` | Identify repeated status controls as collection pattern | collection row identity |
| 5 | `/admin/permissions` | Service checkboxes | Navigator, E-learning, Participant, Billing rows in original order with stable `for/id` | Rows reordered, wrapper classes changed, `for/id` stable | Label `for`, checkbox id, service name | Row order, wrapper CSS, XPath | `distinct_static_candidates` | Must not merge all checkboxes into one object | false merge |
| 6 | `/studies/123/queries/456` | Status dropdown | Label `Status`, id `cr-select-q2msr-1`, options All/Pending/Open/Closed | Label `Status`, id `cr-select-x3se8-1`, same options, wrapper index changes | Label, options, URL pattern | Generated id, wrapper, XPath | `same_object_variant` | Same logical dropdown | false duplicate |
| 7 | `/studies/123/queries/456` | Filter dropdown group | Category, Generated, Status, Site, Subject use same component structure | Same component family with different generated ids | Individual labels and option meanings | Generated ids/classes | `related_distinct_objects` | Must not merge different filters because of shared `cr-select` structure | false merge |
| 8 | `/query-template` | Category select | `data-testid=category_value=query`, text query/dcr, generated CSS | Same data-testid, different generated class and wrapper | data-testid, label Category | Wrapper, generated class, XPath | `single_object_static` | Strong semantic anchor should identify object | false duplicate |
| 9 | `/studies/123/queries/456` | Weak generic combobox | No label, no aria-label, generic text, id `cr-select-random` | Generated id and wrapper changed | Generic text only | Generated id, wrapper, XPath | `ambiguous` | Low confidence or manual review | weak signal |
| 10 | `/dashboard` | Unlabeled icon toolbar | Five icon-only buttons, no aria-label, same class `icon-button` | Same icons but DOM order changes | Weak role and icon shape only | DOM order, XPath | `ambiguous` | Must not confidently merge unrelated icons | weak signal |
| 11 | `/dashboard` | Labeled icon buttons | Refresh, Export, Delete have stable aria-label | CSS and DOM wrapper changed | aria-label and role | CSS, wrapper, XPath | `same_object_variant` | Stable aria-label identifies each object | false duplicate |
| 12 | `/query-template` | Submit vs Archive button | Button text `Submit`, action result `Submitted` | Same location button text `Archive`, action result `Archived` | Similar page location | Visible text and action result | `no_match` | Must not reuse Submit as Archive | false merge |
| 13 | `/profile/settings` | Profile Save button | Save button on Profile page | Save button remains on Profile page; Query Template also has Save | URL/page context and form context | none significant | `distinct_static_candidates` | Do not match with Save on `/query-template` | false merge |
| 14 | `/studies/123/queries/456` | Edit row action and edit form | Edit opens inline edit panel | Edit opens modal dialog; fields keep same labels | Row identity, Edit text, form labels | DOM relocation, modal portal, XPath | `same_object_variant` | Relocation should not create duplicate objects | false duplicate |
| 15 | `/query-template` | Hidden Save duplicate | Visible Save plus hidden Save with similar class | Same hidden duplicate risk around sticky footer Save | Visible state and action result | Wrapper and placement | `ambiguous` | Visible action should be selected; hidden duplicate should not cause confident merge | hidden duplicate |

## QA Workflows

1. Open Version A and record each route.
2. Repeat the same workflow in Version B.
3. Verify positive scenarios stay grouped as variants.
4. Verify negative scenarios split into separate objects.
5. Verify repeated table controls form collection families.
6. Verify weak-signal controls are ambiguous or manual-review candidates.

The page writes button clicks, dropdown changes, checkbox toggles, row details, and modal actions into the visible `Interaction result` panel.
