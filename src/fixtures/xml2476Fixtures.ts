export type Xml2476DomField =
  | "textContent"
  | "title"
  | "aria-label"
  | "data-comparison"
  | "placeholder"
  | "id"
  | "className";

export type Xml2476Expectation = {
  field: Xml2476DomField;
  value: string;
};

export type Xml2476Fixture = {
  id: string;
  element: "button" | "input" | "select";
  description: string;
  visibleText?: string;
  expectations: Xml2476Expectation[];
  group:
    | "text-before-relative"
    | "relative-xpath"
    | "text-after-relative"
    | "selector";
};

export const expectedFixtures: Xml2476Fixture[] = [
  {
    id: "T01",
    element: "button",
    description: "Ampersand in button text",
    expectations: [{ field: "textContent", value: "Print & Complete" }],
    group: "text-before-relative",
  },
  {
    id: "T02",
    element: "button",
    description: "Leading and trailing spaces",
    expectations: [{ field: "textContent", value: " Print & Complete " }],
    group: "text-before-relative",
  },
  {
    id: "T03",
    element: "button",
    description: "Leading space and final LF",
    expectations: [{ field: "textContent", value: " Print & Complete\n" }],
    group: "text-before-relative",
  },
  {
    id: "T04",
    element: "button",
    description: "Ampersand and CRLF",
    expectations: [
      { field: "textContent", value: "Line 1 & Continue\r\nLine 2" },
    ],
    group: "text-before-relative",
  },
  {
    id: "T05",
    element: "button",
    description: "Less-than character with surrounding spaces",
    expectations: [{ field: "textContent", value: " Save < Exit " }],
    group: "text-before-relative",
  },
  {
    id: "T06",
    element: "button",
    description: "Greater-than character with surrounding spaces",
    expectations: [{ field: "textContent", value: " Save > Exit " }],
    group: "text-before-relative",
  },
  {
    id: "T07",
    element: "button",
    description: "XML-sensitive title and accessible name",
    visibleText: "T07 attribute target",
    expectations: [
      { field: "title", value: "Review & Sign < Continue" },
      { field: "aria-label", value: "Review & Sign < Continue" },
    ],
    group: "text-before-relative",
  },
  {
    id: "T08",
    element: "button",
    description: "Repeated text in stable relative-XPath structure",
    expectations: [{ field: "textContent", value: "Print & Complete" }],
    group: "relative-xpath",
  },
  {
    id: "T09",
    element: "button",
    description: "Less-than character in data and title attributes",
    visibleText: "T09 relative XPath target",
    expectations: [
      { field: "data-comparison", value: "A < B" },
      { field: "title", value: "Compare A < B" },
    ],
    group: "relative-xpath",
  },
  {
    id: "T10",
    element: "button",
    description: "Literal ampersand entity-like text",
    expectations: [{ field: "textContent", value: "Fish &amp; Chips" }],
    group: "text-after-relative",
  },
  {
    id: "T11",
    element: "button",
    description: "Literal numeric entity-like text",
    expectations: [{ field: "textContent", value: "A &#38; B" }],
    group: "text-after-relative",
  },
  {
    id: "S01",
    element: "button",
    description: "Stable direct-child CSS chain with quotes and spaces",
    visibleText: "S01 direct-child selector target",
    expectations: [
      { field: "title", value: 'Track > direct child "with quotes"' },
    ],
    group: "selector",
  },
  {
    id: "S02",
    element: "button",
    description: "Stable ID and classes suitable for placeholder replacement",
    visibleText: "S02 placeholder-ready selector target",
    expectations: [
      { field: "id", value: "xml2476-dynamic-12345" },
      {
        field: "className",
        value: "xml2476-dynamic-target replaceable-id replaceable-class",
      },
    ],
    group: "selector",
  },
  {
    id: "S03",
    element: "input",
    description: "Email input with matching semantic attributes",
    expectations: [
      { field: "placeholder", value: "Email *" },
      { field: "aria-label", value: "Email *" },
      { field: "id", value: "xml2476-email" },
    ],
    group: "selector",
  },
  {
    id: "S04",
    element: "select",
    description: "Combobox with policy suffix ID",
    expectations: [
      { field: "id", value: "DomainPolicy_InsuredSuffix" },
      { field: "aria-label", value: "Select..." },
    ],
    group: "selector",
  },
  {
    id: "S05",
    element: "input",
    description: "Digit-leading ID for escaped CSS selectors",
    expectations: [
      { field: "placeholder", value: "1234567890" },
      { field: "id", value: "123-xml2476-phone" },
    ],
    group: "selector",
  },
];

export const fixtureById = new Map(
  expectedFixtures.map((fixture) => [fixture.id, fixture]),
);

export const characterCodes = (value: string) =>
  Array.from(value).map((character) => character.codePointAt(0));
