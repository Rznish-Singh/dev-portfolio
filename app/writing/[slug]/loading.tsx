export default function Loading() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading">
      <div className="h-6 w-1/2 rounded bg-ink/10" />
      <div className="mt-3 h-4 w-32 rounded bg-ink/10" />

      <div className="mt-8 space-y-3">
        <div className="h-4 w-full rounded bg-ink/10" />
        <div className="h-4 w-11/12 rounded bg-ink/10" />
        <div className="h-4 w-4/5 rounded bg-ink/10" />
      </div>

      <div className="mt-12 h-4 w-28 rounded bg-ink/10" />
      <div className="mt-5 h-32 w-full rounded-xl bg-ink/5" />
    </div>
  );
}