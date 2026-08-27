/* Shared pure helpers for the dynamic dashboard. */

const AVATAR_PALETTE = [
  "#7c6cff",
  "#22d3ee",
  "#f472b6",
  "#4ade80",
  "#fbbf24",
  "#60a5fa",
  "#a78bfa",
  "#2dd4bf",
];

function hashString(str = "") {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getHue(name) {
  if (!name) return AVATAR_PALETTE[0];
  return AVATAR_PALETTE[hashString(name) % AVATAR_PALETTE.length];
}

export function getInitials(name) {
  if (!name || !name.trim()) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

/* Normalize any date-ish value (JS Date, ISO, "YYYY-MM-DD") to "YYYY-MM-DD". */
export function toDateKey(value) {
  if (!value) return null;
  return String(value).slice(0, 10);
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/* Whole days between the given date key and today (negative = past). */
export function diffDays(dateKey) {
  const key = toDateKey(dateKey);
  if (!key) return null;
  const ms = parseDateKey(key) - startOfToday();
  return Math.round(ms / 86400000);
}

export function relativeDayLabel(dateKey) {
  const key = toDateKey(dateKey);
  if (!key) return "No date";
  const diff = diffDays(key);
  if (diff === -1) return "Yesterday";
  if (diff < 0) return "Overdue";
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return formatShortDate(key);
}

export function formatShortDate(dateKey) {
  const key = toDateKey(dateKey);
  if (!key) return "";
  return parseDateKey(key).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatMediumDate(dateKey) {
  const key = toDateKey(dateKey);
  if (!key) return "";
  return parseDateKey(key).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatLongDate(value) {
  const now = new Date(value || Date.now());
  return now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function timeAgo(value) {
  if (!value) return "";
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.floor(diffMs / 60000));

  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return formatShortDate(toDateKey(value));
}

export function roleLabel(role) {
  const map = { OWNER: "Owner", ADMIN: "Admin", MEMBER: "Member" };
  return map[role] || role || "Member";
}

export function priorityLabel(priority) {
  const map = { high: "High", medium: "Medium", low: "Low" };
  return map[priority] || "Medium";
}

/* ---- Insight computation (real data, no fake numbers) --------- */

export function buildInsights({ tasks = [] }) {
  const openTasks = tasks.filter((task) => task.status !== "completed");
  const insights = [];

  const soon = openTasks.filter((task) => {
    const diff = diffDays(task.due_date);
    return diff !== null && diff >= 0 && diff <= 2;
  });

  if (soon.length > 0) {
    insights.push({
      tone: "amber",
      icon: "clock",
      title: "Deadline risk",
      text: `${soon.length} task${soon.length === 1 ? "" : "s"} are due within the next 48 hours.`,
      action: "Review deadlines",
    });
  }

  const unassignedHigh = openTasks.filter(
    (task) => task.priority === "high" && !task.assigned_to
  );

  if (unassignedHigh.length > 0) {
    insights.push({
      tone: "rose",
      icon: "target",
      title: "Unassigned work",
      text: `${unassignedHigh.length} high-priority task${unassignedHigh.length === 1 ? "" : "s"} are not assigned yet.`,
      action: "Assign tasks",
    });
  }

  const assigneeCounts = {};
  for (const task of tasks) {
    if (!task.assigned_to) continue;
    const key = String(task.assigned_to);
    assigneeCounts[key] = (assigneeCounts[key] || 0) + 1;
  }

  const counts = Object.values(assigneeCounts);
  if (counts.length > 0) {
    const sum = counts.reduce((total, count) => total + count, 0);
    const average = sum / counts.length;
    const overloaded = counts.filter(
      (count) => count > Math.max(average * 1.5, 2)
    );

    if (overloaded.length > 0) {
      insights.push({
        tone: "cyan",
        icon: "users",
        title: "Team workload",
        text: `${overloaded.length} team member${overloaded.length === 1 ? "" : "s"} have significantly more assigned work than the team average.`,
        action: "Review workload",
      });
    }
  }

  if (insights.length === 0) {
    insights.push({
      tone: "green",
      icon: "check",
      title: "All clear",
      text: "No deadlines, unassigned work, or overloaded teammates need attention right now.",
      action: "Review tasks",
    });
  }

  return insights;
}

/* ---- Stat snapshot rows (values are real, notes are contextual) */

export function buildStats(statistics = {}) {
  const {
    totalProjects = 0,
    totalTasks = 0,
    completedTasks = 0,
    inProgressTasks = 0,
    overdueTasks = 0,
    completionPercentage = 0,
  } = statistics || {};

  return [
    {
      label: "Total Projects",
      value: totalProjects,
      icon: "folder",
      tone: "violet",
      note: totalProjects === 0 ? "None yet" : "Across workspace",
    },
    {
      label: "Total Tasks",
      value: totalTasks,
      icon: "task",
      tone: "cyan",
      note: totalTasks === 0 ? "None yet" : "All statuses",
    },
    {
      label: "Completed",
      value: completedTasks,
      icon: "check",
      tone: "green",
      note: `${completionPercentage}% complete`,
    },
    {
      label: "In Progress",
      value: inProgressTasks,
      icon: "activity",
      tone: "amber",
      note: inProgressTasks === 0 ? "All clear" : "In flight",
    },
    {
      label: "Overdue",
      value: overdueTasks,
      icon: "alert",
      tone: "rose",
      note: overdueTasks === 0 ? "All on time" : "Needs attention",
    },
  ];
}
