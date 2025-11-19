/**
 * Page footer component displaying tech stack information
 */
export function PageFooter() {
  return (
    <footer className="mt-6 rounded-lg bg-slate-100 p-4 text-xs text-slate-600">
      <p className="font-semibold mb-2">Tech Stack:</p>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <span className="font-medium">Frontend:</span> Next.js 15, React 19, TanStack Virtual, useInfiniteScroll hook
        </div>
        <div>
          <span className="font-medium">Backend:</span> Express, Drizzle ORM, MySQL 8.0
        </div>
      </div>
      <p className="mt-2 text-slate-500">
        Features: Virtual scrolling, infinite scroll, hot reloading, Docker Compose orchestration
      </p>
    </footer>
  );
}
