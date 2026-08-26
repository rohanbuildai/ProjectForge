import { useEffect, useState } from "react";
import "../components/dashboard/dashboard.css";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import WelcomeSection from "../components/dashboard/WelcomeSection";
import IntelligencePanel from "../components/dashboard/IntelligencePanel";
import StatCard from "../components/dashboard/StatCard";
import WorkspaceProgress from "../components/dashboard/WorkspaceProgress";
import TaskActivity from "../components/dashboard/TaskActivity";
import RecentProjects from "../components/dashboard/RecentProjects";
import MyTasks from "../components/dashboard/MyTasks";
import UpcomingDeadlines from "../components/dashboard/UpcomingDeadlines";
import RecentActivity from "../components/dashboard/RecentActivity";
import { STATS } from "../components/dashboard/mockData";
import "./Dashboard.css";

function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div className="dash-app">
      <a className="skip-link" href="#dashboard-content">
        Skip to content
      </a>

      <DashboardSidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {menuOpen && (
        <div
          className="dash-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="dash-main">
        <DashboardHeader onMenuClick={() => setMenuOpen((open) => !open)} />

        <main className="dash-content" id="dashboard-content">
          <WelcomeSection />
          <IntelligencePanel />

          <section className="dash-section" aria-labelledby="snapshot-title">
            <div className="dash-section-head">
              <h2 className="dash-section-title" id="snapshot-title">
                Workspace Snapshot
              </h2>
              <span className="dash-section-sub">Updated just now</span>
            </div>
            <div className="stats-grid">
              {STATS.map((stat) => (
                <StatCard key={stat.label} stat={stat} />
              ))}
            </div>
          </section>

          <div className="dash-grid-2">
            <WorkspaceProgress />
            <TaskActivity />
          </div>

          <RecentProjects />

          <div className="dash-grid-2 dash-grid-asym">
            <MyTasks />
            <UpcomingDeadlines />
          </div>

          <RecentActivity />

          <footer className="dash-footer">
            <span>ProjectForge</span>
            <span>Workspace: ProjectForge · © 2026</span>
            <span className="dash-footer-mono">v0.1.0</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;