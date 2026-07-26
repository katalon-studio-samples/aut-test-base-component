import type { TestTag } from "./tags";

export type Priority = "P0" | "P1" | "P2";
export type AutomationStatus = "Automated" | "Planned" | "Not Started";

export interface FunctionSpec {
  id: string;
  name: string;
  description: string;
  preconditions: string;
  steps: string;
  expectedResult: string;
  tags: TestTag[];
  automationStatus: AutomationStatus;
  priority: Priority;
}

export interface RouteSpec {
  id: string;
  path: string;
  title: string;
  deterministic: boolean;
  functions: FunctionSpec[];
}
