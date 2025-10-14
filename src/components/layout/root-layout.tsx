import { Outlet } from "react-router-dom";
import RootHeader from "./root-header";

export default function RootLayout() {
  return (
    <div className="relative min-h-screen">
      <RootHeader />
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
}
