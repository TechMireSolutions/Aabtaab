"use client";

export default function PreviewBanner() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] flex items-center justify-center gap-4 bg-amber-500 px-4 py-2 text-sm font-medium text-amber-950 shadow-lg">
      <span>Draft preview mode — unpublished changes may be visible</span>
      <a
        href="/api/draft/disable"
        className="rounded-md bg-amber-950 px-3 py-1 text-xs font-semibold text-amber-50 hover:bg-amber-900"
      >
        Exit preview
      </a>
    </div>
  );
}
