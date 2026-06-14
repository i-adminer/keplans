"use client";

const globalConsole = globalThis as typeof globalThis & {
  __keplansConsoleErrorPatched?: boolean;
};

if (
  typeof window !== "undefined" &&
  process.env.NODE_ENV === "development" &&
  !globalConsole.__keplansConsoleErrorPatched
) {
  const originalError = console.error;

  console.error = (...args: Parameters<typeof console.error>) => {
    const [firstArg] = args;

    if (
      typeof firstArg === "string" &&
      firstArg.includes("Encountered a script tag while rendering React component")
    ) {
      return;
    }

    originalError(...args);
  };

  globalConsole.__keplansConsoleErrorPatched = true;
}

export default function DevConsoleErrorFilter() {
  return null;
}
