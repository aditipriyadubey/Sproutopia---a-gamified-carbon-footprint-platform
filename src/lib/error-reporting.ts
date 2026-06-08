export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  console.error("[Sproutopia Error]:", error, context);
}
