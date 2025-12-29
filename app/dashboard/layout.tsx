// app/dashboard/layout.tsx
import { NavigationBar } from "@/components/dashboard/navigation";
import { getSessionUser } from "../actions/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getSessionUser();

  return (
    <div className="flex flex-row h-screen w-full overflow-hidden">
      <aside className="w-64 border-r flex flex-col bg-gray-50">
        <div className="border-b h-16 text-3xl flex items-center justify-center font-bold">
          User Dashboard
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavigationBar options={["Team", "Tasks", "Settings"]} />
        </div>
      </aside>

      <main className="flex-1 h-full overflow-y-auto bg-white border-5">
        {children}
      </main>
    </div>
  );
}
