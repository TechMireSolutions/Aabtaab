"use client";

interface CarouselScrollButtonsProps {
  trackId: string;
  bg?: "white" | "gray";
}

export default function CarouselScrollButtons({
  trackId,
  bg = "white",
}: CarouselScrollButtonsProps) {
  function scrollBy(dir: "left" | "right") {
    const el = document.getElementById(trackId);
    if (!el) return;
    const card = el.querySelector("[data-card]") as HTMLElement | null;
    const amount = card ? card.offsetWidth + 24 : 320;
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  const fadeFrom = bg === "gray" ? "from-slate-50" : "from-white";

  return (
    <>
      <div className="hidden items-center gap-1.5 sm:flex">
        <button
          type="button"
          onClick={() => scrollBy("left")}
          aria-label="Previous"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-full border-2 border-gray-200 text-gray-500 transition-all duration-200 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="size-4"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => scrollBy("right")}
          aria-label="Next"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-full border-2 border-gray-200 text-gray-500 transition-all duration-200 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="size-4"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-0 left-0 top-0 z-10 hidden w-10 bg-linear-to-r sm:block ${fadeFrom} to-transparent opacity-40`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-0 right-0 top-0 z-10 hidden w-10 bg-linear-to-l sm:block ${fadeFrom} to-transparent opacity-40`}
      />
    </>
  );
}
