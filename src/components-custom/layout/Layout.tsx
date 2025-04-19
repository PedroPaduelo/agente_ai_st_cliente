import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-background">
        <div className="container mx-auto max-w-7xl p-4 md:p-6 h-full flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
