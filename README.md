# Window Tiler

A dynamic tiling window system built with React, TailwindCSS, and Zustand, inspired by modern OS window management. This project demonstrates window creation, movement, snapping, and resizing in a grid-like interface.

## Features

- **Add Windows:** Create new windows using the "+" button located at the bottom-right corner. Each window is assigned a random color and appears at a random position on the screen.
- **Draggable Windows:** Move windows around freely by dragging their top bar.
- **Close Windows:** Close any window using the close button on the top bar.
- **Edge Snapping:** When a window is moved close (within 30px) to the edges of the screen, a transparent indicator shows the potential snapping position.
- **Snap to Sides:** Snap windows to the top, bottom, left, or right edges of the screen. Snapped windows take up 50% of the respective axis and fill the full width or height depending on the snap direction.
- **Nested Snapping:** Windows can be further snapped inside an existing window’s grid. Snapping within sub-grids is limited to the longer axis to optimize layout.
- **Dynamic Resizing:** Closing or moving a snapped window causes the remaining window(s) in the grid cell to expand and occupy the freed space.
- **Floating Windows:** Windows can be moved out of their snapped positions, becoming floating windows again, while the remaining windows adjust automatically.

## How It Works

1. Windows are generated at random positions with random background colors.
2. Dragging the window’s top bar allows for repositioning.
3. Snapping is detected when windows come close to edges or sub-grid boundaries.
4. Nested grids allow complex window layouts, similar to modern OS tiling systems.
5. The layout dynamically adjusts when windows are closed or moved.
6. **Zustand** is used for managing the state of all windows, including positions, snap states, and dynamic resizing.

## Tech Stack

- **React** – Frontend framework
- **TailwindCSS** – Styling and layout
- **Zustand** – State management for windows
- **HTML & CSS** – Core rendering without additional libraries or canvas/svg

## Usage

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm start` to start the application.
4. Use the "+" button to add windows and drag/close them as needed.

## Evaluation

The project demonstrates the following functionalities:

- Windows appear at random positions ✅
- Windows can be moved ✅
- Snap-to-side functionality ✅
- Nested snapping inside existing windows ✅
- Windows can be closed/removed ✅
- Other windows grow or shrink properly when layout changes ✅

---

This project is a practical demonstration of dynamic window management and layout handling in React using Zustand for state management.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
