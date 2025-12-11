import React from "react";
import { useStore, type WindowData } from "../store/useStore";

interface WindowProps {
  data: WindowData;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  zIndex?: number;
  isFloating: boolean;
  onMouseDown?: (e: React.MouseEvent) => void;
}

const Window: React.FC<WindowProps> = ({
  data,
  x,
  y,
  width,
  height,
  zIndex,
  isFloating,
  onMouseDown,
}) => {
  const closeWindow = useStore((state) => state.closeWindow);

  const style: React.CSSProperties = isFloating
    ? {
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        zIndex,
      }
    : {
        width: "100%",
        height: "100%",
        flex: 1,
      };

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-lg shadow-xl border border-gray-700 bg-gray-800 ${
        isFloating ? "absolute" : "relative w-full h-full"
      }`}
      style={style}
    >
      {/* Title Bar */}
      <div
        className="h-8 bg-gray-900 flex items-center justify-between px-2 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={onMouseDown}
      >
        <span className="text-white text-xs font-bold">{data.title}</span>
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            closeWindow(data.id);
          }}
          className="w-4 h-4 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-xs text-black font-bold"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4" style={{ backgroundColor: data.color }}>
        <p className="text-white mix-blend-difference opacity-50">Content</p>
      </div>
    </div>
  );
};

export default Window;
