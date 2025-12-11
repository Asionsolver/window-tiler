import React from "react";
import { useStore, type TreeNode } from "../store/useStore";
import Window from "./Window";

interface TreeNodeProps {
  node: TreeNode;
  onWindowMouseDown: (e: React.MouseEvent, id: string) => void;
}

const TreeNodeRenderer: React.FC<TreeNodeProps> = ({
  node,
  onWindowMouseDown,
}) => {
  const windows = useStore((state) => state.windows);

  if (node.type === "window") {
    const data = windows[node.windowId];
    if (!data) return null; // Should not happen if state is consistent
    return (
      <Window
        data={data}
        isFloating={false}
        onMouseDown={(e) => onWindowMouseDown(e, node.windowId)}
      />
    );
  }

  if (node.type === "empty") {
    return <div className="w-full h-full" />; // Invisible spacer
  }

  // SplitNode
  if (node.type !== "split") return null;

  const isRow = node.direction === "row";
  return (
    <div
      className={`flex flex-1 w-full h-full overflow-hidden ${
        isRow ? "flex-row" : "flex-col"
      }`}
    >
      <div className="flex-1 relative overflow-hidden flex">
        <TreeNodeRenderer
          node={node.children[0]}
          onWindowMouseDown={onWindowMouseDown}
        />
      </div>
      {/* Resizer could go here later */}
      <div className="flex-1 relative overflow-hidden flex">
        <TreeNodeRenderer
          node={node.children[1]}
          onWindowMouseDown={onWindowMouseDown}
        />
      </div>
    </div>
  );
};

interface TiledLayerProps {
  onWindowMouseDown: (e: React.MouseEvent, id: string) => void;
}

const TiledLayer: React.FC<TiledLayerProps> = ({ onWindowMouseDown }) => {
  const rootNode = useStore((state) => state.rootNode);

  if (!rootNode) return null;

  return (
    <div className="absolute inset-0 z-0 p-1">
      <TreeNodeRenderer node={rootNode} onWindowMouseDown={onWindowMouseDown} />
    </div>
  );
};

export default TiledLayer;
