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
    <div className="flex flex-col items-center">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => dispatch(setActiveOption(option))}
          className={`p-5  hover:bg-gray-400 w-full text-left ${
            activeOption === option ? "bg-gray-400" : ""
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
