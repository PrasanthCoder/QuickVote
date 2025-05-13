// components/ConfirmationDialog.tsx
"use client";

import { useState } from "react";

export function ConfirmationDialog({
  trigger,
  title,
  message,
  onConfirm,
}: {
  trigger: React.ReactNode;
  title: string;
  message: string;
  onConfirm: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{trigger}</div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg text-black font-bold mb-2">{title}</h3>
            <p className="mb-4 text-gray-400">{message}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border text-gray-400 rounded "
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  setIsOpen(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
