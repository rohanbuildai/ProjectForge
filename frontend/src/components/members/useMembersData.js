import { useMemo, useState } from "react";

/*
 * UI-only local presentation data for the Members page.
 *
 * This hook intentionally does NOT touch the backend. It mirrors the
 * shape of the real data hooks (useTasksData / useProjectsData) so the
 * page can be wired to real API data later without restructuring components.
 */

const MOCK_USER = {
  id: 1,
  name: "Rohan Kumar",
  email: "rohan@gmail.com",
  role: "OWNER",
};

const MOCK_WORKSPACES = [
  {
    id: 1,
    name: "Nexus Labs",
    description: "Product & engineering",
    role: "OWNER",
  },
  {
    id: 2,
    name: "Aurora Studio",
    description: "Design systems",
    role: "ADMIN",
  },
  {
    id: 3,
    name: "Orbit Ops",
    description: "Operations",
    role: "MEMBER",
  },
];

const MEMBERS = [
  {
    id: 1,
    name: "Rohan Kumar",
    email: "rohan@gmail.com",
    role: "owner",
    projects: 8,
    tasks: 14,
    status: "active",
    joined: "2026-08-12",
    peers: ["Aarav Shah", "Itisha Narang"],
  },
  {
    id:2,
    name: "Aisha Kapoor",
    email: "aisha.kapoor@gmail.com",
    role: "owner",
    projects: 12,
    tasks: 21,
    status: "active",
    joined: "2026-03-02",
    peers: ["Rohan Kumar", "Sneha Iyer"],
  },
  {
    id:3,
    name: "Aarav Shah",
    email: "aarav.shah@gmail.com",
    role: "admin",
    projects: 9,
    tasks: 18,
    status: "active",
    joined: "2026-04-18",
    peers: ["Rohan Kumar", "Itisha Narang", "Dev Patel"],
  },
  {
    id:4,
    name: "Itisha Narang",
    email: "itisha.narang@gmail.com",
    role: "admin",
    projects: 11,
    tasks: 9,
    status: "active",
    joined: "2026-05-09",
    peers: ["Aarav Shah", "Dev Patel"],
  },
  {
    id:5,
    name: "Priyanka Verma",
    email: "priyanka.verma@gmail.com",
    role: "member",
    projects: 6,
    tasks: 12,
    status: "active",
    joined: "2026-06-21",
    peers: ["Itisha Narang", "Kabir Mehta"],
  },
  {
    id:6,
    name: "Kabir Mehta",
    email: "kabir.mehta@gmail.com",
    role: "member",
    projects: 4,
    tasks: 7,
    status: "active",
    joined: "2026-06-30",
    peers: ["Priyanka Verma", "Sneha Iyer"],
  },
  {
    id:7,
    name: "Sneha Iyer",
    email: "sneha.iyer@gmail.com",
    role: "member",
    projects: 7,
    tasks: 11,
    status: "active",
    joined: "2026-07-02",
    peers: ["Aarav Shah", "Kabir Mehta", "Meera Joshi"],
  },
  {
    id:8,
    name: "Arjun Nanda",
    email: "arjun.nanda@gmail.com",
    role: "member",
    projects: 5,
    tasks: 6,
    status: "active",
    joined: "2026-07-14",
    peers: ["Sneha Iyer", "Dev Patel"],
  },
  {
    id:9,
    name: "Meera Joshi",
    email: "meera.joshi@gmail.com",
    role: "member",
    projects: 3,
    tasks: 8,
    status: "active",
    joined: "2026-07-25",
    peers: ["Arjun Nanda", "Priyanka Verma"],
  },
  {
    id:10,
    name: "Dev Patel",
    email: "dev.patel@gmail.com",
    role: "member",
    projects: 10,
    tasks: 16,
    status: "active",
    joined: "2026-08-01",
    peers: ["Aarav Shah", "Meera Joshi"],
  },
  {
    id:11,
    name: "Farhan Ali",
    email: "farhan.ali@gmail.com",
    role: "member",
    projects: 0,
    tasks: 0,
    status: "pending",
    joined: "2026-08-28",
    peers: ["Zoya Malik"],
  },
  {
    id:12,
    name: "Zoya Malik",
    email: "zoya.malik@gmail.com",
    role: "member",
    projects: 0,
    tasks: 0,
    status: "pending",
    joined: "2026-08-30",
    peers: ["Farhan Ali"],
  },
];

function useMembersData() {
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState("name");

  const selectedWorkspace = useMemo(
    () => MOCK_WORKSPACES[0],
    []
  );

  /* Stat totals computed from the local presentation data only. */
  const statistics = useMemo(() => {
    const active = MEMBERS.filter((member) => member.status === "active").length;
    const owners = MEMBERS.filter((member) => member.role === "owner").length;
    const pending = MEMBERS.filter((member) => member.status === "pending").length;

    return {
      total: MEMBERS.length,
      active,
      owners,
      pending,
    };
  }, []);

  return {
    user: MOCK_USER,
    workspaces: MOCK_WORKSPACES,
    selectedWorkspace,

    bootLoading: false,
    bootError: false,
    loadBoot: () => {},

    members: MEMBERS,
    totalMembers: MEMBERS.length,
    statistics,
    membersLoading: false,

    searchTerm,
    setSearchTerm,
    role,
    setRole,
    statusFilter,
    setStatusFilter,
    sortKey,
    setSortKey,

    selectWorkspace: () => {},
    handleWorkspaceCreated: () => {},

    unreadCount: 0,
  };
}

export default useMembersData;