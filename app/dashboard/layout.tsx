// app/dashboard/layout.tsx
import { NavigationBar } from "@/components/dashboard/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row h-screen w-full overflow-hidden">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="border-b h-23  flex items-center justify-center text-2xl font-bold text-white">
          User Dashboard
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavigationBar options={["Teams", "Tasks", "Settings"]} />
        </div>
      </aside>

      <main className="flex-1 h-full overflow-y-auto bg-white border ">
        {children}
      </main>
    </div>
  );
}
