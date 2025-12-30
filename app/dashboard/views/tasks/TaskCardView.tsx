"use client";

import { updateUserTask } from "@/app/actions/tasks";
import { tasks, task_status } from "@prisma/client"; // Added task_status import
import { useState } from "react";
import { useRouter } from "next/navigation";

interface TaskCardViewProps {
  task: tasks;
  onClose: () => void;
}

export default function TaskCardView({ task, onClose }: TaskCardViewProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Local state for the form fields
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || "",
    // Cast the initial status to the Prisma enum type
    status: (task.status as task_status) || "todo",
    priority: task.priority,
  });

  const getStatusStyles = (status: string | null) => {
    switch (status) {
      case "done":
        return { text: "text-green-700", bg: "bg-green-100" };
      case "in_progress":
        return { text: "text-orange-700", bg: "bg-orange-100" };
      default:
        return { text: "text-gray-700", bg: "bg-gray-100" };
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Pass the formData to your server action
      await updateUserTask(task.id, formData);

      setIsEditing(false);
      router.refresh(); // Refreshes the server components to show new data
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            {!isEditing ? (
              <span
                className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                  getStatusStyles(formData.status).bg
                } ${getStatusStyles(formData.status).text}`}
              >
                {formData.status.replace("_", " ")}
              </span>
            ) : (
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as task_status,
                  })
                }
                className="text-xs font-bold border rounded-md px-2 py-1 outline-indigo-500 bg-white"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            )}

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              &times;
            </button>
          </div>

          <div className="mb-6">
            <label className="text-xs font-bold text-gray-400 uppercase">
              Title
            </label>
            {isEditing ? (
              <input
                type="text"
                className="w-full text-2xl font-bold text-gray-900 border-b-2 border-indigo-500 outline-none mt-1"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-900">
                {formData.title}
              </h2>
            )}
          </div>

          <div className="space-y-6">
            <section>
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Description
              </h4>
              {isEditing ? (
                <textarea
                  className="w-full text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border focus:ring-2 ring-indigo-500 outline-none h-32"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              ) : (
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {formData.description || "This task has no description."}
                </p>
              )}
            </section>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-transparent has-[:focus]:border-indigo-500 transition-colors">
                <h4 className="text-xs font-semibold text-gray-400 uppercase">
                  Priority
                </h4>
                {isEditing ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="checkbox"
                      id="priority"
                      checked={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.checked })
                      }
                      className="w-4 h-4 accent-indigo-600 cursor-pointer"
                    />
                    <label
                      htmlFor="priority"
                      className="text-sm font-medium cursor-pointer"
                    >
                      High Priority
                    </label>
                  </div>
                ) : (
                  <p className="font-medium text-gray-900">
                    {formData.priority ? "🔥 High" : "☕ Normal"}
                  </p>
                )}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-xs font-semibold text-gray-400 uppercase">
                  Due Date
                </h4>
                <p className="font-medium text-gray-900">
                  {task.due_date
                    ? new Date(task.due_date).toLocaleDateString(undefined, {
                        dateStyle: "long",
                      })
                    : "None"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            {isEditing ? (
              <>
                <button
                  disabled={loading}
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  onClick={handleSave}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 border border-indigo-600 text-indigo-600 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
                >
                  Edit Task
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
