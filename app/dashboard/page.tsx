// app/dashboard/page.tsx
"use client";
import { useSelector } from "react-redux";
import { RootState } from "../redux/naviStore";
import TaskView from "./views/tasks/TaskView";
import TeamView from "./views/teams/TeamView";

export default function Page() {
  const activeOption = useSelector(
    (state: RootState) => state.navigation.activeOption
  );

  const renderContent = () => {
    switch (activeOption) {
      case "Tasks":
        return <TaskView />;
      case "Teams":
        return <TeamView />;

      default:
        return <div> no action selected</div>;
    }
  };

  return renderContent();
}
