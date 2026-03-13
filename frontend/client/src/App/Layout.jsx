import { Outlet, ScrollRestoration } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Layout() {
  return (
    <>
      <ScrollRestoration />
      <Navbar />

      <main className="pt-16">
        <div>
          <Outlet />
        </div>
      </main>
    </>
  );
}