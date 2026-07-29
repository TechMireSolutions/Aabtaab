/** Draft-mode banner — gold tokens (preview chrome, not amber brand UI). */
export default function PreviewBanner() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] flex min-h-11 items-center justify-center gap-4 bg-gold-500 px-4 py-2 text-sm font-medium text-slate-950 shadow-card">
      <span>Draft preview mode — unpublished changes may be visible</span>
      <a
        href="/api/draft/disable"
        className="inline-flex min-h-11 items-center rounded-md bg-slate-950 px-3 text-xs font-semibold text-white transition-colors hover:bg-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
      >
        Exit preview
      </a>
    </div>
  );
}
