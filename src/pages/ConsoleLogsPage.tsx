import { useRef, useState } from "react";
import { ListTree, Terminal } from "lucide-react";
import {
  CONSOLE_LEVELS,
  writeToConsole,
  type ConsoleLevel,
} from "../fixtures/consoleLogFixtures";

type ConsoleActivity = {
  sequence: number;
  level: ConsoleLevel;
  message: string;
};

export const ConsoleLogsPage = () => {
  const nextSequence = useRef(1);
  const [activity, setActivity] = useState<ConsoleActivity[]>([]);

  const emitConsoleMessage = (level: ConsoleLevel) => {
    const sequence = nextSequence.current;
    nextSequence.current += 1;
    const message = `[Console Log Fixture][${level.toUpperCase()}] Event ${sequence}`;

    writeToConsole(level, message);
    setActivity((current) => [{ sequence, level, message }, ...current]);
  };

  const emitAllLevels = () => {
    CONSOLE_LEVELS.forEach(({ level }) => emitConsoleMessage(level));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="border-b border-gray-200 pb-6 dark:border-gray-700">
        <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
          <ListTree aria-hidden="true" className="h-4 w-4" />
          TrueTest Session Replay fixture · Issue 2900
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Console log fixture
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-300">
          Emit deterministic browser console messages while recording a session.
          Each click produces one event so capture, level filtering, ordering,
          and playback can be verified precisely.
        </p>
      </header>

      <section className="py-6" aria-labelledby="console-controls-heading">
        <div className="flex flex-col gap-3 border-b border-gray-200 pb-5 sm:flex-row sm:items-end sm:justify-between dark:border-gray-700">
          <div>
            <h2 id="console-controls-heading" className="text-xl font-semibold">
              Console levels
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              “Warn” invokes the browser’s standard console.warn method.
            </p>
          </div>
          <button
            type="button"
            onClick={emitAllLevels}
            data-test="emit-all-console-levels"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            <Terminal aria-hidden="true" className="h-4 w-4" />
            Emit all five levels
          </button>
        </div>

        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {CONSOLE_LEVELS.map(
            ({ level, label, description, icon: Icon, badgeClassName }) => (
              <li
                key={level}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-md ${badgeClassName}`}
                  >
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{label}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {description}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => emitConsoleMessage(level)}
                  data-test={`emit-console-${level}`}
                  className="min-h-11 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                >
                  Emit {label}
                </button>
              </li>
            ),
          )}
        </ul>
      </section>

      <section
        className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
        aria-labelledby="activity-heading"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 id="activity-heading" className="text-xl font-semibold">
              Emitted activity
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Newest event first · {activity.length} emitted
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActivity([])}
            disabled={activity.length === 0}
            className="min-h-11 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Clear history
          </button>
        </div>

        <div className="mt-4" aria-live="polite">
          {activity.length === 0 ? (
            <p
              data-test="console-activity-empty"
              className="rounded-md bg-gray-50 px-4 py-6 text-center text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400"
            >
              No console messages emitted yet.
            </p>
          ) : (
            <ol className="space-y-2">
              {activity.map(({ sequence, level, message }) => (
                <li
                  key={sequence}
                  data-test="console-activity-row"
                  className="flex flex-col gap-1 rounded-md border border-gray-200 px-3 py-2 sm:flex-row sm:items-center sm:gap-3 dark:border-gray-700"
                >
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {level}
                  </span>
                  <code className="break-all text-sm text-gray-800 dark:text-gray-200">
                    {message}
                  </code>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </div>
  );
};
