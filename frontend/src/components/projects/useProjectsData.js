import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import api from "../../api/axios";

/* UI sort options mapped to backend sort fields/orders. */
const SORT_MAP = {
  updated: { sortBy: "updated_at", order: "desc" },
  created: { sortBy: "created_at", order: "desc" },
  name: { sortBy: "title", order: "asc" },
  progress: { sortBy: "progress", order: "desc" },
};

function useProjectsData() {
  const [user, setUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  /* null = never loaded for the active workspace; [] = loaded, zero rows. */
  const [projects, setProjects] = useState(null);
  const [statistics, setStatistics] = useState({
    total: 0,
    active: 0,
    in_progress: 0,
    completed: 0,
    archived: 0,
  });

  const [bootLoading, setBootLoading] = useState(true);
  const [bootError, setBootError] = useState(false);
  const [projectsError, setProjectsError] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  /* Toolbar state — server-side search/filter/sort. */
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sortKey, setSortKey] = useState("updated");

  const [refreshToken, setRefreshToken] = useState(0);
  const projectsWsRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  /* Debounce the search input before hitting the API. */
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  /* Boot: current user + all workspaces + unread count, once. */
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
      console.error("Failed to load projects boot data:", error);
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

  /* Workspace-scoped projects: search/filter/sort are server-side. */
  useEffect(() => {
    if (selectedId == null) {
      setProjects(null);
      return undefined;
    }

    let active = true;
    setProjectsError(false);

    /* Switching workspace → reset list so we never show another
       workspace's projects, even briefly. */
    if (selectedId !== projectsWsRef.current) {
      setProjects(null);
    }

    const { sortBy, order } = SORT_MAP[sortKey] || SORT_MAP.updated;

    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (status !== "all") params.status = status;
    params.sortBy = sortBy;
    params.order = order;

    const loadProjects = async () => {
      try {
        const res = await api.get(`/workspaces/${selectedId}/projects`, {
          params,
        });

        if (!active) return;

        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        setProjects(data);
        projectsWsRef.current = selectedId;
        setStatistics(
          res.data?.statistics || {
            total: data.length,
            active: 0,
            in_progress: 0,
            completed: 0,
            archived: 0,
          }
        );
      } catch (error) {
        console.error(
          `Failed to load projects for workspace ${selectedId}:`,
          error
        );
        if (active) {
          setProjectsError(true);
          setProjects([]);
          projectsWsRef.current = selectedId;
        }
      }
    };

    loadProjects();

    return () => {
      active = false;
    };
  }, [selectedId, debouncedSearch, status, sortKey, refreshToken]);

  const selectWorkspace = useCallback((workspaceId) => {
    if (workspaceId == null) return;
    setSelectedId(Number(workspaceId));
  }, []);

  const refreshProjects = useCallback(() => {
    setRefreshToken((token) => token + 1);
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

  const projectsLoading =
    !bootLoading &&
    selectedId != null &&
    projects === null &&
    !projectsError;

  /* True when any toolbar control differs from its default. */
  const filtersActive =
    debouncedSearch.length > 0 || status !== "all" || sortKey !== "updated";

  return {
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
  };
}

export default useProjectsData;