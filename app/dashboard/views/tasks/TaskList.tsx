"use client";

import { getUserTask } from "@/app/actions/tasks";
import { RootState } from "@/app/redux/naviStore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { tasks } from "@prisma/client";
import TaskCardView from "./TaskCardView";

interface TaskListProps {
  sortBy: string;
}

export default function TaskList({ sortBy }: TaskListProps) {
  const [taskList, setTaskList] = useState<tasks[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [selectedTask, setSelectedTask] = useState<tasks | null>(null);

  const activeOption = useSelector(
    (state: RootState) => state.navigation.activeOption
  );

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
    <div className="relative">
      <div className="flex flex-col gap-4">
        {taskList.map((task) => (
          <div
            key={task.id}
            onClick={() => setSelectedTask(task)}
            className="bg-white border rounded-xl shadow-sm p-5 hover:shadow-md transition-all cursor-pointer hover:border-indigo-300"
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
                <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                  {task.description || "No description provided."}
                </p>
              </div>
              <div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500">Due Date</p>
                  <p className="text-sm text-gray-900">
                    {task.due_date
                      ? new Date(task.due_date).toLocaleDateString()
                      : "No Date Set"}
                  </p>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-end gap-2 mt-1">
                    <span className="text-sm text-gray-900 capitalize font-medium">
                      {task.status?.replace("_", " ")}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        task.status === "done"
                          ? "bg-green-500"
                          : task.status === "in_progress"
                          ? "bg-orange-400"
                          : "bg-gray-400"
                      }`}
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTask && (
        <TaskCardView
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
