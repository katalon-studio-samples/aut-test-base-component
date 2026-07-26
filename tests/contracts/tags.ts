export const TAG_TAXONOMY = [
  "@smoke",
  "@regression",
  "@nonblocking",
  "@external",
  "@dynamic",
] as const;

export type TestTag = (typeof TAG_TAXONOMY)[number];
