import type { TreeNode } from "../store/useStore";

export interface NodeRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface NodeHit {
  node: TreeNode;
  path: number[]; // path of indices from root, e.g., [0, 1] means root.children[0].children[1]
  rect: NodeRect;
}

export const getRectForPath = (
  root: TreeNode | null,
  path: number[],
  containerRect: NodeRect
): NodeRect | null => {
  if (!root) return null;
  if (path.length === 0) return containerRect;

  let currentRect = { ...containerRect };
  let currentNode = root;

  for (const index of path) {
    if (currentNode.type !== "split") return null; // Should not happen if path is valid

    const isRow = currentNode.direction === "row";
    const childCuts = 0.5; // Always 50% for now

    if (isRow) {
      const w = currentRect.width * childCuts;
      if (index === 0) {
        currentRect.width = w;
      } else {
        currentRect.x += w;
        currentRect.width = currentRect.width - w; // Remaining
      }
    } else {
      const h = currentRect.height * childCuts;
      if (index === 0) {
        currentRect.height = h;
      } else {
        currentRect.y += h;
        currentRect.height = currentRect.height - h;
      }
    }
    currentNode = currentNode.children[index];
  }

  return currentRect;
};

export const findNodeAtPoint = (
  node: TreeNode | null,
  x: number,
  y: number,
  currentRect: NodeRect
): NodeHit | null => {
  if (!node) return null;

  // Check if point is inside current rect
  if (
    x < currentRect.x ||
    x > currentRect.x + currentRect.width ||
    y < currentRect.y ||
    y > currentRect.y + currentRect.height
  ) {
    return null;
  }

  if (node.type === "window" || node.type === "empty") {
    return { node, path: [], rect: currentRect };
  }

  // SplitNode
  const isRow = node.direction === "row";
  const child1Ratio = 0.5;

  let rect1, rect2;
  if (isRow) {
    const w1 = currentRect.width * child1Ratio;
    rect1 = { ...currentRect, width: w1 };
    rect2 = {
      ...currentRect,
      x: currentRect.x + w1,
      width: currentRect.width - w1,
    };
  } else {
    const h1 = currentRect.height * child1Ratio;
    rect1 = { ...currentRect, height: h1 };
    rect2 = {
      ...currentRect,
      y: currentRect.y + h1,
      height: currentRect.height - h1,
    };
  }

  // Recurse child 0
  const hit1 = findNodeAtPoint(node.children[0], x, y, rect1);
  if (hit1) {
    return { ...hit1, path: [0, ...hit1.path] };
  }

  // Recurse child 1
  const hit2 = findNodeAtPoint(node.children[1], x, y, rect2);
  if (hit2) {
    return { ...hit2, path: [1, ...hit2.path] };
  }

  return null;
};
