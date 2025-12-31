import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { createTeam } from "@/app/actions/teams";
import { AlertFade } from "@/components/ui/reusable/alert";
import { teams } from "@prisma/client";

interface TeamCreateProps {
  onClose: () => void;
  onSuccess: (teamData?: teams) => void;
}
export default function TeamCreate({ onClose, onSuccess }: TeamCreateProps) {
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Auto-clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    setLoading(true);
    setError(""); // Clear any previous errors
    setSuccess(""); // Clear any previous success messages

    try {
      const response = await createTeam(teamName);

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.success && response.team) {
        // Team created successfully, show success message
        setSuccess(`Team "${teamName}" created successfully!`);
        // Pass team data to parent for optimistic update
        onSuccess(response.team);
        // Close modal after showing success toast for better UX
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to create team:", error);
      setError("Failed to create team. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Success Notifications */}
      {success && AlertFade(success, "success")}

      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-8 pt-8 pb-6 flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            New Team
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        <form className="px-8 pb-8 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
              {error}
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Team name
            </label>
            <input
              autoFocus
              disabled={loading}
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Engineering Squad"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !teamName.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Assemble Team"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
