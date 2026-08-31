import { useEffect, useState } from "react";
import "../components/dashboard/dashboard.css";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import TasksHeader from "../components/tasks/TasksHeader";
import TasksSummary from "../components/tasks/TasksSummary";
import TasksToolbar from "../components/tasks/TasksToolbar";
import TasksList from "../components/tasks/TasksList";
import TasksBoard from "../components/tasks/TasksBoard";
import EmptyTasksState from "../components/dashboard/EmptyTasksState";
import "./Tasks.css";

/* ------------------------------------------------------------------
   UI-only preview — this page makes NO API calls.

   The PREVIEW_* values below exist only to render the design before
   backend integration. They are generic placeholders (no real business
   data) and live in ONE isolated block.

   To integrate: delete this block and pass real values as props —
   the header, summary, toolbar, list and board already consume props:
     <TasksSummary summary={...} />
     <TasksList tasks={...} />
     <TasksBoard tasks={...} />
   Set PREVIEW_EMPTY to true to preview the empty state.
------------------------------------------------------------------- */
const PREVIEW_EMPTY = false;

const PREVIEW_WORKSPACES = [{ id: 1, name: "Workspace", role: "OWNER" }];

const PREVIEW_SUMMARY = { total: 8, todo: 2, in_progress: 3, completed: 2, overdue: 1 };

const PREVIEW_TASKS = [
  {
    id: "t1",
    title: "Implement authentication flow",
    project: "Backend Migration",
    assignee: "JD",
    priority: "high",
    status: "in_progress",
    dueLabel: "Today",
    overdue: false,
  },
  {
    id: "t2",
    title: "Redesign landing page",
    project: "Website Redesign",
    assignee: "MK",
    priority: "medium",
    status: "in_progress",
    dueLabel: "Tomorrow",
    overdue: false,
  },
  {
    id: "t3",
    title: "Fix dashboard responsive layout",
    project: "Website Redesign",
    assignee: "RS",
    priority: "high",
    status: "completed",
    dueLabel: "Aug 24",
    overdue: false,
  },
  {
    id: "t4",
    title: "Set up PostgreSQL migrations",
    project: "Backend Migration",
    assignee: "TP",
    priority: "high",
    status: "todo",
    dueLabel: "Overdue",
    overdue: true,
  },
  {
    id: "t5",
    title: "Create mobile navigation",
    project: "Brand Refresh",
    assignee: "MK",
    priority: "low",
    status: "todo",
    dueLabel: "Aug 28",
    overdue: false,
  },
  {
    id: "t6",
    title: "Write API documentation",
    project: "Backend Migration",
    assignee: "JD",
    priority: "low",
    status: "in_progress",
    dueLabel: "Sep 2",
    overdue: false,
  },
  {
    id: "t7",
    title: "Review pull requests",
    project: "Brand Refresh",
    assignee: "RS",
    priority: "medium",
    status: "completed",
    dueLabel: "Aug 22",
    overdue: false,
  },
  {
    id: "t8",
    title: "Update onboarding emails",
    project: "Website Redesign",
    assignee: "TP",
    priority: "medium",
    status: "in_progress",
    dueLabel: "Overdue",
    overdue: true,
  },
];

function Tasks() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState("list");

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const tasks = PREVIEW_EMPTY ? [] : PREVIEW_TASKS;

  return (
    <div className="dash-app">
      <a className="skip-link" href="#tasks-content">
        Skip to content
      </a>

      <DashboardSidebar
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onCreateWorkspace={undefined}
        user={null}
        workspaces={PREVIEW_WORKSPACES}
        selectedId={PREVIEW_WORKSPACES[0].id}
        onSelectWorkspace={undefined}
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
          pageTitle="Tasks"
          sectionLabel="Tasks"
        />

        <main className="dash-content" id="tasks-content">
          <TasksHeader />

          {tasks.length === 0 ? (
            <div className="tk-empty-wrap">
              <EmptyTasksState />
            </div>
          ) : (
            <>
              <TasksSummary summary={PREVIEW_SUMMARY} />

              <TasksToolbar view={view} onViewChange={setView} />

              {view === "list" ? (
                <TasksList tasks={tasks} />
              ) : (
                <TasksBoard tasks={tasks} />
              )}
            </>
          )}

          <footer className="dash-footer">
            <span>ProjectForge</span>
            <span>Workspace · Tasks · © {new Date().getFullYear()}</span>
            <span className="dash-footer-mono">v0.1.0</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default Tasks;