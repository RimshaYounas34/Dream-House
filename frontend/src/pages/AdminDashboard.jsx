import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAdminDashboard,
  getAdminProjects,
  getAdminContactMessages,
} from "../services/adminApi";

/* =========================================================
   ICONS
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

    cube: (
      <>
        <path d="m12 2 8 4.5v11L12 22l-8-4.5v-11L12 2Z" />
        <path d="m4.5 6.8 7.5 4.4 7.5-4.4M12 11.2V22" />
      </>
    ),

    ai: (
      <>
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
        <path d="m5.6 5.6 2.1 2.1M16.3 16.3l2.1 2.1" />
        <path d="m18.4 5.6-2.1 2.1M7.7 16.3l-2.1 2.1" />
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
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 2-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V20h-3v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-2-2 .1-.1A1.7 1.7 0 0 0 7.2 15a1.7 1.7 0 0 0-1.6-1H5v-3h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2-2 .1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V5h3v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 2 2-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.9 0 0 0 1.6 1h.2v3h-.2a1.7 1.7 0 0 0-1.6 1Z" />
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
    { label: "AI Usage", icon: "ai", path: "/admin/ai-usage" },
    { label: "Queries", icon: "report", path: "/admin/queries" },
    { label: "Reports", icon: "report", path: "/admin/reports" },
    { label: "Settings", icon: "settings", path: "/admin/settings" },
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
                type="button"
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
          type="button"
          onClick={() => navigate("/")}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[12px] text-white/60 hover:bg-white/5 hover:text-white"
        >
          <Icon name="home" size={16} />
          Home
        </button>
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
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
   ADMIN DASHBOARD
========================================================= */

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [queries, setQueries] = useState([]);
  const [newQueries, setNewQueries] = useState(0);

  /* -------------------------------------------------------
     LOGOUT
  ------------------------------------------------------- */

  const logout = useCallback(() => {
    [
      "dreamhouse_token",
      "dreamhouse_user",
      "dreamhouse_logged_in",
      "dreamhouse_role",
      "dreamhouse_name",
    ].forEach((key) => localStorage.removeItem(key));

    navigate("/admin-login", { replace: true });
  }, [navigate]);

  /* -------------------------------------------------------
     AUTH + DATA
  ------------------------------------------------------- */

  const loadDashboard = useCallback(async () => {
    const token = localStorage.getItem("dreamhouse_token");
    const role = localStorage.getItem("dreamhouse_role");

    if (!token || role !== "admin") {
      navigate("/admin-login", { replace: true });
      return;
    }

    setLoading(true);
    setError("");

    try {
      /* -----------------------------------------------------
         ADMIN DASHBOARD
      ----------------------------------------------------- */

      const dashboardResponse =
        await getAdminDashboard();

      const data =
        dashboardResponse?.data ||
        dashboardResponse ||
        null;

      /* -----------------------------------------------------
         ALL PROJECTS
      ----------------------------------------------------- */

      const projectsResponse =
        await getAdminProjects({
          page: 1,
          limit: 1000,
        });

      const projectsData =
        projectsResponse?.data ||
        projectsResponse ||
        {};

      const allProjects = Array.isArray(projectsData)
        ? projectsData
        : Array.isArray(projectsData.projects)
        ? projectsData.projects
        : Array.isArray(projectsData.items)
        ? projectsData.items
        : Array.isArray(projectsData.results)
        ? projectsData.results
        : [];

      /* -----------------------------------------------------
         CONTACT QUERIES
      ----------------------------------------------------- */

      const queriesResponse =
        await getAdminContactMessages();

      const queriesData =
        queriesResponse?.data ||
        queriesResponse ||
        {};

      const contactQueries = Array.isArray(
        queriesData?.messages
      )
        ? queriesData.messages
        : Array.isArray(queriesData)
        ? queriesData
        : [];

      setQueries(contactQueries);

      setNewQueries(
        Number(queriesData?.newCount || 0)
      );

      /* -----------------------------------------------------
         FIND ACTUAL 3D PROJECTS
      ----------------------------------------------------- */

      const threeDProjectsList =
        allProjects.filter((project) => {
          const floorPlanData =
            project?.floorPlanData || {};

          const settings =
            floorPlanData?.settings || {};

          return (
            project?.has3D === true ||
            project?.type === "3D" ||
            project?.type === "3d" ||
            project?.created3D === true ||
            floorPlanData?.created3D === true ||
            settings?.created3D === true ||
            Boolean(settings?.last3DSavedAt)
          );
        });

      const actualTotalProjects =
        allProjects.length;

      const actualThreeDProjects =
        threeDProjectsList.length;

      /* -----------------------------------------------------
         EXISTING DASHBOARD STATS
      ----------------------------------------------------- */

      const dashboardStats =
        data?.stats ||
        data?.statistics ||
        {};

      /* -----------------------------------------------------
         UPDATED DASHBOARD DATA
      ----------------------------------------------------- */

      const updatedDashboard = {
        ...(data || {}),

        stats: {
          ...dashboardStats,

          totalProjects:
            actualTotalProjects ||
            dashboardStats.totalProjects ||
            data?.totalProjects ||
            0,

          threeDProjects:
            actualThreeDProjects,

          total3DProjects:
            actualThreeDProjects,
        },

        projects:
          Array.isArray(data?.projects) &&
          data.projects.length > 0
            ? data.projects
            : allProjects,

        recentProjects:
          Array.isArray(data?.recentProjects) &&
          data.recentProjects.length > 0
            ? data.recentProjects
            : allProjects.slice(0, 5),
      };

      setDashboard(updatedDashboard);
    } catch (err) {
      console.error(
        "Admin dashboard error:",
        err
      );

      setError(
        err?.message ||
          "Dashboard data could not be loaded. Showing admin panel."
      );

      setDashboard({
        stats: {
          totalUsers: 0,
          totalProjects: 0,
          threeDProjects: 0,
          aiRequests: 0,
        },
        recentUsers: [],
        recentProjects: [],
        projects: [],
      });

      setQueries([]);
      setNewQueries(0);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  /* -------------------------------------------------------
     SAFE DATA
  ------------------------------------------------------- */

  const stats =
    dashboard?.stats ||
    dashboard?.statistics ||
    {};

  const getStatValue = (
    stat,
    fallback = 0
  ) => {
    if (
      stat &&
      typeof stat === "object"
    ) {
      return stat.value ?? fallback;
    }

    return stat ?? fallback;
  };

  const getStatChange = (
    stat,
    fallback = ""
  ) => {
    if (
      stat &&
      typeof stat === "object"
    ) {
      return stat.change ?? fallback;
    }

    return fallback;
  };

  const totalUsersRaw =
    stats.totalUsers ??
    dashboard?.totalUsers ??
    dashboard?.usersCount ??
    0;

  const totalProjectsRaw =
    stats.totalProjects ??
    dashboard?.totalProjects ??
    dashboard?.projectsCount ??
    0;

  const threeDProjectsRaw =
    stats.threeDProjects ??
    stats.total3DProjects ??
    dashboard?.threeDProjects ??
    dashboard?.threeDCount ??
    0;

  const aiRequestsRaw =
    stats.aiRequests ??
    stats.totalAIRequests ??
    dashboard?.aiRequests ??
    dashboard?.aiUsage ??
    0;

  const totalUsers =
    getStatValue(totalUsersRaw);

  const totalProjects =
    getStatValue(totalProjectsRaw);

  const threeDProjects =
    getStatValue(threeDProjectsRaw);

  const aiRequests =
    getStatValue(aiRequestsRaw);

  const totalUsersChange =
    getStatChange(
      totalUsersRaw,
      "+12%"
    );

  const totalProjectsChange =
    getStatChange(
      totalProjectsRaw,
      "+8%"
    );

  const threeDProjectsChange =
    getStatChange(
      threeDProjectsRaw,
      "+15%"
    );

  const aiRequestsChange =
    getStatChange(
      aiRequestsRaw,
      "+20%"
    );

  const recentUsers = Array.isArray(
    dashboard?.recentUsers
  )
    ? dashboard.recentUsers
    : Array.isArray(dashboard?.users)
    ? dashboard.users
    : [];

  const recentProjects =
    Array.isArray(
      dashboard?.recentProjects
    )
      ? dashboard.recentProjects
      : Array.isArray(
          dashboard?.projects
        )
      ? dashboard.projects
      : [];

  return (
    <div className="min-h-screen bg-[#f4f3eb] text-[#173d32]">
      <AdminSidebar
        navigate={navigate}
        active="/admin"
        logout={logout}
      />

      <main className="min-h-screen lg:ml-[245px]">
        {/* TOP BAR */}

        <header className="flex h-[76px] items-center justify-between border-b border-[#d9dfd8] bg-[#f8f7f1] px-6 sm:px-8">
          <div>
            <p className="text-[9px] uppercase tracking-[2px] text-[#738079]">
              Administration
            </p>

            <h1 className="font-serif text-[21px] font-semibold">
              Admin Dashboard
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

        <div className="p-5 sm:p-7 xl:p-9">
          {/* INTRO */}

          <div className="mb-7">
            <h2 className="font-serif text-[27px] font-semibold">
              Good Morning, Admin 👋
            </h2>

            <p className="mt-1 text-[11px] text-[#718078]">
              Here's what's happening with
              DreamHouse Planner today.
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-[#f0c9c4] bg-[#fdf1ef] px-4 py-3 text-[11px] text-[#9a3a30]">
              <span>{error}</span>

              <button
                type="button"
                onClick={loadDashboard}
                className="font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* STAT CARDS */}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <AdminStat
              title="Total Users"
              value={
                loading
                  ? "—"
                  : totalUsers
              }
              change={
                loading
                  ? ""
                  : totalUsersChange
              }
              icon="users"
            />

            <AdminStat
              title="Total Projects"
              value={
                loading
                  ? "—"
                  : totalProjects
              }
              change={
                loading
                  ? ""
                  : totalProjectsChange
              }
              icon="plan"
            />

            <AdminStat
              title="3D Projects"
              value={
                loading
                  ? "—"
                  : threeDProjects
              }
              change={
                loading
                  ? ""
                  : threeDProjectsChange
              }
              icon="cube"
            />

            <AdminStat
              title="AI Requests"
              value={
                loading
                  ? "—"
                  : aiRequests
              }
              change={
                loading
                  ? ""
                  : aiRequestsChange
              }
              icon="ai"
            />

            <AdminStat
              title="New Queries"
              value={
                loading
                  ? "—"
                  : newQueries
              }
              change=""
              icon="report"
            />
          </div>

          {/* MAIN GRID */}

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_1fr]">
            {/* RECENT USERS */}

            <section className="rounded-2xl border border-[#dce2db] bg-white p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-[18px] font-semibold">
                    Recent Users
                  </h3>

                  <p className="mt-1 text-[10px] text-[#819087]">
                    Recently registered users
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/admin/users"
                    )
                  }
                  className="text-[10px] font-semibold text-[#174d3d]"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-3">
                {recentUsers.length > 0 ? (
                  recentUsers
                    .slice(0, 5)
                    .map(
                      (
                        user,
                        index
                      ) => (
                        <UserRow
                          key={
                            user?._id ||
                            user?.id ||
                            index
                          }
                          name={
                            user?.name ||
                            "Unknown User"
                          }
                          email={
                            user?.email ||
                            "—"
                          }
                          projects={
                            user?.projectsCount !==
                            undefined
                              ? `${user.projectsCount} projects`
                              : "User"
                          }
                          avatar={initials(
                            user?.name
                          )}
                        />
                      )
                    )
                ) : (
                  <EmptyState text="No recent users found." />
                )}
              </div>
            </section>

            {/* RECENT PROJECTS */}

            <section className="rounded-2xl border border-[#dce2db] bg-white p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-[18px] font-semibold">
                    Recent Projects
                  </h3>

                  <p className="mt-1 text-[10px] text-[#819087]">
                    Latest user projects
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/admin/projects"
                    )
                  }
                  className="text-[10px] font-semibold text-[#174d3d]"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-3">
                {recentProjects.length > 0 ? (
                  recentProjects
                    .slice(0, 5)
                    .map(
                      (
                        project,
                        index
                      ) => (
                        <ProjectRow
                          key={
                            project?._id ||
                            project?.id ||
                            index
                          }
                          name={
                            project?.name ||
                            project?.title ||
                            "Untitled Project"
                          }
                          user={
                            project?.user
                              ?.name ||
                            project?.owner
                              ?.name ||
                            project?.userName ||
                            project?.user
                              ?.email ||
                            "Unknown User"
                          }
                          type={
                            project?.type ||
                            (project?.has3D
                              ? "3D"
                              : project
                                  ?.floorPlanData
                                  ?.settings
                                  ?.created3D
                              ? "3D"
                              : "2D")
                          }
                        />
                      )
                    )
                ) : (
                  <EmptyState text="No recent projects found." />
                )}
              </div>
            </section>
          </div>

          {/* RECENT QUERIES */}

          <section className="mt-5 rounded-2xl border border-[#dce2db] bg-white p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-[18px] font-semibold">
                  Recent Queries
                </h3>

                <p className="mt-1 text-[10px] text-[#819087]">
                  Messages received from website visitors
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/admin/queries"
                  )
                }
                className="text-[10px] font-semibold text-[#174d3d]"
              >
                View All →
              </button>
            </div>

            <div className="space-y-3">
              {queries.length > 0 ? (
                queries
                  .slice(0, 5)
                  .map(
                    (
                      query,
                      index
                    ) => (
                      <QueryRow
                        key={
                          query?._id ||
                          query?.id ||
                          index
                        }
                        name={
                          query?.name ||
                          "Unknown User"
                        }
                        email={
                          query?.email ||
                          "—"
                        }
                        subject={
                          query?.subject ||
                          "No subject"
                        }
                        status={
                          query?.status ||
                          "new"
                        }
                        date={
                          query?.createdAt
                        }
                      />
                    )
                  )
              ) : (
                <EmptyState text="No contact queries found." />
              )}
            </div>
          </section>

          {/* ANALYTICS */}

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {/* PROJECT GROWTH */}

            <section className="rounded-2xl border border-[#dce2db] bg-white p-5">
              <h3 className="font-serif text-[18px] font-semibold">
                Project Growth
              </h3>

              <p className="mt-1 text-[10px] text-[#819087]">
                Projects created this month
              </p>

              <div className="mt-6 flex h-[170px] items-end gap-3 border-b border-[#e5e8e3] px-2">
                {[
                  38,
                  62,
                  48,
                  75,
                  66,
                  92,
                  78,
                  100,
                  84,
                  112,
                  96,
                  126,
                ].map(
                  (
                    height,
                    index
                  ) => (
                    <div
                      key={index}
                      className="flex flex-1 items-end justify-center"
                    >
                      <div
                        className="w-full max-w-[26px] rounded-t-lg bg-[#1d5544]"
                        style={{
                          height,
                        }}
                      />
                    </div>
                  )
                )}
              </div>

              <div className="mt-3 flex justify-between text-[9px] text-[#8b958f]">
                <span>Jan</span>
                <span>Mar</span>
                <span>May</span>
                <span>Jul</span>
                <span>Sep</span>
              </div>
            </section>

            {/* PLATFORM ACTIVITY */}

            <section className="rounded-2xl border border-[#dce2db] bg-white p-5">
              <h3 className="font-serif text-[18px] font-semibold">
                Platform Activity
              </h3>

              <p className="mt-1 text-[10px] text-[#819087]">
                Current system activity
              </p>

              <div className="mt-6 space-y-5">
                <Activity
                  label="AI Usage"
                  value="82%"
                  width="82%"
                />

                <Activity
                  label="3D Viewer"
                  value="67%"
                  width="67%"
                />

                <Activity
                  label="Floor Planner"
                  value="91%"
                  width="91%"
                />

                <Activity
                  label="Templates"
                  value="74%"
                  width="74%"
                />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function AdminStat({
  title,
  value,
  change,
  icon,
}) {
  const safeValue =
    value !== null &&
    value !== undefined &&
    typeof value !== "object"
      ? value
      : "—";

  const safeChange =
    change !== null &&
    change !== undefined &&
    typeof change !== "object"
      ? change
      : "";

  return (
    <div className="rounded-2xl border border-[#dce2db] bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] text-[#7c8981]">
            {title}
          </p>

          <p className="mt-2 font-serif text-[28px] font-semibold text-[#173d32]">
            {safeValue}
          </p>

          {safeChange && (
            <p className="mt-1 text-[9px] font-semibold text-[#3d8065]">
              {safeChange} this month
            </p>
          )}
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3ed] text-[#174d3d]">
          <Icon
            name={icon}
            size={18}
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   USER ROW
========================================================= */

function UserRow({
  name,
  email,
  projects,
  avatar,
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#edf0eb] p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e6eee7] text-[9px] font-semibold text-[#174d3d]">
          {avatar}
        </div>

        <div>
          <p className="text-[11px] font-semibold">
            {name}
          </p>

          <p className="text-[9px] text-[#8a948e]">
            {email}
          </p>
        </div>
      </div>

      <span className="text-[9px] text-[#7c8981]">
        {projects}
      </span>
    </div>
  );
}

/* =========================================================
   PROJECT ROW
========================================================= */

function ProjectRow({
  name,
  user,
  type,
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#edf0eb] p-3">
      <div>
        <p className="text-[11px] font-semibold">
          {name}
        </p>

        <p className="mt-1 text-[9px] text-[#8a948e]">
          by {user}
        </p>
      </div>

      <span className="rounded-full bg-[#e8f0e9] px-2.5 py-1 text-[8px] font-semibold text-[#174d3d]">
        {type}
      </span>
    </div>
  );
}

/* =========================================================
   QUERY ROW
========================================================= */

function QueryRow({
  name,
  email,
  subject,
  status,
  date,
}) {
  const statusStyles = {
    new: "bg-[#eaf5ef] text-[#14734f]",
    read: "bg-[#eef2f5] text-[#596771]",
    resolved:
      "bg-[#e9f1ed] text-[#356b56]",
  };

  const formattedDate = date
    ? new Date(date).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        }
      )
    : "—";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#edf0eb] p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e6eee7] text-[9px] font-semibold text-[#174d3d]">
            {initials(name)}
          </div>

          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold text-[#173d32]">
              {name}
            </p>

            <p className="truncate text-[9px] text-[#8a948e]">
              {email}
            </p>
          </div>
        </div>

        <p className="mt-2 truncate pl-12 text-[10px] text-[#596760]">
          {subject}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3 pl-12 sm:pl-0">
        <span
          className={`rounded-full px-2.5 py-1 text-[8px] font-semibold capitalize ${
            statusStyles[status] ||
            "bg-[#edf0eb] text-[#68756e]"
          }`}
        >
          {status}
        </span>

        <span className="text-[9px] text-[#8a948e]">
          {formattedDate}
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   ACTIVITY
========================================================= */

function Activity({
  label,
  value,
  width,
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between">
        <span className="text-[10px] text-[#56645c]">
          {label}
        </span>

        <span className="text-[10px] font-semibold">
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#edf0eb]">
        <div
          className="h-full rounded-full bg-[#1d5544]"
          style={{ width }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({ text }) {
  return (
    <div className="rounded-xl border border-dashed border-[#dce2db] px-4 py-7 text-center">
      <p className="text-[10px] text-[#8a948e]">
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   INITIALS
========================================================= */

function initials(name = "") {
  if (typeof name !== "string") {
    return "U";
  }

  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) =>
        word[0]?.toUpperCase()
      )
      .join("") || "U"
  );
}