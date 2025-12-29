"use client"; // Required for useState
import { useState } from "react";

export const NavigationBar = ({
  options = ["Overview", "Analytics", "Settings"],
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <nav className="flex flex-col w-full h-full border-r bg-gray-50">
      <div className="p-4 font-bold text-lg border-b text-center">
        Task User Dashboard
      </div>

      <div className="flex flex-col flex-1 py-4 px-3 gap-y-5">
        {options.map((option, index) => {
          // 2. Check if this specific item is the active one
          const isActive = activeIndex === index;

          return (
            <div
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`
                px-3 py-2 text-lg font-medium cursor-pointer transition-colors rounded-md
                ${
                  isActive
                    ? "bg-gray-200 text-black shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-black"
                }
              `}
            >
              {option}
            </div>
          );
        })}
      </div>
    </nav>
  );
};
