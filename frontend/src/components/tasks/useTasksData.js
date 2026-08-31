import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import api from "../../api/axios";

const PAGE_SIZE = 50;

/* UI sort keys mapped to backend sort params. */
const SORT_MAP = {
  updated: { sortBy: "updated_at", order: "desc" },
  created: { sortBy: "created_at", order: "desc" },
  due: { sortBy: "due_date", order: "asc" },
  priority: { sortBy: "priority", order: "desc" },
  title: { sortBy: "title", order: "asc" },
};

const EMPTY_STATS = {
  total: 0,
  todo: 0,
  in_progress: 0,
  completed: 0,
  overdue: 0,
};

function buildParams({ debouncedSearch, status, priority, assignee, project, sortKey, page }) {
  const { sortBy, order } = SORT_MAP[sortKey] || SORT_MAP.updated;

  const params = { page, limit: PAGE_SIZE, sortBy, order };
  if (debouncedSearch) params.search = debouncedSearch;
  if (status !== "all") params.status = status;
  if (priority !== "all") params.priority = priority;
  if (assignee !== "all") params.assignedTo = assignee;
  if (project !== "all") params.project = project;

  return params;
}

function useTasksData() {
  const [user, setUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  /* null = not loaded for the active workspace; [] = loaded, zero rows. */
  const [tasks, setTasks] = useState(null);
  const [totalTasks, setTotalTasks] = useState(0);
  const [statistics, setStatistics] = useState(EMPTY_STATS);

  /* Filter option sources (real, workspace-scoped). */
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);

  const [bootLoading, setBootLoading] = useState(true);
  const [bootError, setBootError] = useState(false);
  const [tasksError, setTasksError] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  /* Toolbar state. */
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [assignee, setAssignee] = useState("all");
  const [project, setProject] = useState("all");
  const [sortKey, setSortKey] = useState("updated");

  const [page, setPage] = useState(1);
  const [refreshToken, setRefreshToken] = useState(0);
  const tasksWsRef = useRef(null);
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
      console.error("Failed to load tasks boot data:", error);
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

  /* Workspace-scoped: options (members/projects) + tasks page 1. */
  useEffect(() => {
    if (selectedId == null) {
      setTasks(null);
      return undefined;
    }

    let active = true;

    /* Switching workspace → reset everything so we never show another
       workspace's data, even briefly. */
    if (selectedId !== tasksWsRef.current) {
      setTasks(null);
      setPage(1);
      setMembers([]);
      setProjects([]);
    }

    setTasksError(false);

    const loadOptions = async () => {
      try {
        const [membersRes, projectsRes] = await Promise.all([
          api.get(`/workspaces/${selectedId}/members`),
          api.get(`/workspaces/${selectedId}/projects`),
        ]);

        if (!active) return;

        setMembers(Array.isArray(membersRes.data?.data) ? membersRes.data.data : []);
        setProjects(Array.isArray(projectsRes.data?.data) ? projectsRes.data.data : []);
      } catch (error) {
        console.error(`Failed to load task options for workspace ${selectedId}:`, error);
      }
    };

    loadOptions();

    return () => {
      active = false;
    };
  }, [selectedId]);

  /* Tasks fetch — server-side search/filter/sort + pagination. */
  useEffect(() => {
    if (selectedId == null) return undefined;

    let active = true;
    setTasksError(false);

    const loadTasks = async () => {
      try {
        const res = await api.get(`/workspaces/${selectedId}/tasks`, {
          params: buildParams({
            debouncedSearch,
            status,
            priority,
            assignee,
            project,
            sortKey,
            page,
          }),
        });

        if (!active) return;

        const data = res.data?.data || {};
        const nextTasks = Array.isArray(data.tasks) ? data.tasks : [];

        setTasks((current) => {
          if (page === 1 || current === null) return nextTasks;
          const known = new Set((current || []).map((task) => task.id));
          return [...current, ...nextTasks.filter((task) => !known.has(task.id))];
        });
        setTotalTasks(Number(data.totalTasks) || nextTasks.length);
        setStatistics(data.statistics || EMPTY_STATS);
        setLoadingMore(false);
        tasksWsRef.current = selectedId;
      } catch (error) {
        console.error(
          `Failed to load tasks for workspace ${selectedId}:`,
          error
        );
        if (active) {
          setTasksError(true);
          setTasks([]);
          tasksWsRef.current = selectedId;
          setLoadingMore(false);
        }
      }
    };

    loadTasks();

    return () => {
      active = false;
    };
  }, [selectedId, debouncedSearch, status, priority, assignee, project, sortKey, page, refreshToken]);

  const selectWorkspace = useCallback((workspaceId) => {
    if (workspaceId == null) return;
    setSelectedId(Number(workspaceId));
  }, []);

  const refreshTasks = useCallback(() => {
    setPage(1);
    setRefreshToken((token) => token + 1);
  }, []);

  const loadMore = useCallback(() => {
    setPage((current) => current + 1);
    setLoadingMore(true);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setStatus("all");
    setPriority("all");
    setAssignee("all");
    setProject("all");
    setSortKey("updated");
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

  /* ---- Mutations ------------------------------------------------ */

  const createTask = useCallback(
    async ({ projectId, title, description, priority: taskPriority, status: taskStatus, dueDate, assignedTo }) => {
      const res = await api.post(
        `/workspaces/${selectedId}/projects/${projectId}/tasks`,
        {
          title,
          description,
          priority: taskPriority,
          status: taskStatus,
          dueDate,
          assignedTo,
        }
      );
      refreshTasks();
      return res.data;
    },
    [selectedId, refreshTasks]
  );

  const updateTask = useCallback(
    async ({ projectId, taskId, title, description, priority: taskPriority, status: taskStatus, dueDate, assignedTo }) => {
      const res = await api.put(
        `/workspaces/${selectedId}/projects/${projectId}/tasks/${taskId}`,
        {
          title,
          description,
          priority: taskPriority,
          status: taskStatus,
          dueDate,
          assignedTo,
        }
      );
      refreshTasks();
      return res.data;
    },
    [selectedId, refreshTasks]
  );

  const toggleTaskComplete = useCallback(
    async (task, completed) => {
      await api.put(
        `/workspaces/${selectedId}/projects/${task.project_id}/tasks/${task.id}`,
        { status: completed ? "completed" : "todo" }
      );
      refreshTasks();
    },
    [selectedId, refreshTasks]
  );

  const deleteTask = useCallback(
    async (task) => {
      await api.delete(
        `/workspaces/${selectedId}/projects/${task.project_id}/tasks/${task.id}`
      );
      refreshTasks();
    },
    [selectedId, refreshTasks]
  );

  const selectedWorkspace = useMemo(
    () =>
      workspaces.find((ws) => Number(ws.id) === Number(selectedId)) ||
      workspaces[0] ||
      null,
    [workspaces, selectedId]
  );

  const tasksLoading =
    !bootLoading &&
    selectedId != null &&
    tasks === null &&
    !tasksError;

  const hasMore = !tasksLoading && tasks !== null && totalTasks > tasks.length;

  const filtersActive =
    debouncedSearch.length > 0 ||
    status !== "all" ||
    priority !== "all" ||
    assignee !== "all" ||
    project !== "all" ||
    sortKey !== "updated";

  return {
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
  };
}

export default useTasksData;