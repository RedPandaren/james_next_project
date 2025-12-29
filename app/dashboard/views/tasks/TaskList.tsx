"use client";

import { getUserTask } from "@/app/actions/tasks";
import { RootState } from "@/app/redux/naviStore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { tasks } from "@prisma/client";

interface TaskListProps {
  sortBy: string;
}

export default function TaskList({ sortBy }: TaskListProps) {
  const [taskList, setTaskList] = useState<tasks[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeOption = useSelector(
    (state: RootState) => state.navigation.activeOption
  );
  console.log(sortBy);
  useEffect(() => {
    const fetchTasks = async () => {
      setError(null);

      const result = await getUserTask(sortBy);

      if (result && "error" in result) {
        setError(result.error);
        setTaskList([]);
      } else {
        setTaskList(result as tasks[]);
      }
    };

    fetchTasks();
  }, [activeOption, sortBy]);

  if (!taskList || taskList.length === 0) {
    return (
      <div className="text-center p-10 border-2 border-dashed rounded-xl">
        <p className="text-gray-500">No Tasks Yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {taskList.map((task) => (
        <div
          key={task.id}
          className="bg-white border rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <span
                className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full ${
                  task.priority
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {task.priority ? "High Priority" : "Development"}
              </span>

              <h3 className="text-lg font-bold mt-2">{task.title}</h3>
              <p className="text-gray-600 text-sm mt-1">
                {task.description || "No description provided."}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">Due Date</p>
              <p className="text-sm text-gray-900">
                {task.due_date
                  ? new Date(task.due_date).toLocaleDateString()
                  : "No Date Set"}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                YOU
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${getStatusStyles(
                  task.status
                )}`}
              ></span>
              <span className="text-sm text-gray-600 font-medium capitalize">
                {task.status?.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const getStatusStyles = (status: string | null) => {
  switch (status) {
    case "done":
      return {
        dot: "bg-green-500",
        text: "text-green-700",
        bg: "bg-green-100",
      };
    case "in_progress":
      return {
        dot: "bg-orange-400",
        text: "text-orange-700",
        bg: "bg-orange-100",
      };
    case "todo":
      return { dot: "bg-gray-400", text: "text-gray-700", bg: "bg-gray-100" };
    default:
      return { dot: "bg-slate-300", text: "text-slate-600", bg: "bg-slate-50" };
  }
};
