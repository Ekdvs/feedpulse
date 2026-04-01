// components/Loader.tsx
import React from "react";

interface LoaderProps {
  size?: number;        // size of the spinner in px
  colorFrom?: string;   // start color of gradient
  colorTo?: string;     // end color of gradient
  text?: string;        // loading text
}

const Loader: React.FC<LoaderProps> = ({
  size = 80,
  colorFrom = "#3B82F6", // Blue
  colorTo = "#06B6D4",   // Cyan
  text = "Loading..."
}) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-50 space-y-6">
      
      {/* Gradient Swirl with Glow */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: "6px solid transparent",
          borderTop: `6px solid ${colorFrom}`,
          borderRight: `6px solid ${colorTo}`,
          boxShadow: `0 0 20px ${colorFrom}, 0 0 40px ${colorTo}`,
          animation: "spin 1s linear infinite",
        }}
      ></div>

      {/* Loading Text */}
      <p
        style={{ color: colorFrom }}
        className="text-xl font-bold tracking-wide"
      >
        {text}
      </p>

      {/* Custom Spin Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </div>
  );
};

export default Loader;