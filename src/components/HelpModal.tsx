import React from "react";

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-w-lg w-full p-6 text-white relative animate-fade-in-up">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Welcome to Window Tiler!
        </h2>

        <p className="text-slate-300 mb-6">
          Here is a quick guide on how to use the application:
        </p>

        <ul className="space-y-3 mb-8">
          <li className="flex items-start">
            <span className="bg-indigo-500/20 text-indigo-400 p-1 rounded mr-3 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </span>
            <span>
              <strong className="text-white">Add Windows:</strong> Click the
              floating <span className="text-indigo-400 font-mono">+</span>{" "}
              button in the bottom-right corner.
            </span>
          </li>
          <li className="flex items-start">
            <span className="bg-indigo-500/20 text-indigo-400 p-1 rounded mr-3 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="5 9 2 12 5 15"></polyline>
                <polyline points="9 5 12 2 15 5"></polyline>
                <polyline points="15 19 12 22 9 19"></polyline>
                <polyline points="19 9 22 12 19 15"></polyline>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <line x1="12" y1="2" x2="12" y2="22"></line>
              </svg>
            </span>
            <span>
              <strong className="text-white">Move & Drag:</strong> Drag windows
              by their top title bar to move them around freely.
            </span>
          </li>
          <li className="flex items-start">
            <span className="bg-indigo-500/20 text-indigo-400 p-1 rounded mr-3 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
              </svg>
            </span>
            <span>
              <strong className="text-white">Snap:</strong> Drag a window to any
              screen edge (Top, Bottom, Left, Right) to snap it into place.
            </span>
          </li>
          <li className="flex items-start">
            <span className="bg-indigo-500/20 text-indigo-400 p-1 rounded mr-3 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h6v6"></path>
                <path d="M10 14L21 3"></path>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              </svg>
            </span>
            <span>
              <strong className="text-white">Unsnap:</strong> Drag a snapped
              window away from its position to make it float again.
            </span>
          </li>
          <li className="flex items-start">
            <span className="bg-red-500/20 text-red-400 p-1 rounded mr-3 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </span>
            <span>
              <strong className="text-white">Close:</strong> Click the{" "}
              <span className="text-red-400">×</span> button on the window title
              bar to remove it.
            </span>
          </li>
        </ul>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors cursor-pointer shadow-lg hover:shadow-indigo-500/25"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
