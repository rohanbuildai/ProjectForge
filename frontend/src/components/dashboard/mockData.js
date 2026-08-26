/* Static visual mock data for the dashboard UI.
   Replace these with real backend values when the API is wired up. */

export const CURRENT_USER = {
  name: "Rohan",
  initials: "R",
  hue: "#7c6cff",
  role: "Personal account",
};

export const MEMBERS = {
  R: { ini: "R", hue: "#7c6cff" },
  N: { ini: "N", hue: "#22d3ee" },
  A: { ini: "A", hue: "#f472b6" },
  M: { ini: "M", hue: "#4ade80" },
  V: { ini: "V", hue: "#fbbf24" },
  D: { ini: "D", hue: "#60a5fa" },
};

export const STATS = [
  { label: "Total Projects", value: "12", icon: "folder", tone: "violet", note: "+1 this week" },
  { label: "Total Tasks", value: "48", icon: "task", tone: "cyan", note: "+5 since Monday" },
  { label: "Completed", value: "31", icon: "check", tone: "green", note: "+4 this week" },
  { label: "In Progress", value: "9", icon: "activity", tone: "amber", note: "3 assigned to you" },
  { label: "Overdue", value: "3", icon: "alert", tone: "rose", note: "Needs attention" },
];

export const AI_INSIGHTS = [
  {
    icon: "clock",
    tone: "amber",
    title: "Deadline risk",
    text: "8 tasks are due within the next 48 hours.",
    action: "Review deadlines",
  },
  {
    icon: "target",
    tone: "rose",
    title: "Potential bottleneck",
    text: "4 tasks in Website Redesign depend on one unfinished task.",
    action: "View project",
  },
  {
    icon: "users",
    tone: "cyan",
    title: "Team workload",
    text: "One team member has significantly more assigned work than the team average.",
    action: "Review workload",
  },
];

export const AI_SUGGESTIONS = [
  "Summarize this sprint",
  "Which tasks are at risk?",
  "Plan tomorrow's priorities",
];

export const PROJECTS = [
  {
    name: "Website Redesign",
    description: "Refresh the public marketing site and improve the signup journey.",
    progress: 78,
    tasks: 14,
    members: ["R", "N", "A", "M"],
    extra: 2,
    status: "On track",
    tone: "green",
    mark: "#7c6cff",
  },
  {
    name: "Mobile App",
    description: "Ship v2.0 with offline support and a rebuilt task composer.",
    progress: 45,
    tasks: 21,
    members: ["A", "M", "V", "D", "N"],
    extra: 3,
    status: "At risk",
    tone: "amber",
    mark: "#22d3ee",
  },
  {
    name: "Backend Platform",
    description: "Service accounts, rate limiting and expanded audit logging.",
    progress: 32,
    tasks: 9,
    members: ["D", "R"],
    extra: 1,
    status: "On hold",
    tone: "neutral",
    mark: "#f472b6",
  },
];

export const MY_TASKS = [
  {
    title: "Fix authentication bug",
    project: "ProjectForge",
    projectHue: "#7c6cff",
    priority: "HIGH",
    due: "Today",
    okay: "overdue",
  },
  {
    title: "Dashboard design",
    project: "ProjectForge",
    projectHue: "#7c6cff",
    priority: "MEDIUM",
    due: "Tomorrow",
    okay: "soon",
  },
  {
    title: "Review API architecture",
    project: "Backend",
    projectHue: "#f472b6",
    priority: "LOW",
    due: "Aug 30",
    okay: "later",
  },
  {
    title: "Write onboarding docs",
    project: "Docs",
    projectHue: "#22d3ee",
    priority: "MEDIUM",
    due: "Tomorrow",
    okay: "soon",
  },
  {
    title: "Migrate legacy invoice exporter",
    project: "Backend",
    projectHue: "#f472b6",
    priority: "LOW",
    due: "Sep 02",
    okay: "later",
  },
];

export const DEADLINES = [
  {
    group: "Overdue",
    tone: "rose",
    items: [
      { title: "Fix production login slowness", meta: "ProjectForge · 2 days late" },
      { title: "Ship billing email templates", meta: "Website Redesign · 1 day late" },
    ],
  },
  {
    group: "Today",
    tone: "amber",
    items: [{ title: "Fix authentication bug", meta: "ProjectForge · 6:00 PM" }],
  },
  {
    group: "Tomorrow",
    tone: "blue",
    items: [
      { title: "Dashboard implementation", meta: "ProjectForge · 4:00 PM" },
      { title: "Prepare onboarding walkthrough", meta: "Website Redesign · 12:00 PM" },
    ],
  },
  {
    group: "Aug 30",
    tone: "neutral",
    items: [{ title: "API documentation", meta: "Backend Platform · 2:00 PM" }],
  },
];

export const TASK_ACTIVITY = [
  { day: "Mon", value: 28 },
  { day: "Tue", value: 44 },
  { day: "Wed", value: 62, today: true },
  { day: "Thu", value: 51 },
  { day: "Fri", value: 68 },
  { day: "Sat", value: 22 },
  { day: "Sun", value: 14 },
];

export const ACTIVITIES = [
  { actor: "Rohan", verb: "created", target: "ProjectForge", time: "12 minutes ago", initials: "R", hue: "#7c6cff", tone: "violet" },
  { actor: "Neel", verb: "completed", target: "Authentication flow", time: "38 minutes ago", initials: "N", hue: "#22d3ee", tone: "green" },
  { actor: "Rohan", verb: "commented on", target: "Dashboard design", time: "1 hour ago", initials: "R", hue: "#7c6cff", tone: "cyan" },
  { actor: "Mira", verb: "uploaded", target: "api-spec.pdf", time: "3 hours ago", initials: "M", hue: "#4ade80", tone: "blue" },
  { actor: null, system: true, verb: "updated", target: "Workspace roles & settings", time: "5 hours ago", initials: null, hue: null, tone: "amber" },
];