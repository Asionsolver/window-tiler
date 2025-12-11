import React, { useRef } from "react";
import { useStore } from "../store/useStore";
import Window from "./Window";
import TiledLayer from "./TiledLayer";
import SnapIndicator from "./SnapIndicator";
import HelpModal from "./HelpModal";
import { findNodeAtPoint } from "../utils/layoutUtils";

const WindowTiler = () => {
  const [showHelp, setShowHelp] = React.useState(false);

  React.useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedWindowTiler");
    if (!hasVisited) {
      setShowHelp(true);
      localStorage.setItem("hasVisitedWindowTiler", "true");
    }
  }, []);

  const {
    windows,
    floatingWindows,
    rootNode,
    createWindow,
    moveWindow,
    bringToFront,
    snapWindow,
  } = useStore();
  const draggingRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    width: number;
    height: number;
    pendingUnsnapId?: string;
    preventSnapping?: boolean;
  } | null>(null);

  // Snap State
  const [snapIndicator, setSnapIndicator] = React.useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const snapIntentRef = useRef<{
    path: number[] | null;
    direction: "left" | "right" | "top" | "bottom";
  } | null>(null);

  const handleMouseDown = (
    e: React.MouseEvent,
    id: string,
    initialX: number,
    initialY: number
  ) => {
    e.preventDefault();
    bringToFront(id);

    const fw = floatingWindows.find((w) => w.windowId === id);
    // If somehow not found (race condition?), default to something or return
    // But since we clicked it, it should be there.
    // For safety, fallback to current assumption or DOM?
    // Better to pass it in? For now, find it.
    const w = fw ? fw.width : 300;
    const h = fw ? fw.height : 200;

    draggingRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      initialX,
      initialY,
      width: w,
      height: h,
      preventSnapping: false,
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggingRef.current) return;

    // Check if this is a pending unsnap that hasn't moved enough yet
    if (draggingRef.current.pendingUnsnapId) {
      const dx = e.clientX - draggingRef.current.startX;
      const dy = e.clientY - draggingRef.current.startY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 3) return; // Too small movement, ignore

      // Threshold exceeded, trigger unsnap now
      const { unsnapWindow } = useStore.getState();
      const id = draggingRef.current.pendingUnsnapId;

      // Calculate new floating position: center on mouse
      const width = 300;
      const height = 200;
      const initialX = e.clientX - width / 2;
      const initialY = e.clientY - 20;

      unsnapWindow(id, initialX, initialY);

      // Promote to full drag
      draggingRef.current = {
        id,
        startX: e.clientX,
        startY: e.clientY,
        initialX,
        initialY,
        width,
        height,
        pendingUnsnapId: undefined, // No longer pending
        preventSnapping: true, // Prevent snapping for this drag session since we just unsnapped
      };
      return;
    }

    const { id, startX, startY, initialX, initialY, width, height } =
      draggingRef.current;

    // Move floating window
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    moveWindow(id, initialX + deltaX, initialY + deltaY);

    // Snap Detection
    // 1. Find node under cursor (or full screen if null)
    const screenRect = {
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let hit = rootNode
      ? findNodeAtPoint(rootNode, e.clientX, e.clientY, screenRect)
      : null;

    // If no root, treat screen as the "hit" empty space
    if (!rootNode) {
      hit = { node: { type: "empty" }, path: [], rect: screenRect };
    }

    if (hit && !draggingRef.current.preventSnapping) {
      const { rect } = hit;
      const SNAP_MARGIN = 30;
      let snapDir: "left" | "right" | "top" | "bottom" | null = null;

      // Check allowed axes based on aspect ratio
      const isWide = rect.width > rect.height;
      const isTall = rect.height > rect.width;
      const isEmpty = hit.node.type === "empty";

      const allowH =
        !rootNode ||
        isEmpty ||
        isWide ||
        Math.abs(rect.width - rect.height) < 1;
      const allowV =
        !rootNode ||
        isEmpty ||
        isTall ||
        Math.abs(rect.width - rect.height) < 1;

      // Check precise proximity using WINDOW EDGES
      const winLeft = initialX + deltaX;
      const winTop = initialY + deltaY;
      const winRight = winLeft + width;
      const winBottom = winTop + height;

      // Distances from container edges
      const distLeft = Math.abs(winLeft - rect.x);
      const distRight = Math.abs(winRight - (rect.x + rect.width));
      const distTop = Math.abs(winTop - rect.y);
      const distBottom = Math.abs(winBottom - (rect.y + rect.height));

      if (allowH && distLeft < SNAP_MARGIN) snapDir = "left";
      else if (allowH && distRight < SNAP_MARGIN) snapDir = "right";
      else if (allowV && distTop < SNAP_MARGIN) snapDir = "top";
      else if (allowV && distBottom < SNAP_MARGIN) snapDir = "bottom";

      if (snapDir) {
        // Calculate indicator rect
        let indicatorRect = { ...rect };

        if (isEmpty && rootNode) {
          // If targeting a NESTED empty node, we replace it fully.
          // But if it's the initial empty screen (!rootNode), we want to split (half).
          indicatorRect = { ...rect };
        } else if (snapDir === "left") {
          indicatorRect.width = Math.floor(rect.width / 2);
        } else if (snapDir === "right") {
          const half = Math.floor(rect.width / 2);
          indicatorRect.x += rect.width - half; // Ensure alignment
          indicatorRect.width = half;
        } else if (snapDir === "top") {
          indicatorRect.height = Math.floor(rect.height / 2);
        } else if (snapDir === "bottom") {
          const half = Math.floor(rect.height / 2);
          indicatorRect.y += rect.height - half;
          indicatorRect.height = half;
        }

        setSnapIndicator(indicatorRect);
        snapIntentRef.current = { path: hit.path, direction: snapDir };
        return;
      }
    }

    setSnapIndicator(null);
    snapIntentRef.current = null;
  };

  const handleMouseUp = () => {
    if (draggingRef.current && snapIntentRef.current) {
      // Perform Snap
      snapWindow(
        draggingRef.current.id,
        snapIntentRef.current.path,
        snapIntentRef.current.direction
      );
    }

    draggingRef.current = null;
    setSnapIndicator(null);
    snapIntentRef.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleTiledMouseDown = (e: React.MouseEvent, id: string) => {
    e.preventDefault();

    // Instead of unsnapping immediately, we start a "pending" drag.
    // We only unsnap if the user moves the mouse a certain distance.
    draggingRef.current = {
      id: "", // Placeholder, used only for pendingUnsnapId logic
      startX: e.clientX,
      startY: e.clientY,
      initialX: 0,
      initialY: 0,
      width: 0,
      height: 0,
      pendingUnsnapId: id,
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="relative w-screen h-screen bg-slate-900 overflow-hidden">
      {/* Tiled Layer (Background) */}
      <TiledLayer onWindowMouseDown={handleTiledMouseDown} />

      {/* Snap Indicator */}
      {snapIndicator && (
        <SnapIndicator
          x={snapIndicator.x}
          y={snapIndicator.y}
          width={snapIndicator.width}
          height={snapIndicator.height}
        />
      )}

      {/* Floating Layer (Foreground) */}
      {floatingWindows.map((fw) => {
        const data = windows[fw.windowId];
        if (!data) return null;
        return (
          <Window
            key={fw.windowId}
            data={data}
            x={fw.x}
            y={fw.y}
            width={fw.width}
            height={fw.height}
            zIndex={fw.zIndex}
            isFloating={true}
            onMouseDown={(e) => handleMouseDown(e, fw.windowId, fw.x, fw.y)}
          />
        );
      })}

      {/* FAB */}
      <button
        onClick={createWindow}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg text-3xl flex items-center justify-center z-[99999] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        title="Add New Window"
      >
        +
      </button>

      {/* Help Button */}
      <button
        onClick={() => setShowHelp(true)}
        className="fixed top-6 right-6 w-10 h-10 bg-slate-800 hover:bg-slate-700 text-white rounded-full shadow-lg flex items-center justify-center z-[99999] transition-transform hover:scale-105 active:scale-95 cursor-pointer border border-slate-600 text-lg font-bold"
        title="Help & Instructions"
      >
        ?
      </button>

      {/* Help Modal */}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
};

export default WindowTiler;
