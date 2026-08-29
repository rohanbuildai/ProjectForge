import { useEffect, useState } from "react";
import "../components/dashboard/dashboard.css";
import useProjectsData from "../components/projects/useProjectsData";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import ProjectsHeader from "../components/projects/ProjectsHeader";
import ProjectsSummary from "../components/projects/ProjectsSummary";
import ProjectsToolbar from "../components/projects/ProjectsToolbar";
import ProjectsList from "../components/projects/ProjectsList";
import ProjectsEmptyState from "../components/projects/ProjectsEmptyState";
import ProjectsSkeleton from "../components/projects/ProjectsSkeleton";
import ProjectsErrorState from "../components/projects/ProjectsErrorState";
import CreateProjectModal from "../components/projects/CreateProjectModal";
import CreateWorkspaceModal from "../components/dashboard/CreateWorkspaceModal";
import EmptyWorkspaceState from "../components/dashboard/EmptyWorkspaceState";
import DashboardSkeleton from "../components/dashboard/DashboardSkeleton";
import DashboardErrorState from "../components/dashboard/DashboardErrorState";
import "./Projects.css";

function Projects() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createWsOpen, setCreateWsOpen] = useState(false);
  const [view, setView] = useState("grid");

  const {
    user,
    workspaces,
    selectedWorkspace,
    selectWorkspace,
    handleWorkspaceCreated,
    bootLoading,
    bootError,
    loadBoot,
    projects,
    statistics,
    projectsLoading,
    projectsError,
    refreshProjects,
    filtersActive,
    unreadCount,
    searchTerm,
    setSearchTerm,
    status,
    setStatus,
    sortKey,
    setSortKey,
  } = useProjectsData();

  const openCreateProject = () => setCreateOpen(true);

  const openCreateWorkspace = () => {
    setMenuOpen(false);
    setCreateWsOpen(true);
  };

  const handleCreated = () => {
    refreshProjects();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatus("all");
    setSortKey("updated");
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
    if (!createOpen && !createWsOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [createOpen, createWsOpen]);

  let pageMain;

  if (bootLoading) {
    pageMain = <DashboardSkeleton />;
  } else if (bootError && workspaces.length === 0) {
    pageMain = <DashboardErrorState onRetry={loadBoot} />;
  } else if (workspaces.length === 0) {
    pageMain = <EmptyWorkspaceState />;
  } else if (projectsLoading || projects === null) {
    pageMain = <ProjectsSkeleton />;
  } else if (projectsError) {
    pageMain = <ProjectsErrorState onRetry={refreshProjects} />;
  } else {
    pageMain = (
      <>
        <ProjectsHeader
          workspaceName={selectedWorkspace?.name}
          onCreateProject={openCreateProject}
        />

        <ProjectsSummary summary={statistics} />

        <ProjectsToolbar
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          statusValue={status}
          onStatusChange={setStatus}
          sortValue={sortKey}
          onSortChange={setSortKey}
          view={view}
          onViewChange={setView}
        />

        {projects.length > 0 ? (
          <ProjectsList projects={projects} view={view} />
        ) : filtersActive ? (
          <ProjectsEmptyState variant="no-results" onClearFilters={clearFilters} />
        ) : (
          <ProjectsEmptyState onCreateProject={openCreateProject} />
        )}
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
          pageTitle="Projects"
          sectionLabel="Projects"
        />

        <main className="dash-content" id="projects-content">
          {pageMain}

          <footer className="dash-footer">
            <span>ProjectForge</span>
            <span>
              {selectedWorkspace?.name || "Workspace"} · Projects · ©{" "}
              {new Date().getFullYear()}
            </span>
            <span className="dash-footer-mono">v0.1.0</span>
          </footer>
        </main>
      </div>

      {createOpen && selectedWorkspace && (
        <CreateProjectModal
          workspaceId={selectedWorkspace.id}
          onClose={() => setCreateOpen(false)}
          onCreated={handleCreated}
        />
      )}

      {createWsOpen && (
        <CreateWorkspaceModal
          onClose={() => setCreateWsOpen(false)}
          onCreated={handleWorkspaceCreated}
        />
      )}
    </div>
  );
}

export default Projects;