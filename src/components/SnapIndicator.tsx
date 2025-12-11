import React from "react";

interface SnapIndicatorProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

const SnapIndicator: React.FC<SnapIndicatorProps> = ({
  x,
  y,
  width,
  height,
}) => {
  return (
    <div
      className="absolute bg-blue-500/30 border-2 border-blue-500 rounded-lg pointer-events-none transition-all duration-100 ease-out z-[999999]"
      style={{
        left: x,
        top: y,
        width,
        height,
      }}
    />
  );
};

export default SnapIndicator;
