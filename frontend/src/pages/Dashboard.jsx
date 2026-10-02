
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listProjects } from "../services/projectApi";
import { logoutUser } from "../services/authApi";

const Icon = ({ name, size = 18 }) => {
  const paths = {
    home: (
      <>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9 21v-6h6v6" />
      </>
    ),

    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
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

    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 2-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V20h-3v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-2-2 .1-.1A1.7 1.7 0 0 0 7.2 15a1.7 1.7 0 0 0-1.6-1H5v-3h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2-2 .1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V5h3v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 2 2-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v3h-.2a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),

    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
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
        <path d="m12 2 9 5-9 5-9-5 9-5Z" />
        <path d="m3 7 9 5 9-5M3 7v10l9 5 9-5V7M12 12v10" />
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

function Sidebar({ navigate, active, onLogout }) {
  const menu = [
    {
      label: "Dashboard",
      icon: "grid",
      path: "/dashboard",
    },
    {
      label: "My Projects",
      icon: "plan",
      path: "/my-designs",
    },
    {
      label: "Templates",
      icon: "template",
      path: "/templates",
    },
    {
      label: "AI Assistant",
      icon: "ai",
      path: "/ai-planner",
    },
    {
      label: "Settings",
      icon: "settings",
      path: "/settings",
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[245px] flex-col bg-[#123d32] text-white lg:flex">
      {/* LOGO */}
      <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-7">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf1e8] text-[#123d32]">
          <span className="text-xl">⌂</span>
        </div>

        <div>
          <div className="font-serif text-[17px] font-semibold">
            DreamHouse
          </div>

          <div className="text-[8px] uppercase tracking-[3px] text-white/55">
            Planner
          </div>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-4 py-7">
        <div className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[2px] text-white/35">
          Menu
        </div>

        <div className="space-y-1.5">
          {menu.map((item) => {
            const isActive = active === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[12px] transition ${
                  isActive
                    ? "bg-[#315f50] text-white shadow-sm"
                    : "text-white/65 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon name={item.icon} size={16} />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="mb-3 mt-9 px-3 text-[9px] font-semibold uppercase tracking-[2px] text-white/35">
          Website
        </div>

        <button
          onClick={() => navigate("/")}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[12px] text-white/65 transition hover:bg-white/5 hover:text-white"
        >
          <Icon name="home" size={16} />
          Home
        </button>
      </nav>

      {/* LOGOUT */}
      <div className="border-t border-white/10 p-4">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[12px] text-white/65 transition hover:bg-white/5 hover:text-white"
        >
          <Icon name="logout" size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  // IMPORTANT:
  // Dashboard starts EMPTY.
  // Only projects returned from the API will appear here.
  const [projects, setProjects] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("dreamhouse_token");

    if (!token) {
      setProjects([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    listProjects()
      .then((remoteProjects) => {
        const userProjects = (remoteProjects || []).map((item) => ({
          id: item._id,
          name: item.name || "Untitled Project",
          image: item.thumbnail || "",
          size: `${item.floorPlanData?.project?.plotWidth || 0} × ${
            item.floorPlanData?.project?.plotLength || 0
          } ft`,
          rooms: `${item.floorPlanData?.rooms?.length || 0} Rooms`,
          edited: item.updatedAt
            ? `Edited ${new Date(item.updatedAt).toLocaleDateString()}`
            : "Recently created",
        }));

        setProjects(userProjects);
      })
      .catch(() => {
        setProjects([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const userName =
    localStorage.getItem("dreamhouse_name") ||
    localStorage.getItem("dreamhouse_user_name") ||
    "Rimsha";

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      project.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [projects, search]);

  const logout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f7f5ed] text-[#173d32]">
      <Sidebar
        navigate={navigate}
        active="/dashboard"
        onLogout={logout}
      />

      <main className="min-h-screen lg:ml-[245px]">
        {/* TOP BAR */}
        <header className="flex h-[76px] items-center justify-between border-b border-[#dfe3dc] bg-[#faf9f4] px-6 sm:px-8">
          <div>
            <p className="text-[10px] uppercase tracking-[2px] text-[#718078]">
              Dashboard
            </p>

            <h1 className="font-serif text-[20px] font-semibold text-[#173d32]">
              Welcome back, {userName} 👋
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/create-project")}
              className="hidden rounded-xl bg-[#174d3d] px-5 py-2.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-[#103d30] sm:flex sm:items-center sm:gap-2"
            >
              <Icon name="plus" size={14} />
              Create New Project
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d8ded7] bg-white text-[11px] font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="p-5 sm:p-7 xl:p-9">
          {/* WELCOME */}
          <section className="mb-7">
            <h2 className="font-serif text-[27px] font-semibold">
              Good Morning, {userName} 👋
            </h2>

            <p className="mt-1 text-[12px] text-[#718078]">
              Plan your dream home today.
            </p>
          </section>

          {/* QUICK ACTIONS */}
          <section className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-serif text-[18px] font-semibold">
                Quick Actions
              </h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <QuickAction
                icon="plan"
                title="Create Floor Plan"
                text="Start a new home plan"
                onClick={() => navigate("/create-project")}
              />

              <QuickAction
                icon="ai"
                title="AI Suggestions"
                text="Get smart planning ideas"
                onClick={() => navigate("/ai-planner")}
              />

              <QuickAction
                icon="cube"
                title="3D Viewer"
                text="View your house in 3D"
                onClick={() => navigate("/3d-view")}
              />

              <QuickAction
                icon="template"
                title="Templates"
                text="Explore ready designs"
                onClick={() => navigate("/templates")}
              />
            </div>
          </section>

          {/* PROJECTS */}
          <section>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-serif text-[20px] font-semibold">
                  Your Projects
                </h3>

                <p className="mt-1 text-[11px] text-[#718078]">
                  Your generated and saved house designs appear here.
                </p>
              </div>

              {projects.length > 0 && (
                <div className="flex gap-2">
                  <div className="relative">
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search projects..."
                      className="w-[180px] rounded-xl border border-[#dce2da] bg-white py-2.5 pl-9 pr-3 text-[11px] outline-none transition focus:border-[#174d3d]"
                    />

                    <div className="pointer-events-none absolute left-3 top-[10px] text-[#839087]">
                      <Icon name="search" size={14} />
                    </div>
                  </div>

                  <button className="rounded-xl border border-[#dce2da] bg-white px-4 text-[11px] text-[#526159]">
                    Latest ▾
                  </button>
                </div>
              )}
            </div>

            {/* LOADING */}
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="overflow-hidden rounded-2xl border border-[#dfe4dd] bg-white"
                  >
                    <div className="h-[175px] animate-pulse bg-[#e9eee8]" />

                    <div className="space-y-3 p-4">
                      <div className="h-4 w-32 animate-pulse rounded bg-[#e9eee8]" />
                      <div className="h-3 w-24 animate-pulse rounded bg-[#edf1ec]" />
                      <div className="h-9 w-full animate-pulse rounded-xl bg-[#edf1ec]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onOpen={() =>
                      navigate("/floor-plan-editor", {
                        state: {
                          projectId: project.id,
                        },
                      })
                    }
                  />
                ))}
              </div>
            ) : (
              <EmptyProjects
                hasSearch={Boolean(search)}
                onCreate={() => navigate("/create-project")}
              />
            )}
          </section>

          {/* STATS */}
          <section className="mt-8 grid gap-3 sm:grid-cols-3">
            <SmallStat
              title="Total Projects"
              value={projects.length}
            />

            <SmallStat
              title="AI Plans Created"
              value="12"
            />

            <SmallStat
              title="3D Views"
              value="8"
            />
          </section>
        </div>
      </main>
    </div>
  );
}

function QuickAction({ icon, title, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group rounded-2xl border border-[#dfe4dd] bg-white p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-[#b9c9be] hover:shadow-lg hover:shadow-[#315348]/10"
    >
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf3ed] text-[#174d3d]">
        <Icon name={icon} size={17} />
      </div>

      <h4 className="text-[12px] font-semibold text-[#173d32]">
        {title}
      </h4>

      <p className="mt-1 text-[10px] leading-5 text-[#7a857f]">
        {text}
      </p>
    </button>
  );
}

function ProjectCard({ project, onOpen }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#dfe4dd] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#315348]/10">
      {/* PROJECT IMAGE */}
      <div className="h-[175px] overflow-hidden bg-[#edf3ed]">
        {project.image ? (
          <img
            src={project.image}
            alt={project.name}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#789084]">
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                <Icon name="plan" size={20} />
              </div>

              <p className="text-[10px]">
                Floor Plan Preview
              </p>
            </div>
          </div>
        )}
      </div>

      {/* PROJECT DETAILS */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="font-serif text-[16px] font-semibold">
              {project.name}
            </h4>

            <p className="mt-1 text-[10px] text-[#78847d]">
              {project.size} · {project.rooms}
            </p>
          </div>

          <button className="text-[#829087]">
            •••
          </button>
        </div>

        <p className="mt-3 text-[9px] text-[#99a19c]">
          {project.edited}
        </p>

        <button
          onClick={onOpen}
          className="mt-4 w-full rounded-xl border border-[#cbd8ce] py-2.5 text-[10px] font-semibold text-[#174d3d] transition hover:bg-[#edf3ed]"
        >
          Open Project →
        </button>
      </div>
    </div>
  );
}

function EmptyProjects({ hasSearch, onCreate }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#cbd5cc] bg-white p-12 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf3ed] text-[#174d3d]">
        <Icon name="plan" size={24} />
      </div>

      <p className="font-serif text-[20px] font-semibold text-[#173d32]">
        {hasSearch ? "No projects found" : "No designs yet"}
      </p>

      <p className="mx-auto mt-2 max-w-sm text-[11px] leading-5 text-[#718078]">
        {hasSearch
          ? "Try searching with another project name."
          : "Create your first floor plan and your saved design will appear here automatically."}
      </p>

      {!hasSearch && (
        <button
          onClick={onCreate}
          className="mt-5 rounded-xl bg-[#174d3d] px-5 py-2.5 text-[11px] font-semibold text-white transition hover:bg-[#103d30]"
        >
          Create New Project
        </button>
      )}
    </div>
  );
}

function SmallStat({ title, value }) {
  return (
    <div className="rounded-2xl border border-[#dfe4dd] bg-white p-4">
      <p className="text-[10px] text-[#7d8982]">
        {title}
      </p>

      <p className="mt-1 font-serif text-[24px] font-semibold text-[#173d32]">
        {value}
      </p>
    </div>
  );
}