import { Outlet, ScrollRestoration } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Layout() {
  return (
    <>
      <ScrollRestoration />
      <Navbar />
      <main className="">
        <div className="">
          <Outlet />
        </div>
      </main>
    </>
  );
}