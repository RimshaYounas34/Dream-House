import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* =========================================================
   ICON
========================================================= */

const Icon = ({ name, size = 18 }) => {
  const paths = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),

    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
      </>
    ),

    plan: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M8 4v16M16 4v16M3 10h5M16 14h5" />
      </>
    ),

    template: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 9v12" />
      </>
    ),

    ai: (
      <>
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
        <path d="m5.6 5.6 2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
        <circle cx="12" cy="12" r="4" />
      </>
    ),

    report: (
      <>
        <path d="M4 19V5" />
        <path d="M4 5h12l-2 3 2 3H4" />
        <path d="M8 15v4M12 13v6M16 11v8" />
      </>
    ),

    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 2-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V20h-3v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-2-2 .1-.1A1.7 1.7 0 0 0 7.2 15a1.7 1.7 0 0 0-1.6-1H5v-3h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2-2 .1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V5h3v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 2 2-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v3h-.2a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),

    home: (
      <>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9 21v-6h6v6" />
      </>
    ),

    logout: (
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M21 3v18" />
      </>
    ),

    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),

    filter: (
      <>
        <path d="M4 6h16M7 12h10M10 18h4" />
      </>
    ),

    more: (
      <>
        <circle cx="5" cy="12" r="1" fill="currentColor" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <circle cx="19" cy="12" r="1" fill="currentColor" />
      </>
    ),

    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),

    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </>
    ),

    ban: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m5.5 5.5 13 13" />
      </>
    ),

    trash: (
      <>
        <path d="M4 7h16M10 11v6M14 11v6" />
        <path d="M6 7l1 13h10l1-13" />
        <path d="M9 7V4h6v3" />
      </>
    ),

    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),

    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
};

/* =========================================================
   SIDEBAR
========================================================= */

function AdminSidebar({ navigate, active, logout }) {
  const menu = [
    { label: "Dashboard", icon: "grid", path: "/admin" },
    { label: "Users", icon: "users", path: "/admin/users" },
    { label: "Projects", icon: "plan", path: "/admin/projects" },
    { label: "Templates", icon: "template", path: "/templates" },
    { label: "AI Usage", icon: "ai", path: "/admin/ai-usage" },
    { label: "Reports", icon: "report", path: "/admin/reports" },
    { label: "Settings", icon: "settings", path: "/settings" },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[245px] flex-col bg-[#092f27] text-white lg:flex">
      <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-7">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf2e9] text-[#123d32]">
          <span className="text-xl">⌂</span>
        </div>

        <div>
          <div className="font-serif text-[17px] font-semibold">
            DreamHouse
          </div>

          <div className="text-[8px] uppercase tracking-[3px] text-white/45">
            Admin
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-7">
        <div className="mb-3 px-3 text-[9px] uppercase tracking-[2px] text-white/35">
          Administration
        </div>

        <div className="space-y-1.5">
          {menu.map((item) => {
            const isActive = active === item.path;

            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[12px] transition ${
                  isActive
                    ? "bg-[#28564a] text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon name={item.icon} size={16} />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="mb-3 mt-9 px-3 text-[9px] uppercase tracking-[2px] text-white/35">
          Website
        </div>

        <button
          onClick={() => navigate("/")}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[12px] text-white/60 hover:bg-white/5 hover:text-white"
        >
          <Icon name="home" size={16} />
          Home
        </button>
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[12px] text-white/60 hover:bg-white/5 hover:text-white"
        >
          <Icon name="logout" size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}

/* =========================================================
   DEMO USERS
   Later these will come from Supabase
========================================================= */

const INITIAL_USERS = [
  {
    id: 1,
    name: "Ayesha Khan",
    email: "ayesha@gmail.com",
    role: "User",
    status: "Active",
    projects: 4,
    lastLogin: "Today, 10:42 AM",
    joined: "Sep 26, 2026",
  },
  {
    id: 2,
    name: "Hassan Ali",
    email: "hassan@gmail.com",
    role: "User",
    status: "Active",
    projects: 7,
    lastLogin: "Today, 09:18 AM",
    joined: "Sep 25, 2026",
  },
  {
    id: 3,
    name: "Rimsha Tariq",
    email: "rimsha@gmail.com",
    role: "User",
    status: "Active",
    projects: 3,
    lastLogin: "Yesterday",
    joined: "Sep 24, 2026",
  },
  {
    id: 4,
    name: "Sara Ahmed",
    email: "sara@gmail.com",
    role: "User",
    status: "Inactive",
    projects: 5,
    lastLogin: "Sep 26, 2026",
    joined: "Sep 22, 2026",
  },
  {
    id: 5,
    name: "Muhammad Hamza",
    email: "hamza@gmail.com",
    role: "User",
    status: "Active",
    projects: 9,
    lastLogin: "Today, 08:51 AM",
    joined: "Sep 20, 2026",
  },
  {
    id: 6,
    name: "Admin User",
    email: "admin@dreamhouse.com",
    role: "Admin",
    status: "Active",
    projects: 24,
    lastLogin: "Today, 11:05 AM",
    joined: "Sep 01, 2026",
  },
  {
    id: 7,
    name: "Fatima Noor",
    email: "fatima@gmail.com",
    role: "User",
    status: "Active",
    projects: 2,
    lastLogin: "Sep 27, 2026",
    joined: "Sep 19, 2026",
  },
  {
    id: 8,
    name: "Usman Raza",
    email: "usman@gmail.com",
    role: "User",
    status: "Inactive",
    projects: 1,
    lastLogin: "Sep 20, 2026",
    joined: "Sep 18, 2026",
  },
];

/* =========================================================
   MAIN USERS PAGE
========================================================= */

export default function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "User",
  });

  const logout = () => {
    localStorage.removeItem("dreamhouse_logged_in");
    localStorage.removeItem("dreamhouse_role");
    navigate("/login");
  };

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchMatch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const roleMatch =
        roleFilter === "All" || user.role === roleFilter;

      const statusMatch =
        statusFilter === "All" || user.status === statusFilter;

      return searchMatch && roleMatch && statusMatch;
    });
  }, [users, search, roleFilter, statusFilter]);

  /* =======================================================
     STATS
  ======================================================= */

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const adminUsers = users.filter(
    (user) => user.role === "Admin"
  ).length;

  const newUsers = users.filter((user) =>
    user.joined.includes("Sep 2")
  ).length;

  /* =======================================================
     ACTIONS
  ======================================================= */

  const toggleStatus = (id) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                user.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : user
      )
    );
  };

  const changeRole = (id, role) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === id
          ? { ...user, role }
          : user
      )
    );

    setSelectedUser((current) =>
      current
        ? {
            ...current,
            role,
          }
        : null
    );
  };

  const deleteUser = (id) => {
    const user = users.find((item) => item.id === id);

    if (!user) return;

    const confirmed = window.confirm(
      `Delete ${user.name}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setUsers((currentUsers) =>
      currentUsers.filter((item) => item.id !== id)
    );

    setSelectedUser(null);
  };

  const addUser = (event) => {
    event.preventDefault();

    if (!newUser.name.trim() || !newUser.email.trim()) {
      alert("Please enter name and email.");
      return;
    }

    const createdUser = {
      id: Date.now(),
      name: newUser.name.trim(),
      email: newUser.email.trim(),
      role: newUser.role,
      status: "Active",
      projects: 0,
      lastLogin: "Never",
      joined: "Sep 28, 2026",
    };

    setUsers((currentUsers) => [
      createdUser,
      ...currentUsers,
    ]);

    setNewUser({
      name: "",
      email: "",
      role: "User",
    });

    setShowAddUser(false);
  };

  return (
    <div className="min-h-screen bg-[#f4f3eb] text-[#173d32]">

      {/* SIDEBAR */}

      <AdminSidebar
        navigate={navigate}
        active="/admin/users"
        logout={logout}
      />

      {/* MAIN */}

      <main className="min-h-screen lg:ml-[245px]">

        {/* HEADER */}

        <header className="flex min-h-[76px] items-center justify-between border-b border-[#d9dfd8] bg-[#f8f7f1] px-5 py-4 sm:px-8">

          <div>
            <p className="text-[9px] uppercase tracking-[2px] text-[#738079]">
              Administration
            </p>

            <h1 className="font-serif text-[21px] font-semibold">
              Users
            </h1>
          </div>

          <div className="flex items-center gap-3">

            <span className="hidden rounded-full bg-[#e4eee7] px-3 py-1.5 text-[9px] font-semibold text-[#174d3d] sm:block">
              Administrator
            </span>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#173d32] text-[11px] font-semibold text-white">
              A
            </div>

          </div>

        </header>

        {/* CONTENT */}

        <div className="p-5 sm:p-7 xl:p-9">

          {/* PAGE TITLE */}

          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>
              <h2 className="font-serif text-[27px] font-semibold">
                User Management
              </h2>

              <p className="mt-1 text-[11px] text-[#718078]">
                Manage registered users, roles and account status.
              </p>
            </div>

            <button
              onClick={() => setShowAddUser(true)}
              className="flex w-fit items-center gap-2 rounded-xl bg-[#173d32] px-4 py-3 text-[11px] font-semibold text-white transition hover:bg-[#28564a]"
            >
              <Icon name="plus" size={15} />
              Add User
            </button>

          </div>

          {/* STAT CARDS */}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

            <UserStat
              title="Total Users"
              value={totalUsers}
              subtitle="Registered accounts"
              icon="users"
            />

            <UserStat
              title="Active Users"
              value={activeUsers}
              subtitle="Currently active"
              icon="users"
            />

            <UserStat
              title="New Users"
              value={newUsers}
              subtitle="Recently joined"
              icon="plus"
            />

            <UserStat
              title="Admins"
              value={adminUsers}
              subtitle="Administrator accounts"
              icon="settings"
            />

          </div>

          {/* USERS SECTION */}

          <section className="mt-5 overflow-hidden rounded-2xl border border-[#dce2db] bg-white">

            {/* TOOLBAR */}

            <div className="border-b border-[#edf0eb] p-4 sm:p-5">

              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">

                {/* SEARCH */}

                <div className="relative w-full xl:max-w-[390px]">

                  <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8b958f]">
                    <Icon name="search" size={16} />
                  </div>

                  <input
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search by name or email..."
                    className="w-full rounded-xl border border-[#dfe5df] bg-[#fafbf8] py-3 pl-10 pr-4 text-[11px] text-[#173d32] outline-none transition placeholder:text-[#9aa39e] focus:border-[#6f9487]"
                  />

                </div>

                {/* FILTERS */}

                <div className="flex flex-wrap gap-2">

                  <div className="relative">
                    <select
                      value={roleFilter}
                      onChange={(event) =>
                        setRoleFilter(event.target.value)
                      }
                      className="appearance-none rounded-xl border border-[#dfe5df] bg-[#fafbf8] px-4 py-3 pr-9 text-[10px] font-medium text-[#526158] outline-none"
                    >
                      <option value="All">All Roles</option>
                      <option value="User">Users</option>
                      <option value="Admin">Admins</option>
                    </select>
                  </div>

                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(event) =>
                        setStatusFilter(event.target.value)
                      }
                      className="appearance-none rounded-xl border border-[#dfe5df] bg-[#fafbf8] px-4 py-3 pr-9 text-[10px] font-medium text-[#526158] outline-none"
                    >
                      <option value="All">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                </div>

              </div>

            </div>

            {/* TABLE */}

            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px] border-collapse">

                <thead>
                  <tr className="border-b border-[#edf0eb] bg-[#fafbf8] text-left">

                    <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[1px] text-[#89938d]">
                      User
                    </th>

                    <th className="px-4 py-4 text-[9px] font-semibold uppercase tracking-[1px] text-[#89938d]">
                      Role
                    </th>

                    <th className="px-4 py-4 text-[9px] font-semibold uppercase tracking-[1px] text-[#89938d]">
                      Status
                    </th>

                    <th className="px-4 py-4 text-[9px] font-semibold uppercase tracking-[1px] text-[#89938d]">
                      Projects
                    </th>

                    <th className="px-4 py-4 text-[9px] font-semibold uppercase tracking-[1px] text-[#89938d]">
                      Last Login
                    </th>

                    <th className="px-5 py-4 text-right text-[9px] font-semibold uppercase tracking-[1px] text-[#89938d]">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredUsers.map((user) => (

                    <tr
                      key={user.id}
                      className="border-b border-[#f0f2ee] transition hover:bg-[#fafbf8]"
                    >

                      {/* USER */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <UserAvatar name={user.name} />

                          <div className="min-w-0">

                            <p className="truncate text-[11px] font-semibold text-[#173d32]">
                              {user.name}
                            </p>

                            <p className="truncate text-[9px] text-[#89938d]">
                              {user.email}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* ROLE */}

                      <td className="px-4 py-4">

                        <span
                          className={`rounded-full px-2.5 py-1 text-[8px] font-semibold ${
                            user.role === "Admin"
                              ? "bg-[#173d32] text-white"
                              : "bg-[#e8f0e9] text-[#315e4f]"
                          }`}
                        >
                          {user.role}
                        </span>

                      </td>

                      {/* STATUS */}

                      <td className="px-4 py-4">

                        <span className="inline-flex items-center gap-1.5 text-[9px] font-medium">

                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              user.status === "Active"
                                ? "bg-[#3d8065]"
                                : "bg-[#a5aaa6]"
                            }`}
                          />

                          <span
                            className={
                              user.status === "Active"
                                ? "text-[#3d8065]"
                                : "text-[#8b928d]"
                            }
                          >
                            {user.status}
                          </span>

                        </span>

                      </td>

                      {/* PROJECTS */}

                      <td className="px-4 py-4">

                        <span className="text-[10px] font-semibold text-[#53635b]">
                          {user.projects}
                        </span>

                      </td>

                      {/* LAST LOGIN */}

                      <td className="px-4 py-4">

                        <span className="text-[9px] text-[#7d8982]">
                          {user.lastLogin}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-1">

                          <button
                            onClick={() =>
                              setSelectedUser(user)
                            }
                            title="View user"
                            className="rounded-lg p-2 text-[#6f7c75] transition hover:bg-[#edf3ed] hover:text-[#173d32]"
                          >
                            <Icon name="eye" size={15} />
                          </button>

                          <button
                            onClick={() =>
                              setSelectedUser(user)
                            }
                            title="Edit user"
                            className="rounded-lg p-2 text-[#6f7c75] transition hover:bg-[#edf3ed] hover:text-[#173d32]"
                          >
                            <Icon name="edit" size={15} />
                          </button>

                          <button
                            onClick={() =>
                              toggleStatus(user.id)
                            }
                            title={
                              user.status === "Active"
                                ? "Disable user"
                                : "Enable user"
                            }
                            className="rounded-lg p-2 text-[#6f7c75] transition hover:bg-[#edf3ed] hover:text-[#173d32]"
                          >
                            <Icon name="ban" size={15} />
                          </button>

                          <button
                            onClick={() =>
                              deleteUser(user.id)
                            }
                            title="Delete user"
                            className="rounded-lg p-2 text-[#8a6868] transition hover:bg-[#f8eded] hover:text-[#9a4040]"
                          >
                            <Icon name="trash" size={15} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

              {/* EMPTY */}

              {filteredUsers.length === 0 && (

                <div className="px-6 py-16 text-center">

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf3ed] text-[#527063]">
                    <Icon name="users" size={20} />
                  </div>

                  <h3 className="mt-4 font-serif text-[18px] font-semibold">
                    No users found
                  </h3>

                  <p className="mt-1 text-[10px] text-[#89938d]">
                    Try changing your search or filters.
                  </p>

                </div>

              )}

            </div>

            {/* FOOTER */}

            <div className="flex flex-col justify-between gap-3 border-t border-[#edf0eb] px-5 py-4 sm:flex-row sm:items-center">

              <p className="text-[9px] text-[#89938d]">
                Showing{" "}
                <span className="font-semibold text-[#53635b]">
                  {filteredUsers.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[#53635b]">
                  {users.length}
                </span>{" "}
                users
              </p>

              <div className="flex items-center gap-1">

                <button
                  disabled
                  className="rounded-lg border border-[#e1e5e1] px-3 py-2 text-[9px] text-[#b0b6b2]"
                >
                  Previous
                </button>

                <button className="rounded-lg bg-[#173d32] px-3 py-2 text-[9px] font-semibold text-white">
                  1
                </button>

                <button className="rounded-lg border border-[#e1e5e1] px-3 py-2 text-[9px] text-[#65736b]">
                  Next
                </button>

              </div>

            </div>

          </section>

        </div>

      </main>

      {/* USER DETAIL MODAL */}

      {selectedUser && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#092f27]/50 p-5 backdrop-blur-sm">

          <div className="w-full max-w-[520px] rounded-3xl border border-[#dce2db] bg-[#fbfaf5] shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-[#e2e6e1] px-6 py-5">

              <div>

                <p className="text-[8px] uppercase tracking-[2px] text-[#829087]">
                  User Details
                </p>

                <h3 className="mt-1 font-serif text-[22px] font-semibold">
                  {selectedUser.name}
                </h3>

              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-xl p-2 text-[#7d8982] hover:bg-[#edf1eb]"
              >
                <Icon name="close" size={18} />
              </button>

            </div>

            {/* PROFILE */}

            <div className="p-6">

              <div className="flex items-center gap-4">

                <UserAvatar
                  name={selectedUser.name}
                  large
                />

                <div>

                  <p className="text-[15px] font-semibold">
                    {selectedUser.name}
                  </p>

                  <p className="mt-1 text-[10px] text-[#89938d]">
                    {selectedUser.email}
                  </p>

                  <div className="mt-2 flex gap-2">

                    <span className="rounded-full bg-[#e8f0e9] px-2.5 py-1 text-[8px] font-semibold text-[#315e4f]">
                      {selectedUser.role}
                    </span>

                    <span className="rounded-full bg-[#edf3ed] px-2.5 py-1 text-[8px] font-semibold text-[#527063]">
                      {selectedUser.status}
                    </span>

                  </div>

                </div>

              </div>

              {/* INFO GRID */}

              <div className="mt-6 grid grid-cols-2 gap-3">

                <InfoBox
                  label="Projects"
                  value={selectedUser.projects}
                />

                <InfoBox
                  label="Joined"
                  value={selectedUser.joined}
                />

                <InfoBox
                  label="Last Login"
                  value={selectedUser.lastLogin}
                />

                <InfoBox
                  label="Account Role"
                  value={selectedUser.role}
                />

              </div>

              {/* ROLE */}

              <div className="mt-5">

                <label className="text-[9px] font-semibold uppercase tracking-[1px] text-[#7d8982]">
                  Change Role
                </label>

                <select
                  value={selectedUser.role}
                  onChange={(event) =>
                    changeRole(
                      selectedUser.id,
                      event.target.value
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-[#dfe5df] bg-white px-4 py-3 text-[11px] outline-none"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>

              </div>

              {/* ACTIONS */}

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">

                <button
                  onClick={() =>
                    toggleStatus(selectedUser.id)
                  }
                  className="flex-1 rounded-xl border border-[#d8dfd8] bg-white px-4 py-3 text-[10px] font-semibold text-[#315e4f] hover:bg-[#f0f4ef]"
                >
                  {selectedUser.status === "Active"
                    ? "Disable Account"
                    : "Enable Account"}
                </button>

                <button
                  onClick={() =>
                    deleteUser(selectedUser.id)
                  }
                  className="flex-1 rounded-xl bg-[#8c4444] px-4 py-3 text-[10px] font-semibold text-white hover:bg-[#743737]"
                >
                  Delete User
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* ADD USER MODAL */}

      {showAddUser && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#092f27]/50 p-5 backdrop-blur-sm">

          <div className="w-full max-w-[460px] rounded-3xl border border-[#dce2db] bg-[#fbfaf5] shadow-2xl">

            <div className="flex items-center justify-between border-b border-[#e2e6e1] px-6 py-5">

              <div>

                <p className="text-[8px] uppercase tracking-[2px] text-[#829087]">
                  Administration
                </p>

                <h3 className="mt-1 font-serif text-[22px] font-semibold">
                  Add New User
                </h3>

              </div>

              <button
                onClick={() => setShowAddUser(false)}
                className="rounded-xl p-2 text-[#7d8982] hover:bg-[#edf1eb]"
              >
                <Icon name="close" size={18} />
              </button>

            </div>

            <form
              onSubmit={addUser}
              className="space-y-4 p-6"
            >

              <div>

                <label className="text-[9px] font-semibold uppercase tracking-[1px] text-[#7d8982]">
                  Full Name
                </label>

                <input
                  value={newUser.name}
                  onChange={(event) =>
                    setNewUser({
                      ...newUser,
                      name: event.target.value,
                    })
                  }
                  placeholder="Enter full name"
                  className="mt-2 w-full rounded-xl border border-[#dfe5df] bg-white px-4 py-3 text-[11px] outline-none focus:border-[#6f9487]"
                />

              </div>

              <div>

                <label className="text-[9px] font-semibold uppercase tracking-[1px] text-[#7d8982]">
                  Email
                </label>

                <input
                  type="email"
                  value={newUser.email}
                  onChange={(event) =>
                    setNewUser({
                      ...newUser,
                      email: event.target.value,
                    })
                  }
                  placeholder="user@example.com"
                  className="mt-2 w-full rounded-xl border border-[#dfe5df] bg-white px-4 py-3 text-[11px] outline-none focus:border-[#6f9487]"
                />

              </div>

              <div>

                <label className="text-[9px] font-semibold uppercase tracking-[1px] text-[#7d8982]">
                  Role
                </label>

                <select
                  value={newUser.role}
                  onChange={(event) =>
                    setNewUser({
                      ...newUser,
                      role: event.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-[#dfe5df] bg-white px-4 py-3 text-[11px] outline-none"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>

              </div>

              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#173d32] px-4 py-3.5 text-[11px] font-semibold text-white transition hover:bg-[#28564a]"
              >
                <Icon name="plus" size={15} />
                Create User
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function UserStat({ title, value, subtitle, icon }) {
  return (
    <div className="rounded-2xl border border-[#dce2db] bg-white p-5">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-[10px] text-[#7c8981]">
            {title}
          </p>

          <p className="mt-2 font-serif text-[28px] font-semibold text-[#173d32]">
            {value}
          </p>

          <p className="mt-1 text-[9px] text-[#8b958f]">
            {subtitle}
          </p>

        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3ed] text-[#174d3d]">
          <Icon name={icon} size={18} />
        </div>

      </div>

    </div>
  );
}

function UserAvatar({ name, large = false }) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-[#e6eee7] font-semibold text-[#174d3d] ${
        large
          ? "h-16 w-16 text-[15px]"
          : "h-10 w-10 text-[9px]"
      }`}
    >
      {initials}
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl border border-[#e4e8e3] bg-white p-3">

      <p className="text-[8px] uppercase tracking-[1px] text-[#909a94]">
        {label}
      </p>

      <p className="mt-1 text-[10px] font-semibold text-[#42534b]">
        {value}
      </p>

    </div>
  );
}