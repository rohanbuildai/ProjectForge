import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import api from "../../api/axios";

/*
 * Real backend-driven data hook for the Members page.
 *
 * Follows the same architecture as useDashboardData / useProjectsData:
 * - Boot: /auth/me + /workspaces/ + unread count
 * - Workspace-scoped data with search/filter/sort/pagination
 * - Stale response guard via `active` flag
 * - Mutation helpers that refresh data after success
 */

const SORT_MAP = {
  name: { sortBy: "name", order: "asc" },
  joined: { sortBy: "joined", order: "desc" },
  role: { sortBy: "role", order: "asc" },
  projects: { sortBy: "projects", order: "desc" },
  tasks: { sortBy: "tasks", order: "desc" },
};

const DEFAULT_LIMIT = 10;

function useMembersData() {
  /* ---- Boot state ------------------------------------------------ */
  const [user, setUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [bootLoading, setBootLoading] = useState(true);
  const [bootError, setBootError] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  /* ---- Members state --------------------------------------------- */
  const [members, setMembers] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: DEFAULT_LIMIT, totalPages: 1 });
  const [statistics, setStatistics] = useState({ total: 0, active: 0, owners: 0, pending: 0 });
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState(false);

  /* ---- Toolbar state --------------------------------------------- */
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [role, setRole] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState("name");
  const [page, setPage] = useState(1);

  /* ---- Internal refs --------------------------------------------- */
  const [refreshToken, setRefreshToken] = useState(0);
  const membersWsRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  /* ---- Debounce search ------------------------------------------- */
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  /* Reset page when filters change */
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, role, statusFilter, sortKey]);

  /* ---- Boot ------------------------------------------------------ */
  const loadBoot = useCallback(async () => {
    setBootLoading(true);
    setBootError(false);

    try {
      const [userRes, wsRes] = await Promise.all([
        api.get("/auth/me"),
        api.get("/workspaces/"),
      ]);

      if (!isMounted.current) return;

      const me = userRes.data?.data || null;
      const wsList = Array.isArray(wsRes.data?.data) ? wsRes.data.data : [];

      setUser(me);
      setWorkspaces(wsList);

      if (wsList.length > 0) {
        setSelectedId((current) => current || wsList[0].id);
      }
    } catch (error) {
      console.error("Failed to load members boot data:", error);
      if (isMounted.current) setBootError(true);
    } finally {
      if (isMounted.current) setBootLoading(false);
    }

    try {
      const nRes = await api.get("/notifications/unread");
      if (!isMounted.current) return;
      setUnreadCount(Number(nRes.data?.data?.unreadCount) || 0);
    } catch (error) {
      console.warn("Failed to load unread notification count:", error);
    }
  }, []);

  useEffect(() => {
    loadBoot();
  }, [loadBoot]);

  /* ---- Workspace-scoped members ---------------------------------- */
  useEffect(() => {
    if (selectedId == null) {
      setMembers([]);
      return undefined;
    }

    let active = true;
    setMembersError(false);

    /* Switching workspace → clear previous data */
    if (selectedId !== membersWsRef.current) {
      setMembers([]);
      setStatistics({ total: 0, active: 0, owners: 0, pending: 0 });
    }

    setMembersLoading(true);

    const { sortBy, order } = SORT_MAP[sortKey] || SORT_MAP.name;

    const params = {
      page,
      limit: DEFAULT_LIMIT,
      sortBy,
      order,
    };
    if (debouncedSearch) params.search = debouncedSearch;
    if (role !== "all") params.role = role;
    if (statusFilter !== "all") params.status = statusFilter;

    const loadMembers = async () => {
      try {
        const res = await api.get(`/workspaces/${selectedId}/members`, { params });

        if (!active) return;

        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        setMembers(data);
        membersWsRef.current = selectedId;

        if (res.data?.pagination) {
          setPagination(res.data.pagination);
        }
        if (res.data?.statistics) {
          setStatistics(res.data.statistics);
        }
        if (res.data?.currentUserRole) {
          setCurrentUserRole(res.data.currentUserRole);
        }
      } catch (error) {
        console.error(`Failed to load members for workspace ${selectedId}:`, error);
        if (active) {
          setMembersError(true);
          setMembers([]);
          membersWsRef.current = selectedId;
        }
      } finally {
        if (active) setMembersLoading(false);
      }
    };

    loadMembers();

    return () => {
      active = false;
    };
  }, [selectedId, debouncedSearch, role, statusFilter, sortKey, page, refreshToken]);

  /* ---- Workspace selection --------------------------------------- */
  const selectWorkspace = useCallback((workspaceId) => {
    if (workspaceId == null) return;
    setSelectedId(Number(workspaceId));
    setPage(1);
  }, []);

  const handleWorkspaceCreated = useCallback(
    async (workspace) => {
      try {
        const wsRes = await api.get("/workspaces/");
        if (!isMounted.current) return;
        const wsList = Array.isArray(wsRes.data?.data) ? wsRes.data.data : [];
        setWorkspaces(wsList);

        const created = workspace?.id
          ? workspace.id
          : wsList.find((ws) => ws.name === workspace?.name)?.id;

        setSelectedId(Number(created) || wsList[0]?.id);
      } catch (error) {
        console.error("Failed to refresh workspace list after creation:", error);
      }
    },
    []
  );

  const selectedWorkspace = useMemo(
    () =>
      workspaces.find((ws) => Number(ws.id) === Number(selectedId)) ||
      workspaces[0] ||
      null,
    [workspaces, selectedId]
  );

  /* ---- Refresh helper -------------------------------------------- */
  const refreshMembers = useCallback(() => {
    setRefreshToken((t) => t + 1);
  }, []);

  /* ---- Mutation: invite member ----------------------------------- */
  const inviteMember = useCallback(
    async ({ email, role: invRole }) => {
      if (!selectedId) throw new Error("No workspace selected");

      const res = await api.post(`/workspaces/${selectedId}/invitations`, {
        email,
        role: invRole,
      });

      refreshMembers();
      return res.data;
    },
    [selectedId, refreshMembers]
  );

  /* ---- Mutation: change member role ------------------------------ */
  const updateRole = useCallback(
    async ({ memberId, role: newRole }) => {
      if (!selectedId) throw new Error("No workspace selected");

      const res = await api.patch(
        `/workspaces/${selectedId}/members/${memberId}`,
        { role: newRole }
      );

      refreshMembers();
      return res.data;
    },
    [selectedId, refreshMembers]
  );

  /* ---- Mutation: remove member ----------------------------------- */
  const removeMember = useCallback(
    async ({ memberId }) => {
      if (!selectedId) throw new Error("No workspace selected");

      const res = await api.delete(
        `/workspaces/${selectedId}/members/${memberId}`
      );

      refreshMembers();
      return res.data;
    },
    [selectedId, refreshMembers]
  );

  /* ---- Computed -------------------------------------------------- */
  const totalMembers = pagination.total;
  const totalPages = pagination.totalPages;

  return {
    /* Boot */
    user,
    workspaces,
    selectedWorkspace,
    selectWorkspace,
    handleWorkspaceCreated,
    bootLoading,
    bootError,
    loadBoot,

    /* Members */
    members,
    totalMembers,
    statistics,
    currentUserRole,
    membersLoading,
    membersError,
    refreshMembers,

    /* Toolbar state */
    searchTerm,
    setSearchTerm,
    role,
    setRole,
    statusFilter,
    setStatusFilter,
    sortKey,
    setSortKey,

    /* Pagination */
    page,
    setPage,
    totalPages,

    /* Mutations */
    inviteMember,
    updateRole,
    removeMember,

    /* Notifications */
    unreadCount,
  };
}

export default useMembersData;