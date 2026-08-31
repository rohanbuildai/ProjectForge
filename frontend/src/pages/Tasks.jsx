import { useEffect, useState } from "react";
import "../components/dashboard/dashboard.css";
import useTasksData from "../components/tasks/useTasksData";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import TasksHeader from "../components/tasks/TasksHeader";
import TasksSummary from "../components/tasks/TasksSummary";
import TasksToolbar from "../components/tasks/TasksToolbar";
import TasksList from "../components/tasks/TasksList";
import TasksBoard from "../components/tasks/TasksBoard";
import TasksEmptyState from "../components/tasks/TasksEmptyState";
import TasksSkeleton from "../components/tasks/TasksSkeleton";
import TaskFormModal from "../components/tasks/TaskFormModal";
import TaskDeleteConfirm from "../components/tasks/TaskDeleteConfirm";
import CreateWorkspaceModal from "../components/dashboard/CreateWorkspaceModal";
import EmptyWorkspaceState from "../components/dashboard/EmptyWorkspaceState";
import DashboardSkeleton from "../components/dashboard/DashboardSkeleton";
import DashboardErrorState from "../components/dashboard/DashboardErrorState";
import "./Tasks.css";

function Tasks() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState("list");
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState("");
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
    tasks,
    totalTasks,
    statistics,
    tasksLoading,
    tasksError,
    loadingMore,
    hasMore,
    loadMore,
    refreshTasks,
    members,
    projects,
    searchTerm,
    setSearchTerm,
    status,
    setStatus,
    priority,
    setPriority,
    assignee,
    setAssignee,
    project,
    setProject,
    sortKey,
    setSortKey,
    filtersActive,
    clearFilters,
    createTask,
    updateTask,
    toggleTaskComplete,
    deleteTask,
    unreadCount,
  } = useTasksData();

  const openCreateWorkspace = () => {
    setMenuOpen(false);
    setCreateWsOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    if (editingTask) {
      await updateTask({
        ...payload,
        projectId: payload.projectId,
        taskId: editingTask.id,
      });
    } else {
      await createTask(payload);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTask) return;
    setDeleteBusy(true);
    setDeleteError("");

    try {
      await deleteTask(deletingTask);
      setDeletingTask(null);
    } catch (error) {
      console.error("Failed to delete task:", error);
      setDeleteError(
        error.response?.data?.message || "Could not delete the task."
      );
    } finally {
      setDeleteBusy(false);
    }
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
    if (!formOpen && !deletingTask && !createWsOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [formOpen, deletingTask, createWsOpen]);

  let pageMain;

  if (bootLoading) {
    pageMain = <DashboardSkeleton />;
  } else if (bootError && workspaces.length === 0) {
    pageMain = <DashboardErrorState onRetry={loadBoot} />;
  } else if (workspaces.length === 0) {
    pageMain = <EmptyWorkspaceState />;
  } else if (tasksLoading || tasks === null) {
    pageMain = <TasksSkeleton />;
  } else if (tasksError) {
    pageMain = <DashboardErrorState onRetry={refreshTasks} />;
  } else {
    const noResults = tasks.length === 0 && filtersActive;

    pageMain = (
      <>
        <TasksHeader
          workspaceName={selectedWorkspace?.name}
          onCreateTask={() => {
            setEditingTask(null);
            setFormOpen(true);
          }}
        />

        <TasksSummary summary={statistics} />

        <TasksToolbar
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          statusValue={status}
          onStatusChange={setStatus}
          priorityValue={priority}
          onPriorityChange={setPriority}
          assigneeValue={assignee}
          onAssigneeChange={setAssignee}
          projectValue={project}
          onProjectChange={setProject}
          sortValue={sortKey}
          onSortChange={setSortKey}
          members={members}
          projects={projects}
          view={view}
          onViewChange={setView}
        />

        {tasks.length === 0 ? (
          noResults ? (
            <TasksEmptyState variant="no-results" onClearFilters={clearFilters} />
          ) : (
            <TasksEmptyState
              onCreateTask={() => {
                setEditingTask(null);
                setFormOpen(true);
              }}
            />
          )
        ) : view === "list" ? (
          <>
            <TasksList
              tasks={tasks}
              onToggleComplete={toggleTaskComplete}
              onEdit={(task) => {
                setEditingTask(task);
                setFormOpen(true);
              }}
              onDelete={setDeletingTask}
            />
            {hasMore && (
              <div className="tk-more-wrap">
                <button
                  type="button"
                  className="pf-btn pf-btn-ghost"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? "Loading…" : "Load more tasks"}
                </button>
                <span className="tk-more-count">
                  {tasks.length} of {totalTasks} tasks
                </span>
              </div>
            )}
          </>
        ) : (
          <TasksBoard
            tasks={tasks}
            onEdit={(task) => {
              setEditingTask(task);
              setFormOpen(true);
            }}
          />
        )}
      </>
    );
  }

  return (
    <div className="dash-app">
      <a className="skip-link" href="#tasks-content">
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
          pageTitle="Tasks"
          sectionLabel="Tasks"
        />

        <main className="dash-content" id="tasks-content">
          {pageMain}

          <footer className="dash-footer">
            <span>ProjectForge</span>
            <span>
              {selectedWorkspace?.name || "Workspace"} · Tasks · ©{" "}
              {new Date().getFullYear()}
            </span>
            <span className="dash-footer-mono">v0.1.0</span>
          </footer>
        </main>
      </div>

      {formOpen && (
        <TaskFormModal
          mode={editingTask ? "edit" : "create"}
          initial={editingTask || {}}
          projects={projects}
          members={members}
          onClose={() => {
            setFormOpen(false);
            setEditingTask(null);
          }}
          onSubmit={handleFormSubmit}
        />
      )}

      {deletingTask && (
        <TaskDeleteConfirm
          task={deletingTask}
          deleting={deleteBusy}
          error={deleteError}
          onConfirm={handleDeleteConfirm}
          onClose={() => {
            setDeletingTask(null);
            setDeleteError("");
          }}
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

export default Tasks;