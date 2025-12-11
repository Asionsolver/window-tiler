import { create } from "zustand";

export interface WindowData {
  id: string;
  title: string;
  color: string;
}

export interface FloatingWindow {
  windowId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

export type SplitDirection = "row" | "col";

export interface SplitNode {
  type: "split";
  direction: SplitDirection;
  children: [TreeNode, TreeNode];
  ratio: number; // 0 to 1, default 0.5
}

export interface WindowNode {
  type: "window";
  windowId: string;
}

export interface EmptyNode {
  type: "empty";
}

export type TreeNode = SplitNode | WindowNode | EmptyNode;

interface StoreState {
  windows: Record<string, WindowData>;
  floatingWindows: FloatingWindow[];
  rootNode: TreeNode | null;
  nextZIndex: number;

  createWindow: () => void;
  moveWindow: (id: string, x: number, y: number) => void;
  bringToFront: (id: string) => void;
  closeWindow: (id: string) => void;
  snapWindow: (
    activeId: string,
    targetNodePath: number[] | null,
    direction: "left" | "right" | "top" | "bottom"
  ) => void;
  unsnapWindow: (id: string, x: number, y: number) => void;
}

const CONSTANT_WIDTH = 300;
const CONSTANT_HEIGHT = 200;

const getRandomColor = () => {
  const colors = [
    "#f87171",
    "#fb923c",
    "#fbbf24",
    "#a3e635",
    "#34d399",
    "#22d3ee",
    "#818cf8",
    "#e879f9",
    "#f472b6",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const useStore = create<StoreState>((set) => ({
  windows: {},
  floatingWindows: [],
  rootNode: null,
  nextZIndex: 1,

  createWindow: () => {
    const id = crypto.randomUUID();
    const color = getRandomColor();

    // Random position within view (simplified)
    const maxX = window.innerWidth - CONSTANT_WIDTH;
    const maxY = window.innerHeight - CONSTANT_HEIGHT;
    const x = Math.max(0, Math.floor(Math.random() * maxX));
    const y = Math.max(0, Math.floor(Math.random() * maxY));

    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          id,
          title: `Window ${Object.keys(state.windows).length + 1}`,
          color,
        },
      },
      floatingWindows: [
        ...state.floatingWindows,
        {
          windowId: id,
          x,
          y,
          width: CONSTANT_WIDTH,
          height: CONSTANT_HEIGHT,
          zIndex: state.nextZIndex,
        },
      ],
      nextZIndex: state.nextZIndex + 1,
    }));
  },

  moveWindow: (id, x, y) => {
    set((state) => ({
      floatingWindows: state.floatingWindows.map((fw) =>
        fw.windowId === id ? { ...fw, x, y } : fw
      ),
    }));
  },

  bringToFront: (id) => {
    set((state) => ({
      floatingWindows: state.floatingWindows.map((fw) =>
        fw.windowId === id ? { ...fw, zIndex: state.nextZIndex } : fw
      ),
      nextZIndex: state.nextZIndex + 1,
    }));
  },

  closeWindow: (id) => {
    set((state) => {
      const isFloating = state.floatingWindows.some((fw) => fw.windowId === id);

      let newFloating = state.floatingWindows.filter(
        (fw) => fw.windowId !== id
      );
      let newRoot = state.rootNode;
      const newWindows = { ...state.windows };
      delete newWindows[id];

      if (!isFloating && newRoot) {
        // Remove from tree
        newRoot = removeNode(newRoot, id);
      }

      return {
        windows: newWindows,
        floatingWindows: newFloating,
        rootNode: newRoot,
      };
    });
  },

  snapWindow: (activeId, targetPath, direction) => {
    set((state) => {
      // 1. Remove from floating
      const newFloating = state.floatingWindows.filter(
        (fw) => fw.windowId !== activeId
      );

      // 2. Create the window node
      const newWindowNode: WindowNode = { type: "window", windowId: activeId };
      const emptyNode: EmptyNode = { type: "empty" };

      // Helper to wrap two nodes in a split
      const createSplit = (
        dir: "row" | "col",
        first: TreeNode,
        second: TreeNode
      ): SplitNode => ({
        type: "split",
        direction: dir,
        children: [first, second],
        ratio: 0.5,
      });

      let newRoot = state.rootNode;

      if (!newRoot) {
        // Initial snap on empty screen
        if (direction === "left")
          newRoot = createSplit("row", newWindowNode, emptyNode);
        else if (direction === "right")
          newRoot = createSplit("row", emptyNode, newWindowNode);
        else if (direction === "top")
          newRoot = createSplit("col", newWindowNode, emptyNode);
        else if (direction === "bottom")
          newRoot = createSplit("col", emptyNode, newWindowNode);
      } else if (targetPath) {
        // Insert into existing tree at path
        const updateTree = (node: TreeNode, path: number[]): TreeNode => {
          if (path.length === 0) {
            // Target reached.
            // If the target is an EmptyNode, just REPLACE it with the new window.
            // This allows filling the empty space (e.g. [A | Empty] -> [A | B])
            if (node.type === "empty") {
              return newWindowNode;
            }

            // Otherwise, split the existing window
            if (direction === "left")
              return createSplit("row", newWindowNode, node);
            if (direction === "right")
              return createSplit("row", node, newWindowNode);
            if (direction === "top")
              return createSplit("col", newWindowNode, node);
            if (direction === "bottom")
              return createSplit("col", node, newWindowNode);
            return node;
          }

          if (node.type !== "split") return node;

          const [head, ...tail] = path;
          const newChildren = [...node.children] as [TreeNode, TreeNode];
          newChildren[head] = updateTree(node.children[head], tail);

          return { ...node, children: newChildren };
        };

        newRoot = updateTree(newRoot, targetPath);
      }

      return {
        floatingWindows: newFloating,
        rootNode: newRoot,
      };
    });
  },

  unsnapWindow: (id, x, y) => {
    set((state) => {
      if (!state.windows[id]) return {};

      let newRoot = state.rootNode;
      if (newRoot) {
        newRoot = removeNode(newRoot, id);
      }

      // Add back to floating
      const newFloating = [
        ...state.floatingWindows,
        {
          windowId: id,
          x,
          y,
          width: CONSTANT_WIDTH,
          height: CONSTANT_HEIGHT,
          zIndex: state.nextZIndex,
        },
      ];

      return {
        rootNode: newRoot,
        floatingWindows: newFloating,
        nextZIndex: state.nextZIndex + 1,
      };
    });
  },
}));

// Helper to remove a node by windowId and return the new subtree (or null if empty)
// Actually, if a child is removed, we return the *other* child to replace the parent split.
const removeNode = (node: TreeNode, id: string): TreeNode | null => {
  if (node.type === "window") {
    if (node.windowId === id) return null; // Signal removal
    return node;
  }
  if (node.type === "empty") return node;

  // SplitNode
  const left = removeNode(node.children[0], id);
  const right = removeNode(node.children[1], id);

  // If one child is removed (returns null), return the other child
  // This effectively "collapses" the split.
  if (left === null) return right;
  if (right === null) return left; // If right is null, return left

  // If no change or both still exist (deep change), return new split
  if (left !== node.children[0] || right !== node.children[1]) {
    return { ...node, children: [left, right] };
  }

  return node;
};
