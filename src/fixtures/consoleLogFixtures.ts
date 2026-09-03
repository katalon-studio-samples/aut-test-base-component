import { Bug, CircleAlert, Info, Terminal } from "lucide-react";

export type ConsoleLevel = "log" | "debug" | "info" | "warn" | "error";

export const CONSOLE_LEVELS: Array<{
  level: ConsoleLevel;
  label: string;
  description: string;
  icon: typeof Terminal;
  badgeClassName: string;
}> = [
  {
    level: "log",
    label: "Log",
    description: "General application activity",
    icon: Terminal,
    badgeClassName:
      "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100",
  },
  {
    level: "debug",
    label: "Debug",
    description: "Detailed troubleshooting context",
    icon: Bug,
    badgeClassName:
      "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-200",
  },
  {
    level: "info",
    label: "Info",
    description: "Informational application events",
    icon: Info,
    badgeClassName:
      "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-200",
  },
  {
    level: "warn",
    label: "Warn",
    description: "Recoverable conditions needing attention",
    icon: CircleAlert,
    badgeClassName:
      "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  },
  {
    level: "error",
    label: "Error",
    description: "Failures requiring investigation",
    icon: CircleAlert,
    badgeClassName: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200",
  },
];

export const writeToConsole = (level: ConsoleLevel, message: string) => {
  switch (level) {
    case "log":
      console.log(message);
      break;
    case "debug":
      console.debug(message);
      break;
    case "info":
      console.info(message);
      break;
    case "warn":
      console.warn(message);
      break;
    case "error":
      console.error(message);
      break;
  }
};
