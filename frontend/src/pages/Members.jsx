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
import InviteMemberModal from "../components/members/InviteMemberModal";
import ChangeRoleModal from "../components/members/ChangeRoleModal";
import RemoveMemberConfirm from "../components/members/RemoveMemberConfirm";
import "./Members.css";

function Members() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [createWsOpen, setCreateWsOpen] = useState(false);
  const [view, setView] = useState("list");

  /* Modal state */
  const [inviteOpen, setInviteOpen] = useState(false);
  const [roleTarget, setRoleTarget] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);

  const {
    user,
    workspaces,
    selectedWorkspace,
    selectWorkspace,
    handleWorkspaceCreated,
    bootLoading,
    bootError,
    loadBoot,

    members,
    totalMembers,
    statistics,
    currentUserRole,
    membersLoading,
    membersError,

    searchTerm,
    setSearchTerm,
    role,
    setRole,
    statusFilter,
    setStatusFilter,
    sortKey,
    setSortKey,

    page,
    setPage,
    totalPages,

    inviteMember,
    updateRole,
    removeMember,
    refreshMembers,

    unreadCount,
  } = useMembersData();

  const openCreateWorkspace = () => {
    setMenuOpen(false);
    setCreateWsOpen(true);
  };

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

  /* Escape to close mobile menu */
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  /* Lock body scroll when modals are open */
  useEffect(() => {
    const anyModal = createWsOpen || inviteOpen || roleTarget || removeTarget;
    if (!anyModal) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [createWsOpen, inviteOpen, roleTarget, removeTarget]);

  /* Member action callbacks */
  const canManage = currentUserRole === "OWNER";

  const handleChangeRole = (member) => {
    setRoleTarget(member);
  };

  const handleRemoveMember = (member) => {
    setRemoveTarget(member);
  };

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
    const noResults = members.length === 0;

    pageMain = (
      <>
        <MembersHeader
          workspaceName={selectedWorkspace?.name}
          onInvite={() => setInviteOpen(true)}
          canInvite={canManage}
        />

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
            <MembersEmptyState
              variant="no-results"
              onClearFilters={clearFilters}
              onInvite={() => setInviteOpen(true)}
              canInvite={canManage}
            />
          </div>
        ) : view === "list" ? (
          <>
            <MembersTable
              members={members}
              currentUserRole={currentUserRole}
              onChangeRole={handleChangeRole}
              onRemove={handleRemoveMember}
            />
            <MembersPagination
              total={totalMembers}
              perPage={10}
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <>
            <MembersGrid
              members={members}
              currentUserRole={currentUserRole}
              onChangeRole={handleChangeRole}
              onRemove={handleRemoveMember}
            />
            <MembersPagination
              total={totalMembers}
              perPage={10}
              page={page}
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
          onCreated={handleWorkspaceCreated}
        />
      )}

      {inviteOpen && (
        <InviteMemberModal
          onClose={() => setInviteOpen(false)}
          onSubmit={inviteMember}
        />
      )}

      {roleTarget && (
        <ChangeRoleModal
          member={roleTarget}
          onClose={() => setRoleTarget(null)}
          onSubmit={updateRole}
        />
      )}

      {removeTarget && (
        <RemoveMemberConfirm
          member={removeTarget}
          onClose={() => setRemoveTarget(null)}
          onConfirm={removeMember}
        />
      )}
    </div>
  );
}

export default Members;