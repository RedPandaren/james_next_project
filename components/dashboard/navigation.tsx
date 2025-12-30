"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/redux/naviStore";
import { setActiveOption } from "@/app/redux/naviSlice";

export const NavigationBar = ({ options }: { options: string[] }) => {
  const dispatch = useDispatch();

  const activeOption = useSelector(
    (state: RootState) => state.navigation.activeOption
  );

  return (
    <div className="flex flex-col items-center mt-4">
      <div className="flex flex-col p-5 gap-4 w-full overflow-y-auto">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => dispatch(setActiveOption(option))}
            className={`p-3 rounded-xl hover:bg-indigo-700 transition-colors w-full text-left ${
              activeOption === option ? "bg-indigo-700" : ""
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};
