"use client";
import { useState } from "react";
import TaskList from "./TaskList";
import CreateTaskModal from "./TaskCreate";

export default function TaskView() {
  const [sortBy, setSortBy] = useState("priority");
  const [filterBy, setFilterBy] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-full w-full bg-gray-50">
      <header className="bg-white px-8 pt-6 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
          <p className="text-sm text-gray-500">
            Manage and track Your Task Progress
          </p>
        </div>

        <button
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md active:scale-95"
        >
          <span>+ Create Task</span>
        </button>
      </header>

      <nav className="bg-white px-8 py-3 border-b flex items-center justify-between sticky top-0 z-10">
        <div className="flex gap-6 text-sm font-medium text-gray-500">
          <button
            onClick={() => setFilterBy("all")}
            className={`pb-3 border-b-2 transition-colors ${
              filterBy === "all"
                ? "border-blue-600 text-blue-600"
                : "border-transparent hover:text-gray-700"
            }`}
          >
            All Tasks
          </button>
          <button
            onClick={() => setFilterBy("own")}
            className={`pb-3 border-b-2 transition-colors ${
              filterBy === "own"
                ? "border-blue-600 text-blue-600"
                : "border-transparent hover:text-gray-700"
            }`}
          >
            Assigned to Me
          </button>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">
            Sort By:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border rounded-md px-3 py-1.5"
          >
            <option value="priority">Priority</option>
            <option value="due_date">Due Date</option>
            <option value="status">Status</option>
            <option value="created_at">Newest</option>
          </select>
        </div>
      </nav>

      <main className="p-8 flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <TaskList sortBy={sortBy} />
        </div>
      </main>

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
