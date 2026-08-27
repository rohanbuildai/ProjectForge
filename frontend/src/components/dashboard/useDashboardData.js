import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import api from "../../api/axios";
import { buildInsights, buildStats } from "./dashboardUtils";

const TASKS_LIMIT = 500;

function useDashboardData() {
  const [user, setUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [dashboard, setDashboard] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [bootLoading, setBootLoading] = useState(true);
  const [bootError, setBootError] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState(false);
  const [tasksError, setTasksError] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [refreshToken, setRefreshToken] = useState(0);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

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
      console.error("Failed to load dashboard boot data:", error);
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

  /* Workspace-scoped data: dashboard + workspace-wide tasks. */
  useEffect(() => {
    if (selectedId == null) return undefined;

    let active = true;
    setDashboardLoading(true);
    setDashboardError(false);
    setTasksError(false);
    setDashboard(null);

    const loadWorkspace = async () => {
      try {
        const dRes = await api.get(`/workspaces/${selectedId}/dashboard`);
        if (active) setDashboard(dRes.data?.dashboard || null);
      } catch (error) {
        console.error(`Failed to load dashboard for workspace ${selectedId}:`, error);
        if (active) setDashboardError(true);
      }

      try {
        const tRes = await api.get(`/workspaces/${selectedId}/tasks`, {
          params: { limit: TASKS_LIMIT },
        });
        if (active) setTasks(tRes.data?.data?.tasks || []);
      } catch (error) {
        console.error(`Failed to load tasks for workspace ${selectedId}:`, error);
        if (active) {
          setTasksError(true);
          setTasks([]);
        }
      }

      if (active) setDashboardLoading(false);
    };

    loadWorkspace();

    return () => {
      active = false;
    };
  }, [selectedId, refreshToken]);

  const selectWorkspace = useCallback((workspaceId) => {
    if (workspaceId == null) return;
    setSelectedId(Number(workspaceId));
  }, []);

  const refreshWorkspaceData = useCallback(() => {
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

  const statistics = dashboard?.statistics || null;
  const recentProjects = dashboard?.recentProjects || [];
  const recentTasks = dashboard?.recentTasks || [];
  const taskActivity = dashboard?.taskActivity || [];
  const recentActivity = dashboard?.recentActivity || [];

  const insights = useMemo(
    () => buildInsights({ tasks }),
    [tasks]
  );

  const stats = useMemo(
    () => buildStats(statistics),
    [statistics]
  );

  return {
    user,
    workspaces,
    selectedId,
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
    recentTasks,
    taskActivity,
    recentActivity,
    tasks,
    insights,
  };
}

export default useDashboardData;