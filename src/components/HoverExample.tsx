import React, { useState } from "react";

export const HoverExample: React.FC = () => {
  const [hoveredFigure, setHoveredFigure] = useState<number | null>(null);

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
      data-test="hover-example"
    >
      {[1, 2, 3].map((figure) => (
        <div
          key={figure}
          className="relative"
          onMouseEnter={() => setHoveredFigure(figure)}
          onMouseLeave={() => setHoveredFigure(null)}
          data-test={`hover-figure-${figure}`}
        >
          <img
            src={`https://picsum.photos/seed/${figure}/400/300`}
            alt={`Figure ${figure}`}
            className="w-full h-48 object-cover rounded"
          />
          {hoveredFigure === figure && (
            <div
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white"
              data-test={`hover-caption-${figure}`}
            >
              <h3 className="text-xl">Figure {figure}</h3>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
