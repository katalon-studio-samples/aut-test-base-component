import React from "react";
import MultiTieredMenu, { MenuItem } from "../components/MultiTieredMenu";

const splitLabel = (
  firstLine: string,
  secondLine: string,
  eyebrow?: string,
): React.ReactNode => (
  <span className="block">
    {eyebrow && (
      <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
        {eyebrow}
      </span>
    )}
    <span>{firstLine}</span>
    <br />
    <span className="font-semibold">{secondLine}</span>
  </span>
);

const inlineLabel = (
  firstPart: string,
  secondPart: string,
  detail?: string,
): React.ReactNode => (
  <span className="flex flex-col">
    <span>
      <span>{firstPart}</span>
      <span className="font-semibold"> {secondPart}</span>
    </span>
    {detail && (
      <span className="text-xs text-gray-500 dark:text-gray-400">{detail}</span>
    )}
  </span>
);

const menuItems: MenuItem[] = [
  {
    id: "customer-ops",
    label: "Customer Operations",
    content: splitLabel("Customer", "Operations", "Division"),
    children: [
      {
        id: "account-review",
        label: "Account Review",
        content: inlineLabel("Account", "Review", "New + existing clients"),
        children: [
          {
            id: "priority-queue",
            label: "Priority Queue",
            content: splitLabel("Priority", "Queue"),
          },
          {
            id: "manual-audit",
            label: "Manual Audit",
            content: inlineLabel("Manual", "Audit"),
          },
        ],
      },
      {
        id: "billing-resolution",
        label: "Billing Resolution",
        content: splitLabel("Billing", "Resolution"),
        children: [
          {
            id: "invoice-recheck",
            label: "Invoice Recheck",
            content: inlineLabel("Invoice", "Recheck"),
          },
          {
            id: "refund-escalation",
            label: "Refund Escalation",
            content: splitLabel("Refund", "Escalation"),
          },
        ],
      },
    ],
  },
  {
    id: "field-services",
    label: "Field Services",
    content: splitLabel("Field", "Services", "Region"),
    children: [
      {
        id: "site-visit",
        label: "Site Visit",
        content: inlineLabel("Site", "Visit", "Schedule + verify"),
        children: [
          {
            id: "pre-checklist",
            label: "Pre Visit Checklist",
            content: splitLabel("Pre Visit", "Checklist"),
          },
          {
            id: "arrival-window",
            label: "Arrival Window",
            content: inlineLabel("Arrival", "Window"),
          },
        ],
      },
      {
        id: "equipment-swap",
        label: "Equipment Swap",
        content: splitLabel("Equipment", "Swap"),
        children: [
          {
            id: "device-pickup",
            label: "Device Pickup",
            content: inlineLabel("Device", "Pickup"),
          },
          {
            id: "replacement-dropoff",
            label: "Replacement Dropoff",
            content: splitLabel("Replacement", "Dropoff"),
          },
        ],
      },
    ],
  },
  {
    id: "partner-programs",
    label: "Partner Programs",
    content: splitLabel("Partner", "Programs", "Channel"),
    children: [
      {
        id: "onboarding-track",
        label: "Onboarding Track",
        content: inlineLabel("Onboarding", "Track", "Templates + signoff"),
        children: [
          {
            id: "compliance-pack",
            label: "Compliance Pack",
            content: splitLabel("Compliance", "Pack"),
          },
          {
            id: "launch-brief",
            label: "Launch Brief",
            content: inlineLabel("Launch", "Brief"),
          },
        ],
      },
      {
        id: "performance-reviews",
        label: "Performance Reviews",
        content: splitLabel("Performance", "Reviews"),
        children: [
          {
            id: "quarterly-scorecard",
            label: "Quarterly Scorecard",
            content: inlineLabel("Quarterly", "Scorecard"),
          },
          {
            id: "renewal-readiness",
            label: "Renewal Readiness",
            content: splitLabel("Renewal", "Readiness"),
          },
        ],
      },
    ],
  },
];

export const MultiTieredMenuInnerTextPage: React.FC = () => {
  return (
    <div className="space-y-6 px-4 py-6 sm:px-0">
      <header className="space-y-3">
        <div className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300">
          Nested Text Menu
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Multi-tiered menu with descendant text nodes
        </h1>
        <p className="max-w-4xl text-sm leading-6 text-gray-600 dark:text-gray-300">
          Each menu label is rendered by nested{" "}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">
            span
          </code>{" "}
          elements and line breaks instead of direct parent text. This gives the
          clickable parent element an aggregated{" "}
          <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">
            innerText
          </code>{" "}
          value assembled from child nodes.
        </p>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Hover through the levels, then inspect the menu buttons. The visible
          text is intentionally broken into descendants so locator strategies
          can target parent elements whose text comes from child nodes.
        </p>
      </section>

      <MultiTieredMenu items={menuItems} />
    </div>
  );
};
