import { useRef } from "react";
// Reuse the AUT's rm-slider track/handle adapter shape and pointer/keyboard behavior.
export function CustomSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const track = useRef<HTMLDivElement>(null);
  const move = (x: number) => {
    const rect = track.current!.getBoundingClientRect();
    const next = Math.max(
      1,
      Math.min(10, Math.round(1 + ((x - rect.left) / rect.width) * 9)),
    );
    if (next !== value) onChange(next);
  };
  return (
    <div className="slider-container lib-custom-slider">
      <div className="rm-slider">
        <div
          ref={track}
          className="rm-slider-track"
          id="lib-limit-track"
          onClick={(e) => move(e.clientX)}
          onPointerDown={(e) => {
            e.preventDefault();
            e.currentTarget.setPointerCapture(e.pointerId);
            move(e.clientX);
          }}
          onPointerMove={(e) => {
            if (e.currentTarget.hasPointerCapture(e.pointerId)) move(e.clientX);
          }}
          onPointerUp={(e) => {
            if (e.currentTarget.hasPointerCapture(e.pointerId))
              e.currentTarget.releasePointerCapture(e.pointerId);
          }}
        >
          <span
            className="rm-slider-handle"
            id="lib-limit-slider"
            role="slider"
            tabIndex={0}
            aria-label="Active loan limit"
            aria-valuemin={1}
            aria-valuemax={10}
            aria-valuenow={value}
            aria-valuetext={`${value} ${value === 1 ? "book" : "books"}`}
            style={{ left: `${((value - 1) / 9) * 100}%` }}
            onKeyDown={(e) => {
              const keys: Record<string, number> = {
                ArrowRight: value + 1,
                ArrowUp: value + 1,
                ArrowLeft: value - 1,
                ArrowDown: value - 1,
                Home: 1,
                End: 10,
                PageUp: value + 2,
                PageDown: value - 2,
              };
              if (e.key in keys) {
                e.preventDefault();
                onChange(Math.max(1, Math.min(10, keys[e.key])));
              }
            }}
          >
            {value}
          </span>
        </div>
      </div>
      <div className="lib-between lib-muted">
        <span>1 book</span>
        <span>10 books</span>
      </div>
    </div>
  );
}
