import { ComponentExample } from "@/components/component-example";
import { NavigationBar } from "@/components/dashboard/navigation";
export default function Page() {
  return (
    <div className="border 5 flex flex-row h-screen w-screen">
      <div className="border 5 w-1/7 h-full">
        <div className="border-b-2 h-15 flex items-center justify-center">
          <span>User Dashboard</span>
        </div>
        <NavigationBar options={["Team", "Tasks", "Settings"]} />
      </div>
      <div className="border 5 w-3/5 h-full"> test</div>
    </div>
  );
}
