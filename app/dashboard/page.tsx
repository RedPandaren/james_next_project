import { ComponentExample } from "@/components/component-example";
import { NavigationBar } from "@/components/dashboard/navigation";
export default function Page() {
  return (
    <div className="border 5 flex flex-row h-screen w-screen">
      <div className="border 5 w-1/7 h-full">
        <NavigationBar
          options={["Overview", "Analytics", "Customers", "Settings"]}
        />
      </div>
      <div className="border 5 w-3/5 h-full"> test</div>
    </div>
  );
}
