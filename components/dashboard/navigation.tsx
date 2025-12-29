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
    <div className="flex flex-col gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => dispatch(setActiveOption(option))}
          className={`p-2 text-left ${
            activeOption === option ? "bg-gray-200" : ""
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
