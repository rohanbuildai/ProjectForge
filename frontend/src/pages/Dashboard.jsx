import { useEffect, useMemo, useState } from "react";
import "../components/dashboard/dashboard.css";
import useDashboardData from "../components/dashboard/useDashboardData";
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
import CreateWorkspaceModal from "../components/dashboard/CreateWorkspaceModal";
import EmptyWorkspaceState from "../components/dashboard/EmptyWorkspaceState";
import DashboardSkeleton from "../components/dashboard/DashboardSkeleton";
import DashboardErrorState from "../components/dashboard/DashboardErrorState";
import "./Dashboard.css";

function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [createWsOpen, setCreateWsOpen] = useState(false);

  const {
    user,
    workspaces,
    selectedWorkspace,
    selectWorkspace,
    handleWorkspaceCreated,
    bootLoading,
    bootError,
    loadBoot,
    dashboardLoading,
    dashboardError,
    tasksError,
    refreshWorkspaceData,
    unreadCount,
    statistics,
    stats,
    recentProjects,
    taskActivity,
    recentActivity,
    tasks,
    insights,
  } = useDashboardData();

  const myTasks = useMemo(
    () =>
      tasks.filter(
        (task) => Number(task.assigned_to) === Number(user?.id)
      ),
    [tasks, user]
  );

  const openCreateWorkspace = () => {
    setMenuOpen(false);
    setCreateWsOpen(true);
  };

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    if (!createWsOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [createWsOpen]);

  let content;

  if (bootLoading) {
    content = <DashboardSkeleton />;
  } else if (bootError && workspaces.length === 0) {
    content = <DashboardErrorState onRetry={loadBoot} />;
  } else if (workspaces.length === 0) {
    content = <EmptyWorkspaceState onCreateWorkspace={openCreateWorkspace} />;
  } else if (dashboardLoading || !statistics) {
    content = <DashboardSkeleton />;
  } else if (dashboardError) {
    content = <DashboardErrorState onRetry={refreshWorkspaceData} />;
  } else {
    content = (
      <>
        <WelcomeSection user={user} workspace={selectedWorkspace} />

        <IntelligencePanel
          user={user}
          workspace={selectedWorkspace}
          statistics={statistics}
          insights={insights}
          tasksError={tasksError}
        />

        <section className="dash-section" aria-labelledby="snapshot-title">
          <div className="dash-section-head">
            <h2 className="dash-section-title" id="snapshot-title">
              Workspace Snapshot
            </h2>
            <span className="dash-section-sub">Live from {selectedWorkspace?.name}</span>
          </div>
          <div className="stats-grid">
            {stats.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </div>
        </section>

        <div className="dash-grid-2">
          <WorkspaceProgress statistics={statistics} />
          <TaskActivity activity={taskActivity} />
        </div>

        <RecentProjects projects={recentProjects} />

        <div className="dash-grid-2 dash-grid-asym">
          <MyTasks tasks={myTasks} tasksError={tasksError} />
          <UpcomingDeadlines tasks={tasks} tasksError={tasksError} />
        </div>

        <RecentActivity activity={recentActivity} />
      </>
    );
  }

  return (
    <div className="dash-app">
      <a className="skip-link" href="#dashboard-content">
        Skip to content
      </a>

      <DashboardSidebar
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onCreateWorkspace={openCreateWorkspace}
        user={user}
        workspaces={workspaces}
        selectedId={selectedWorkspace?.id}
        onSelectWorkspace={selectWorkspace}
      />

      {menuOpen && (
        <div
          className="dash-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="dash-main">
        <DashboardHeader
          onMenuClick={() => setMenuOpen((open) => !open)}
          user={user}
          workspaceName={selectedWorkspace?.name}
          unreadCount={unreadCount}
        />

        <main className="dash-content" id="dashboard-content">
          {content}

          <footer className="dash-footer">
            <span>ProjectForge</span>
            <span>Workspace: {selectedWorkspace?.name || "—"} · © {new Date().getFullYear()}</span>
            <span className="dash-footer-mono">v0.1.0</span>
          </footer>
        </main>
      </div>

      {createWsOpen && (
        <CreateWorkspaceModal
          onClose={() => setCreateWsOpen(false)}
          onCreated={handleWorkspaceCreated}
        />
      )}
    </div>
  );
}

export default Dashboard;