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
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
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

    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),

    spark: (
      <>
        <path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z" />
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
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[250px] flex-col bg-[#123d32] text-white lg:flex">
      {/* BRAND */}
      <div className="flex h-[82px] items-center gap-3 border-b border-white/10 px-7">
        <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#eef4ec] text-[#123d32] shadow-sm">
          <span className="font-serif text-[21px]">⌂</span>
        </div>

        <div>
          <div className="font-serif text-[18px] font-semibold tracking-[-0.3px]">
            DreamHouse
          </div>

          <div className="mt-0.5 text-[8px] uppercase tracking-[3px] text-white/45">
            Planner
          </div>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-4 py-7">
        <div className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[2px] text-white/35">
          Workspace
        </div>

        <div className="space-y-1.5">
          {menu.map((item) => {
            const isActive = active === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-[12px] transition-all duration-200 ${
                  isActive
                    ? "bg-[#315f50] text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                    : "text-white/60 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg transition ${
                    isActive
                      ? "bg-white/10"
                      : "bg-transparent group-hover:bg-white/5"
                  }`}
                >
                  <Icon name={item.icon} size={16} />
                </span>

                {item.label}
              </button>
            );
          })}
        </div>

        <div className="mb-3 mt-10 px-3 text-[9px] font-semibold uppercase tracking-[2px] text-white/35">
          Website
        </div>

        <button
          onClick={() => navigate("/")}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-[12px] text-white/60 transition hover:bg-white/[0.06] hover:text-white"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg">
            <Icon name="home" size={16} />
          </span>

          Home
        </button>
      </nav>

      {/* SIDEBAR FOOTER */}
      <div className="border-t border-white/10 p-4">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-[12px] text-white/55 transition hover:bg-white/[0.06] hover:text-white"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg">
            <Icon name="logout" size={16} />
          </span>

          Logout
        </button>
      </div>
    </aside>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-[#f5f6f1] text-[#173d32]">
      <Sidebar
        navigate={navigate}
        active="/dashboard"
        onLogout={logout}
      />

      <main className="min-h-screen lg:ml-[250px]">
        {/* TOP BAR */}
        <header className="sticky top-0 z-30 flex h-[78px] items-center justify-between border-b border-[#e0e5df] bg-[#fafbf7]/95 px-5 backdrop-blur-md sm:px-8">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[2.2px] text-[#829087]">
              Workspace
            </p>

            <h1 className="mt-1 font-serif text-[20px] font-semibold tracking-[-0.3px] text-[#173d32]">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/create-project")}
              className="hidden items-center gap-2 rounded-xl bg-[#174d3d] px-5 py-2.5 text-[11px] font-semibold text-white shadow-[0_8px_20px_rgba(23,77,61,0.15)] transition hover:-translate-y-0.5 hover:bg-[#103d30] sm:flex"
            >
              <Icon name="plus" size={14} />
              Create New Project
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9e0d8] bg-white text-[11px] font-bold text-[#174d3d] shadow-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1450px] p-5 sm:p-7 xl:p-9">
          {/* WELCOME HERO */}
          <section className="relative mb-8 overflow-hidden rounded-[24px] bg-[#173f33] px-6 py-7 text-white shadow-[0_15px_45px_rgba(31,65,53,0.12)] sm:px-8 sm:py-8">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border border-white/10" />
            <div className="absolute -right-5 -bottom-28 h-60 w-60 rounded-full border border-white/[0.06]" />

            <div className="relative z-10 max-w-[680px]">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[9px] uppercase tracking-[1.5px] text-white/65">
                <Icon name="spark" size={12} />
                Your home planning workspace
              </div>

              <h2 className="font-serif text-[28px] font-semibold leading-tight tracking-[-0.5px] sm:text-[34px]">
                Good Morning, {userName} 👋
              </h2>

              <p className="mt-2 max-w-[520px] text-[11px] leading-6 text-white/60 sm:text-[12px]">
                Turn your ideas into a beautiful home plan. Create floor
                plans, explore 3D views and get smart AI suggestions.
              </p>

              <button
                onClick={() => navigate("/create-project")}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#eef4ec] px-5 py-2.5 text-[10px] font-bold text-[#173d32] transition hover:-translate-y-0.5 hover:bg-white"
              >
                Start Planning
                <Icon name="arrow" size={14} />
              </button>
            </div>
          </section>

          {/* QUICK ACTIONS */}
          <section className="mb-9">
            <div className="mb-4">
              <p className="text-[9px] font-semibold uppercase tracking-[2px] text-[#8a958f]">
                Get started
              </p>

              <h3 className="mt-1 font-serif text-[21px] font-semibold">
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
                text="Explore your home in 3D"
                onClick={() => navigate("/3d-view")}
              />

              <QuickAction
                icon="template"
                title="Templates"
                text="Explore ready-made designs"
                onClick={() => navigate("/templates")}
              />
            </div>
          </section>

          {/* PROJECTS */}
          <section>
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[2px] text-[#8a958f]">
                  Your workspace
                </p>

                <h3 className="mt-1 font-serif text-[22px] font-semibold">
                  Your Projects
                </h3>

                <p className="mt-1 text-[11px] text-[#7b8780]">
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
                      className="w-[200px] rounded-xl border border-[#dce2da] bg-white py-2.5 pl-9 pr-3 text-[10px] text-[#173d32] outline-none transition placeholder:text-[#a0aaa4] focus:border-[#174d3d] focus:ring-2 focus:ring-[#174d3d]/5"
                    />

                    <div className="pointer-events-none absolute left-3 top-[10px] text-[#8a958f]">
                      <Icon name="search" size={14} />
                    </div>
                  </div>

                  <button className="rounded-xl border border-[#dce2da] bg-white px-4 text-[10px] font-medium text-[#526159] transition hover:border-[#bdcabe]">
                    Latest ▾
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="overflow-hidden rounded-[20px] border border-[#e0e5df] bg-white"
                  >
                    <div className="h-[190px] animate-pulse bg-[#e8ede7]" />

                    <div className="space-y-3 p-5">
                      <div className="h-4 w-32 animate-pulse rounded bg-[#e8ede7]" />
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
              icon="plan"
            />

            <SmallStat
              title="AI Plans Created"
              value="12"
              icon="ai"
            />

            <SmallStat
              title="3D Views"
              value="8"
              icon="cube"
            />
          </section>
        </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <div className="fixed bottom-4 left-4 right-4 z-50 flex items-center justify-around rounded-2xl border border-[#dfe5df] bg-white/95 p-2 shadow-[0_12px_35px_rgba(25,55,45,0.14)] backdrop-blur-md lg:hidden">
        <MobileNav
          icon="grid"
          label="Home"
          active
          onClick={() => navigate("/dashboard")}
        />

        <MobileNav
          icon="plan"
          label="Projects"
          onClick={() => navigate("/my-designs")}
        />

        <button
          onClick={() => navigate("/create-project")}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#174d3d] text-white shadow-lg"
        >
          <Icon name="plus" size={19} />
        </button>

        <MobileNav
          icon="ai"
          label="AI"
          onClick={() => navigate("/ai-planner")}
        />

        <MobileNav
          icon="settings"
          label="Settings"
          onClick={() => navigate("/settings")}
        />
      </div>
    </div>
  );
}

function QuickAction({ icon, title, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-[19px] border border-[#e0e5df] bg-white p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#b9c9be] hover:shadow-[0_14px_35px_rgba(39,73,60,0.09)]"
    >
      <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-[#f0f5ef] transition duration-300 group-hover:scale-125" />

      <div className="relative z-10">
        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3ed] text-[#174d3d] transition group-hover:bg-[#174d3d] group-hover:text-white">
          <Icon name={icon} size={18} />
        </div>

        <h4 className="text-[12px] font-semibold text-[#173d32]">
          {title}
        </h4>

        <p className="mt-1 text-[10px] leading-5 text-[#7d8982]">
          {text}
        </p>

        <div className="mt-4 flex items-center gap-1 text-[9px] font-semibold text-[#174d3d] opacity-0 transition group-hover:opacity-100">
          Open
          <Icon name="arrow" size={11} />
        </div>
      </div>
    </button>
  );
}

function ProjectCard({ project, onOpen }) {
  return (
    <div className="group overflow-hidden rounded-[21px] border border-[#e0e5df] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#cbd7cd] hover:shadow-[0_18px_40px_rgba(39,73,60,0.10)]">
      {/* IMAGE */}
      <div className="relative h-[190px] overflow-hidden bg-[#edf3ed]">
        {project.image ? (
          <>
            <img
              src={project.image}
              alt={project.name}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#789084]">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Icon name="plan" size={21} />
              </div>

              <p className="text-[10px] font-medium">
                Floor Plan Preview
              </p>
            </div>
          </div>
        )}

        <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-[8px] font-medium text-white backdrop-blur-md">
          House Design
        </div>
      </div>

      {/* DETAILS */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="truncate font-serif text-[17px] font-semibold text-[#173d32]">
              {project.name}
            </h4>

            <p className="mt-1 text-[10px] text-[#78847d]">
              {project.size} · {project.rooms}
            </p>
          </div>

          <button className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#829087] transition hover:bg-[#f0f4ef]">
            •••
          </button>
        </div>

        <p className="mt-3 text-[9px] text-[#9aa39e]">
          {project.edited}
        </p>

        <button
          onClick={onOpen}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#cbd8ce] py-2.5 text-[10px] font-semibold text-[#174d3d] transition hover:bg-[#edf3ed]"
        >
          Open Project
          <Icon name="arrow" size={12} />
        </button>
      </div>
    </div>
  );
}

function EmptyProjects({ hasSearch, onCreate }) {
  return (
    <div className="relative overflow-hidden rounded-[22px] border border-dashed border-[#cbd5cc] bg-white px-6 py-14 text-center">
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#f2f6f1]" />
      <div className="absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-[#f5f7f3]" />

      <div className="relative z-10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#edf3ed] text-[#174d3d]">
          <Icon name="plan" size={26} />
        </div>

        <p className="font-serif text-[21px] font-semibold text-[#173d32]">
          {hasSearch ? "No projects found" : "Your workspace is ready"}
        </p>

        <p className="mx-auto mt-2 max-w-[390px] text-[11px] leading-6 text-[#718078]">
          {hasSearch
            ? "Try searching with another project name."
            : "Create your first floor plan and your saved design will appear here automatically."}
        </p>

        {!hasSearch && (
          <button
            onClick={onCreate}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#174d3d] px-5 py-2.5 text-[10px] font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#103d30]"
          >
            <Icon name="plus" size={13} />
            Create New Project
          </button>
        )}
      </div>
    </div>
  );
}

function SmallStat({ title, value, icon }) {
  return (
    <div className="group flex items-center gap-4 rounded-[19px] border border-[#e0e5df] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(39,73,60,0.06)]">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf3ed] text-[#174d3d] transition group-hover:bg-[#174d3d] group-hover:text-white">
        <Icon name={icon} size={18} />
      </div>

      <div>
        <p className="text-[10px] text-[#7d8982]">
          {title}
        </p>

        <p className="mt-0.5 font-serif text-[25px] font-semibold text-[#173d32]">
          {value}
        </p>
      </div>
    </div>
  );
}

function MobileNav({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex min-w-[48px] flex-col items-center gap-1 rounded-xl px-2 py-1.5 transition ${
        active
          ? "text-[#174d3d]"
          : "text-[#8b9690] hover:text-[#174d3d]"
      }`}
    >
      <Icon name={icon} size={17} />
      <span className="text-[7px] font-medium">{label}</span>
    </button>
  );
}