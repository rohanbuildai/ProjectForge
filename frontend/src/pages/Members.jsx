import { useEffect, useState } from "react";
import "../components/dashboard/dashboard.css";
import useMembersData from "../components/members/useMembersData";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import MembersHeader from "../components/members/MembersHeader";
import MembersStats from "../components/members/MembersStats";
import MembersToolbar from "../components/members/MembersToolbar";
import MembersTable from "../components/members/MembersTable";
import MembersGrid from "../components/members/MembersGrid";
import MembersEmptyState from "../components/members/MembersEmptyState";
import MembersPagination from "../components/members/MembersPagination";
import MembersSkeleton from "../components/members/MembersSkeleton";
import CreateWorkspaceModal from "../components/dashboard/CreateWorkspaceModal";
import EmptyWorkspaceState from "../components/dashboard/EmptyWorkspaceState";
import DashboardSkeleton from "../components/dashboard/DashboardSkeleton";
import DashboardErrorState from "../components/dashboard/DashboardErrorState";
import "./Members.css";

const MEMBERS_PER_PAGE = 10;

function Members() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [createWsOpen, setCreateWsOpen] = useState(false);
  const [view, setView] = useState("list");
  const [page, setPage] = useState(1);

  const {
    user,
    workspaces,
    selectedWorkspace,
    bootLoading,
    bootError,
    loadBoot,
    members,
    totalMembers,
    statistics,
    membersLoading,
    searchTerm,
    setSearchTerm,
    role,
    setRole,
    statusFilter,
    setStatusFilter,
    sortKey,
    setSortKey,
    unreadCount,
  } = useMembersData();

  const openCreateWorkspace = () => {
    setMenuOpen(false);
    setCreateWsOpen(true);
  };

  const totalPages = Math.max(Math.ceil(totalMembers / MEMBERS_PER_PAGE), 1);
  const safePage = Math.min(page, totalPages);
  const pageMembers = members.slice((safePage - 1) * MEMBERS_PER_PAGE, safePage * MEMBERS_PER_PAGE);

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRole("all");
    setStatusFilter("all");
    setSortKey("name");
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

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  let pageMain;

  if (bootLoading) {
    pageMain = <DashboardSkeleton />;
  } else if (bootError && workspaces.length === 0) {
    pageMain = <DashboardErrorState onRetry={loadBoot} />;
  } else if (workspaces.length === 0) {
    pageMain = <EmptyWorkspaceState onCreateWorkspace={openCreateWorkspace} />;
  } else if (membersLoading) {
    pageMain = <MembersSkeleton />;
  } else {
    const noResults = pageMembers.length === 0;

    pageMain = (
      <>
        <MembersHeader workspaceName={selectedWorkspace?.name} />

        <MembersStats stats={statistics} />

        <MembersToolbar
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          roleValue={role}
          onRoleChange={setRole}
          statusValue={statusFilter}
          onStatusChange={setStatusFilter}
          sortValue={sortKey}
          onSortChange={setSortKey}
          view={view}
          onViewChange={setView}
        />

        {noResults ? (
          <div className="mb-empty-wrap">
            <MembersEmptyState variant="no-results" onClearFilters={clearFilters} />
          </div>
        ) : view === "list" ? (
          <>
            <MembersTable members={pageMembers} />
            <MembersPagination
              total={totalMembers}
              perPage={MEMBERS_PER_PAGE}
              page={safePage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <>
            <MembersGrid members={pageMembers} />
            <MembersPagination
              total={totalMembers}
              perPage={MEMBERS_PER_PAGE}
              page={safePage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </>
    );
  }

  return (
    <div className="dash-app">
      <a className="skip-link" href="#members-content">
        Skip to content
      </a>

      <DashboardSidebar
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onCreateWorkspace={openCreateWorkspace}
        user={user}
        workspaces={workspaces}
        selectedId={selectedWorkspace?.id}
        onSelectWorkspace={() => {}}
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
          pageTitle="Members"
          sectionLabel="Members"
        />

        <main className="dash-content" id="members-content">
          {pageMain}

          <footer className="dash-footer">
            <span>ProjectForge</span>
            <span>
              {selectedWorkspace?.name || "Workspace"} · Members · ©{" "}
              {new Date().getFullYear()}
            </span>
            <span className="dash-footer-mono">v0.1.0</span>
          </footer>
        </main>
      </div>

      {createWsOpen && (
        <CreateWorkspaceModal
          onClose={() => setCreateWsOpen(false)}
          onCreated={() => {}}
        />
      )}
    </div>
  );
}

export default Members;