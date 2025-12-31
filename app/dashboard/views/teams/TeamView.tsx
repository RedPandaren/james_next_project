import React, { useEffect, useState } from "react";
import { Plus, Users, X, Settings, Briefcase, Globe } from "lucide-react";
import TeamCreate from "./TeamCreate";
import { teams } from "@prisma/client";
import { getTeam } from "@/app/actions/teams";

export default function TeamView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teams, setTeams] = useState<teams[]>([]);

  const fetchTeams = async () => {
    try {
      const teams = await getTeam();

      if (!teams || "error" in teams) {
        return;
      }
      setTeams(teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

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
    </div>
  );
}
