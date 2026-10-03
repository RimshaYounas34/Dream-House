
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const menu = [
  { label: "Dashboard", icon: "▦", path: "/admin" },
  { label: "Users", icon: "♙", path: "/admin/users" },
  { label: "Projects", icon: "⌂", path: "/admin/projects" },
  { label: "Templates", icon: "▤", path: "/templates" },
  { label: "AI Usage", icon: "✦", path: "/admin/ai-usage" },
  { label: "Reports", icon: "◒", path: "/admin/reports" },
  { label: "Settings", icon: "⚙", path: "/settings" },
];

function getProjects() {
  try {
    const data = JSON.parse(
      localStorage.getItem("dreamhouse_projects") || "[]"
    );

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveProjects(projects) {
  localStorage.setItem(
    "dreamhouse_projects",
    JSON.stringify(projects)
  );

  window.dispatchEvent(
    new Event("dreamhouse-projects-updated")
  );
}

export default function Projects() {
  const location = useLocation();

  const [projects, setProjects] = useState(getProjects);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const refresh = () => {
      setProjects(getProjects());
    };

    window.addEventListener("storage", refresh);
    window.addEventListener(
      "dreamhouse-projects-updated",
      refresh
    );

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(
        "dreamhouse-projects-updated",
        refresh
      );
    };
  }, []);

  const filteredProjects = projects.filter((project) => {
    const name = String(
      project.name || "Dream House"
    ).toLowerCase();

    const matchesSearch = name.includes(
      search.toLowerCase()
    );

    const isAI =
      project.generatedByAI === true ||
      project.source === "ai-planner";

    const matchesFilter =
      filter === "all"
        ? true
        : filter === "ai"
        ? isAI
        : filter === "manual"
        ? !isAI
        : filter === "3d"
        ? project.has3D === true ||
          project.viewed3D === true ||
          project.threeD === true
        : true;

    return matchesSearch && matchesFilter;
  });

  const totalProjects = projects.length;

  const aiProjects = projects.filter(
    (project) =>
      project.generatedByAI === true ||
      project.source === "ai-planner"
  ).length;

  const manualProjects =
    totalProjects - aiProjects;

  const threeDProjects = projects.filter(
    (project) =>
      project.has3D === true ||
      project.viewed3D === true ||
      project.threeD === true
  ).length;

  const deleteProject = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    const updated = projects.filter(
      (project) => project.id !== id
    );

    setProjects(updated);
    saveProjects(updated);
  };

  return (
    <div className="min-h-screen bg-[#f3f0e5] text-[#173d32]">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 z-30 flex h-screen w-[250px] flex-col bg-[#12382e] text-white shadow-2xl">
        <div className="border-b border-white/10 px-7 py-7">
          <Link to="/" className="block">
            <div className="font-serif text-[26px]">
              DreamHouse
            </div>

            <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9ebbae]">
              Admin Panel
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6">
          <p className="px-4 pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#78998b]">
            Main Menu
          </p>

          <div className="space-y-1.5">
            {menu.map((item) => {
              const active =
                location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-[13px] transition ${
                    active
                      ? "bg-[#a9c7b7] font-semibold text-[#12382e]"
                      : "text-[#d7e3dd] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-xl text-[15px] ${
                      active
                        ? "bg-[#12382e] text-white"
                        : "bg-white/10 text-[#a9c5b8]"
                    }`}
                  >
                    {item.icon}
                  </span>

                  <span>{item.label}</span>

                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#12382e]" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-2xl bg-[#1c493b] px-4 py-3 transition hover:bg-[#285b4c]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#315f50]">
              ↗
            </span>

            <div>
              <div className="text-[12px] font-medium">
                Visit Website
              </div>

              <div className="text-[10px] text-[#91b1a4]">
                Back to DreamHouse
              </div>
            </div>
          </Link>
        </div>
      </aside>

      {/* MAIN */}
      <main className="ml-[250px] min-h-screen">
        {/* HEADER */}
        <header className="sticky top-0 z-20 border-b border-[#d5ddd5] bg-[#f3f0e5]/95 px-8 py-5 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#668276]">
                Admin Management
              </p>

              <h1 className="mt-1 font-serif text-[32px] leading-none">
                Projects
              </h1>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#12382e] text-sm font-semibold text-white">
              A
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* HERO */}
          <section className="relative overflow-hidden rounded-[28px] bg-[#174235] p-7 text-white shadow-xl">
            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#8eb6a3]/20 blur-2xl" />

            <div className="relative">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c9ddd3]">
                <span>⌂</span>
                Project Management
              </div>

              <h2 className="font-serif text-[32px]">
                Manage DreamHouse projects.
              </h2>

              <p className="mt-3 max-w-2xl text-[13px] leading-6 text-[#c5d8d0]">
                View saved house plans, identify AI-generated projects,
                check 3D projects and manage all user-created plans.
              </p>
            </div>
          </section>

          {/* STATS */}
          <section className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Projects"
              value={totalProjects}
              icon="⌂"
            />

            <StatCard
              title="AI Projects"
              value={aiProjects}
              icon="✦"
            />

            <StatCard
              title="Manual Projects"
              value={manualProjects}
              icon="✎"
            />

            <StatCard
              title="3D Projects"
              value={threeDProjects}
              icon="◈"
            />
          </section>

          {/* SEARCH + FILTER */}
          <section className="mt-7 rounded-[24px] border border-[#d4ddd4] bg-[#fbfaf4] p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative max-w-md flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#789086]">
                  ⌕
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search projects..."
                  className="w-full rounded-xl border border-[#d1ddd3] bg-[#f2f4ed] py-3 pl-10 pr-4 text-[12px] text-[#31574a] outline-none transition focus:border-[#6e9c88]"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  ["all", "All"],
                  ["ai", "AI Generated"],
                  ["manual", "Manual"],
                  ["3d", "3D"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setFilter(value)}
                    className={`rounded-xl px-4 py-2.5 text-[10px] font-bold transition ${
                      filter === value
                        ? "bg-[#173f34] text-white"
                        : "bg-[#e4ece4] text-[#567266] hover:bg-[#d6e3d8]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* PROJECTS */}
          <section className="mt-6 rounded-[26px] border border-[#d4ddd4] bg-[#fbfaf4] p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#789086]">
                  Saved Plans
                </p>

                <h3 className="mt-1 font-serif text-[24px]">
                  All Projects
                </h3>
              </div>

              <span className="rounded-full bg-[#dce9e1] px-3 py-1.5 text-[10px] font-bold text-[#315c4d]">
                {filteredProjects.length} Projects
              </span>
            </div>

            {filteredProjects.length > 0 ? (
              <div className="mt-6 overflow-hidden rounded-2xl border border-[#dce3dc]">
                {/* TABLE HEADER */}
                <div className="hidden grid-cols-[1.5fr_1fr_1fr_100px_80px] bg-[#e7eee7] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#678076] md:grid">
                  <span>Project</span>
                  <span>Type</span>
                  <span>Date</span>
                  <span>Status</span>
                  <span />
                </div>

                {filteredProjects.map((project, index) => {
                  const isAI =
                    project.generatedByAI === true ||
                    project.source === "ai-planner";

                  const is3D =
                    project.has3D === true ||
                    project.viewed3D === true ||
                    project.threeD === true;

                  const date =
                    project.savedAt ||
                    project.createdAt;

                  return (
                    <div
                      key={
                        project.id ||
                        project._id ||
                        `project-${index}`
                      }
                      className="grid gap-4 border-t border-[#e1e6e0] px-5 py-5 md:grid-cols-[1.5fr_1fr_1fr_100px_80px] md:items-center"
                    >
                      {/* PROJECT */}
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#173f34] text-lg text-white">
                          ⌂
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-[12px] font-bold text-[#294f43]">
                            {project.name ||
                              "Dream House"}
                          </p>

                          <p className="mt-0.5 text-[9px] text-[#7a8f85]">
                            {project.userName ||
                              project.email ||
                              "DreamHouse User"}
                          </p>
                        </div>
                      </div>

                      {/* TYPE */}
                      <div>
                        <span
                          className={`rounded-full px-3 py-1.5 text-[9px] font-bold ${
                            isAI
                              ? "bg-[#d7e7dd] text-[#315c4d]"
                              : "bg-[#e8e5d9] text-[#756d5c]"
                          }`}
                        >
                          {isAI
                            ? "AI Generated"
                            : "Manual"}
                        </span>

                        {is3D && (
                          <span className="ml-1 rounded-full bg-[#dce5ef] px-2 py-1.5 text-[9px] font-bold text-[#48627a]">
                            3D
                          </span>
                        )}
                      </div>

                      {/* DATE */}
                      <div className="text-[10px] text-[#71857c]">
                        {date
                          ? new Date(
                              date
                            ).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "No date"}
                      </div>

                      {/* STATUS */}
                      <div>
                        <span className="rounded-full bg-[#dce9e1] px-3 py-1.5 text-[9px] font-bold text-[#315c4d]">
                          Saved
                        </span>
                      </div>

                      {/* DELETE */}
                      <div>
                        <button
                          onClick={() =>
                            deleteProject(
                              project.id ||
                                project._id
                            )
                          }
                          className="rounded-xl bg-[#f1dddd] px-3 py-2 text-[10px] font-bold text-[#a04d4d] transition hover:bg-[#ead0d0]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyProjects />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="relative overflow-hidden rounded-[24px] bg-[#dce8dd] p-5 shadow-sm">
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/40" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#678076]">
            {title}
          </p>

          <p className="mt-3 font-serif text-[36px] leading-none text-[#173d32]">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 text-lg text-[#315c4d]">
          {icon}
        </div>
      </div>
    </div>
  );
}

function EmptyProjects() {
  return (
    <div className="mt-6 rounded-[22px] border border-dashed border-[#b9cabd] bg-[#e9efe8] px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#173f34] text-xl text-white">
        ⌂
      </div>

      <h4 className="mt-4 font-serif text-[21px] text-[#173d32]">
        No projects found
      </h4>

      <p className="mt-2 text-[11px] text-[#71857c]">
        Saved DreamHouse projects will appear here automatically.
      </p>
    </div>
  );
}
