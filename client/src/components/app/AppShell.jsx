import React from "react";
import { Outlet } from "react-router-dom";
import { PublicHeader } from "./PublicHeader.jsx";
import { Footer } from "./Footer.jsx";

export function AppShell() {
  return (
    <div className="site-layout-wrapper">
      <PublicHeader />
      <main className="app-main site-body-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
