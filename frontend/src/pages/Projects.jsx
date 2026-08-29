import { useEffect, useState } from "react";
import "../components/dashboard/dashboard.css";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import ProjectsHeader from "../components/projects/ProjectsHeader";
import ProjectsSummary from "../components/projects/ProjectsSummary";
import ProjectsToolbar from "../components/projects/ProjectsToolbar";
import ProjectsList from "../components/projects/ProjectsList";
import ProjectsSkeleton from "../components/projects/ProjectsSkeleton";
import ProjectsErrorState from "../components/projects/ProjectsErrorState";
import "./Projects.css";

/*
 * UI-only preview. This page renders purely presentational components and makes
 * no API calls. Replace PREVIEW projects below with backend data when integration
 * begins — the components already accept props for that.
 */
const PREVIEW_STATE = "ready"; // "loading" | "error" | "ready"

const PREVIEW_PROJECTS = [
  {
    id: "1",
    name: "Backend Migration",
    description:
      "Move the remaining services to the new API layer and retire the legacy gateway.",
    status: "in_progress",
    progress: 64,
    taskCount: 31,
    completedTasks: 19,
    members: [{ name: "RS" }, { name: "JD" }, { name: "CV" }],
    priority: "high",
    updatedAt: "yesterday",
  },
  {
    id: "2",
    name: "Website Redesign",
    description:
      "Refresh the public site with the updated brand system and component library.",
    status: "in_progress",
    progress: 78,
    taskCount: 24,
    completedTasks: 18,
    members: [{ name: "JD" }, { name: "MK" }, { name: "RS" }, { name: "AL" }],
    priority: "high",
    updatedAt: "2 days ago",
  },
  {
    id: "3",
    name: "Mobile App MVP",
    description:
      "Ship the first mobile build covering auth, tasks, and offline access.",
    status: "active",
    progress: 42,
    taskCount: 18,
    completedTasks: 7,
    members: [{ name: "MK" }, { name: "TP" }],
    priority: "medium",
    updatedAt: "5 hours ago",
  },
  {
    id: "4",
    name: "Marketing Site",
    description: "Update landing pages and roll out the new pricing structure.",
    status: "active",
    progress: 52,
    taskCount: 14,
    completedTasks: 7,
    members: [{ name: "AL" }, { name: "SK" }],
    priority: "medium",
    updatedAt: "3 days ago",
  },
  {
    id: "5",
    name: "Brand Refresh",
    description:
      "Finalize the visual identity, design tokens, and launch collateral.",
    status: "completed",
    progress: 100,
    taskCount: 12,
    completedTasks: 12,
    members: [{ name: "JD" }, { name: "SK" }],
    priority: "low",
    updatedAt: "last week",
  },
  {
    id: "6",
    name: "Legacy Cleanup",
    description:
      "Archive retired modules and decommission unused infrastructure.",
    status: "archived",
    progress: 100,
    taskCount: 15,
    completedTasks: 15,
    members: [{ name: "MK" }],
    priority: "low",
    updatedAt: "2 weeks ago",
  },
];

const PREVIEW_SUMMARY = { total: 6, active: 4, completed: 1, archived: 1 };

function Projects() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  let pageMain;

  if (PREVIEW_STATE === "loading") {
    pageMain = <ProjectsSkeleton />;
  } else if (PREVIEW_STATE === "error") {
    pageMain = <ProjectsErrorState />;
  } else {
    pageMain = (
      <>
        <ProjectsHeader />
        <ProjectsSummary summary={PREVIEW_SUMMARY} />
        <ProjectsToolbar />
        <ProjectsList projects={PREVIEW_PROJECTS} />
      </>
    );
  }

  return (
    <div className="dash-app">
      <a className="skip-link" href="#projects-content">
        Skip to content
      </a>

      <DashboardSidebar
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={null}
        workspaces={[]}
        selectedId={null}
        onSelectWorkspace={null}
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
          user={null}
          workspaceName="Workspace"
          unreadCount={0}
          pageTitle="Projects"
          sectionLabel="Projects"
        />

        <main className="dash-content" id="projects-content">
          {pageMain}

          <footer className="dash-footer">
            <span>ProjectForge</span>
            <span>Projects · © {new Date().getFullYear()}</span>
            <span className="dash-footer-mono">v0.1.0</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default Projects;