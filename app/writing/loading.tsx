export default function Loading() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading">
      <div className="mb-4 h-5 w-20 rounded bg-ink/10" />
      <div className="border-b border-ink/10">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="grid grid-cols-[3.5rem_1fr] border-t border-ink/10 py-3 sm:grid-cols-[8rem_1fr]"
          >
            <div className="h-5 w-10 rounded bg-ink/10" />
            <div className="flex justify-between gap-4">
              <div className="h-5 w-2/3 rounded bg-ink/10" />
              <div className="h-5 w-10 rounded bg-ink/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}