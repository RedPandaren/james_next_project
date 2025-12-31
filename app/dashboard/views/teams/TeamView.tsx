import React, { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Users,
  X,
  Settings,
  Briefcase,
  Globe,
  Trash2,
} from "lucide-react";
import TeamCreate from "./TeamCreate";
import { teams } from "@prisma/client";
import { getTeam, deleteTeam } from "@/app/actions/teams";
import { AlertFade } from "@/components/ui/reusable/alert";

export default function TeamView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teams, setTeams] = useState<teams[]>([]);
  const [teamToDelete, setTeamToDelete] = useState<teams | null>(null);
  const [deletingTeamId, setDeletingTeamId] = useState<number | null>(null);

  const handleDeleteTeam = async (team: teams) => {
    setDeletingTeamId(team.id);
    try {
      const response = await deleteTeam(team.id);

      if (response.error) {
        AlertFade(response.error, "error");
        return;
      }

      if (response.success) {
        // Optimistic update: remove team from state immediately
        setTeams((prevTeams) => prevTeams.filter((t) => t.id !== team.id));
        AlertFade(`Team "${team.name}" deleted successfully`, "success");
        setTeamToDelete(null);
      }
    } catch (error) {
      console.error("Failed to delete team:", error);
      AlertFade("Failed to delete team. Please try again.", "error");
    } finally {
      setDeletingTeamId(null);
    }
  };

  const confirmDeleteTeam = (team: teams) => {
    setTeamToDelete(team);
  };

  const cancelDelete = () => {
    setTeamToDelete(null);
  };

  const fetchTeams = useCallback(async () => {
    try {
      const teams = await getTeam();

      if (!teams || "error" in teams) {
        return;
      }
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => setTeams(teams), 0);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans text-slate-900">
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Teams</h1>
            <p className="text-sm text-slate-500 font-medium">
              Create and Manage your own Team
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
          >
            <Plus size={20} strokeWidth={3} />
            Create Team
          </button>
        </header>

        <section className="p-8 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
            {teams.map((team) => (
              <div
                key={team.id}
                className="bg-white border border-slate-200 p-6 rounded-2xl hover:shadow-lg transition-shadow group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Users size={24} />
                  </div>
                  <button
                    onClick={() => confirmDeleteTeam(team)}
                    disabled={deletingTeamId === team.id}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Delete team"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  {team.name}
                </h3>
                <p className="text-sm text-slate-500 mb-6">test test</p>
                <button className="w-full py-2 bg-slate-50 text-slate-600 font-bold rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                  View Team
                </button>
              </div>
            ))}

            <button
              onClick={() => setIsModalOpen(true)}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-400 transition-all"
            >
              <Plus size={32} className="mb-2" />
              <span className="font-bold">Add New Team</span>
            </button>
          </div>
        </section>
      </main>

      {isModalOpen && (
        <TeamCreate
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchTeams}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {teamToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={cancelDelete}
          />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-8 pt-8 pb-6">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-4">
                Delete Team
              </h2>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete{" "}
                <strong>{`"${teamToDelete.name}"`}</strong>? This action cannot
                be undone and will remove all team data.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteTeam(teamToDelete)}
                  disabled={deletingTeamId === teamToDelete.id}
                  className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deletingTeamId === teamToDelete.id
                    ? "Deleting..."
                    : "Delete Team"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
