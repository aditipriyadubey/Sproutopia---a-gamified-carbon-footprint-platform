import { cn } from "@/lib/utils";

export function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "w-full text-center py-6 px-4 mt-auto border-t-[3px] border-border bg-card",
        "font-display text-[10px] sm:text-xs text-muted-foreground select-none",
        className,
      )}
      aria-label="Footer"
    >
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-1.5 hover:scale-105 hover:text-foreground transition-all duration-300">
          Made with love, care & giggles{" "}
          <span className="inline-block animate-bounce text-base">🌱</span>
          <span className="inline-block animate-pulse text-base">✨</span>
        </div>
        <div className="hidden sm:inline text-muted-foreground/30">|</div>
        <div className="opacity-80 hover:opacity-100 transition-opacity">
          © Aditipriya 2026. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
