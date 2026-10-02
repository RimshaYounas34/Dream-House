import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteAdminProject,
  getAdminProject,
  getAdminProjects,
} from "../services/adminApi";

/* =========================================================
   ICONS + SIDEBAR (AdminDashboard jaisa hi look)
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
        <path d="m20 20-3.5-3.5" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
        <path d="M10 11v6M14 11v6" />
      </>
    ),
    close: <path d="M6 6l12 12M18 6 6 18" />,
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

function AdminSidebar({ navigate, active, logout }) {
  const menu = [
    { label: "Dashboard", icon: "grid", path: "/admin" },
    { label: "Users", icon: "users", path: "/admin/users" },
    { label: "Projects", icon: "plan", path: "/admin/projects" },
    { label: "Templates", icon: "template", path: "/templates" },
    { label: "AI Usage", icon: "ai", path: "/admin/ai-usage" },
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
          <div className="font-serif text-[17px] font-semibold">DreamHouse</div>
          <div className="text-[8px] uppercase tracking-[3px] text-white/45">Admin</div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-7">
        <div className="mb-3 px-3 text-[9px] uppercase tracking-[2px] text-white/35">
          Administration
        </div>

        <div className="space-y-1.5">
          {menu.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[12px] transition ${
                active === item.path
                  ? "bg-[#28564a] text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </button>
          ))}
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
   HELPERS
========================================================= */

const TYPE_FILTERS = ["All", "2D", "3D", "AI", "Template"];
const PAGE_SIZE = 10;

const TYPE_STYLES = {
  AI: "bg-[#efe9fb] text-[#5b3f9a]",
  Template: "bg-[#fdf1dc] text-[#92611a]",
  "2D": "bg-[#e8f0e9] text-[#174d3d]",
  "3D": "bg-[#e1eef7] text-[#25618a]",
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "—";

const initialsOf = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "U";

function TypeBadge({ children }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[8px] font-semibold ${
        TYPE_STYLES[children] || TYPE_STYLES["2D"]
      }`}
    >
      {children}
    </span>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function AdminProjects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const requestId = useRef(0);

  const logout = () => {
    [
      "dreamhouse_token",
      "dreamhouse_user",
      "dreamhouse_logged_in",
      "dreamhouse_role",
      "dreamhouse_name",
    ].forEach((key) => localStorage.removeItem(key));
    navigate("/login");
  };

  // Token na ho to seedha login par bhej do
  useEffect(() => {
    if (!localStorage.getItem("dreamhouse_token")) navigate("/login");
  }, [navigate]);

  // Search ke liye 400ms debounce taake har key par request na jaye
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const load = useCallback(async () => {
    const current = ++requestId.current;
    setLoading(true);
    setError("");

    try {
      const response = await getAdminProjects({
        search: debouncedSearch,
        type: typeFilter,
        page,
        limit: PAGE_SIZE,
      });

      if (current !== requestId.current) return; // purani request ka jawab ignore
      setProjects(response.data || []);
      setPagination(response.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      if (current !== requestId.current) return;
      if (/admin access|authentication|expired|invalid/i.test(err.message)) {
        logout();
        return;
      }
      setError(err.message || "Could not load projects.");
    } finally {
      if (current === requestId.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, typeFilter, page]);

  useEffect(() => {
    load();
  }, [load]);

  const openDetails = async (project) => {
    setSelected({ ...project, floorPlanData: null });
    setDetailLoading(true);

    try {
      const response = await getAdminProject(project.id);
      setSelected(response.data);
    } catch (err) {
      setError(err.message || "Could not load project details.");
      setSelected(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const removeProject = async (project) => {
    const confirmed = window.confirm(
      `Delete "${project.name}"? Its version history will be removed too. This cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(project.id);
    try {
      await deleteAdminProject(project.id);
      setSelected(null);
      // Aakhri item delete hua to pichle page par chalo
      if (projects.length === 1 && page > 1) setPage(page - 1);
      else await load();
    } catch (err) {
      setError(err.message || "Could not delete the project.");
    } finally {
      setDeletingId(null);
    }
  };

  const plan = selected?.floorPlanData;

  return (
    <div className="min-h-screen bg-[#f4f3eb] text-[#173d32]">
      <AdminSidebar navigate={navigate} active="/admin/projects" logout={logout} />

      <main className="min-h-screen lg:ml-[245px]">
        {/* TOP BAR */}
        <header className="flex h-[76px] items-center justify-between border-b border-[#d9dfd8] bg-[#f8f7f1] px-6 sm:px-8">
          <div>
            <p className="text-[9px] uppercase tracking-[2px] text-[#738079]">Administration</p>
            <h1 className="font-serif text-[21px] font-semibold">Projects</h1>
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
          <div className="mb-6">
            <h2 className="font-serif text-[27px] font-semibold">All projects</h2>
            <p className="mt-1 text-[11px] text-[#718078]">
              Every floor plan created by your users. Open one to see its details or delete it.
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-[#f0c9c4] bg-[#fdf1ef] px-4 py-3 text-[11px] text-[#9a3a30]">
              <span>{error}</span>
              <button onClick={load} className="font-semibold underline">
                Try again
              </button>
            </div>
          )}

          <section className="overflow-hidden rounded-2xl border border-[#dce2db] bg-white">
            {/* TOOLBAR */}
            <div className="flex flex-col gap-3 border-b border-[#edf0eb] p-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative w-full xl:max-w-[390px]">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8b958f]">
                  <Icon name="search" size={16} />
                </div>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by project name..."
                  className="w-full rounded-xl border border-[#dfe5df] bg-[#fafbf8] py-3 pl-10 pr-4 text-[11px] text-[#173d32] outline-none transition placeholder:text-[#9aa39e] focus:border-[#6f9487]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {TYPE_FILTERS.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setTypeFilter(type);
                      setPage(1);
                    }}
                    className={`rounded-full px-4 py-2 text-[10px] font-semibold transition ${
                      typeFilter === type
                        ? "bg-[#173d32] text-white"
                        : "bg-[#f0f3ee] text-[#526158] hover:bg-[#e4eae3]"
                    }`}
                  >
                    {type === "All" ? "All types" : type}
                  </button>
                ))}
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse">
                <thead>
                  <tr className="border-b border-[#edf0eb] bg-[#fafbf8] text-left">
                    <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[1px] text-[#89938d]">Project</th>
                    <th className="px-4 py-4 text-[9px] font-semibold uppercase tracking-[1px] text-[#89938d]">Owner</th>
                    <th className="px-4 py-4 text-[9px] font-semibold uppercase tracking-[1px] text-[#89938d]">Type</th>
                    <th className="px-4 py-4 text-[9px] font-semibold uppercase tracking-[1px] text-[#89938d]">Rooms</th>
                    <th className="px-4 py-4 text-[9px] font-semibold uppercase tracking-[1px] text-[#89938d]">Created</th>
                    <th className="px-5 py-4 text-right text-[9px] font-semibold uppercase tracking-[1px] text-[#89938d]">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading &&
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index} className="border-b border-[#f0f2ee]">
                        {Array.from({ length: 6 }).map((__, cell) => (
                          <td key={cell} className="px-5 py-5">
                            <div className="h-3 w-full max-w-[120px] animate-pulse rounded bg-[#edf0eb]" />
                          </td>
                        ))}
                      </tr>
                    ))}

                  {!loading &&
                    projects.map((project) => (
                      <tr key={project.id} className="border-b border-[#f0f2ee] transition hover:bg-[#fafbf8]">
                        <td className="px-5 py-4">
                          <p className="text-[11px] font-semibold">{project.name}</p>
                          {project.description && (
                            <p className="mt-0.5 max-w-[260px] truncate text-[9px] text-[#8a948e]">
                              {project.description}
                            </p>
                          )}
                        </td>

                        <td className="px-4 py-4">
                          {project.user ? (
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6eee7] text-[9px] font-semibold text-[#174d3d]">
                                {initialsOf(project.user.name)}
                              </div>
                              <div>
                                <p className="text-[10px] font-semibold">{project.user.name}</p>
                                <p className="text-[9px] text-[#8a948e]">{project.user.email}</p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] text-[#9aa39e]">Deleted user</span>
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex gap-1.5">
                            <TypeBadge>{project.type}</TypeBadge>
                            {project.has3D && <TypeBadge>3D</TypeBadge>}
                          </div>
                        </td>

                        <td className="px-4 py-4 text-[10px] text-[#526158]">{project.rooms}</td>
                        <td className="px-4 py-4 text-[10px] text-[#526158]">{formatDate(project.createdAt)}</td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openDetails(project)}
                              title="View details"
                              aria-label={`View ${project.name}`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#dfe5df] text-[#526158] transition hover:bg-[#eef3ee]"
                            >
                              <Icon name="eye" size={14} />
                            </button>
                            <button
                              onClick={() => removeProject(project)}
                              disabled={deletingId === project.id}
                              title="Delete project"
                              aria-label={`Delete ${project.name}`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#f0d3cf] text-[#b04a3f] transition hover:bg-[#fdf1ef] disabled:opacity-40"
                            >
                              <Icon name="trash" size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {!loading && !error && projects.length === 0 && (
                <div className="px-5 py-14 text-center">
                  <p className="font-serif text-[16px] font-semibold">No projects found</p>
                  <p className="mt-1 text-[10px] text-[#8a948e]">
                    {debouncedSearch || typeFilter !== "All"
                      ? "Try a different search or clear the type filter."
                      : "Projects will appear here as soon as users save a floor plan."}
                  </p>
                </div>
              )}
            </div>

            {/* PAGINATION */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf0eb] px-5 py-4">
              <p className="text-[10px] text-[#8a948e]">
                {pagination.total} project{pagination.total === 1 ? "" : "s"}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page <= 1 || loading}
                  className="rounded-lg border border-[#dfe5df] px-3 py-2 text-[10px] font-semibold text-[#526158] transition hover:bg-[#eef3ee] disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="px-2 text-[10px] text-[#526158]">
                  Page {pagination.page} of {Math.max(pagination.pages, 1)}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= pagination.pages || loading}
                  className="rounded-lg border border-[#dfe5df] px-3 py-2 text-[10px] font-semibold text-[#526158] transition hover:bg-[#eef3ee] disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* DETAILS DRAWER */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-[#092f27]/40"
          onClick={() => setSelected(null)}
        >
          <aside
            role="dialog"
            aria-label="Project details"
            onClick={(event) => event.stopPropagation()}
            className="h-full w-full max-w-[420px] overflow-y-auto bg-[#fbfaf5] p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-serif text-[22px] font-semibold">{selected.name}</h3>
                <div className="mt-2 flex gap-1.5">
                  <TypeBadge>{selected.type}</TypeBadge>
                  {selected.has3D && <TypeBadge>3D</TypeBadge>}
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#dfe5df] text-[#526158] hover:bg-[#eef3ee]"
              >
                <Icon name="close" size={14} />
              </button>
            </div>

            {selected.description && (
              <p className="mt-4 text-[11px] leading-5 text-[#56645c]">{selected.description}</p>
            )}

            <dl className="mt-6 divide-y divide-[#e8ece6] rounded-2xl border border-[#dce2db] bg-white text-[11px]">
              <Row label="Owner" value={selected.user ? `${selected.user.name} (${selected.user.email})` : "Deleted user"} />
              <Row label="Created" value={formatDate(selected.createdAt)} />
              <Row label="Last updated" value={formatDate(selected.updatedAt)} />
              <Row label="Rooms" value={selected.rooms} />
              {detailLoading && <Row label="Plan data" value="Loading…" />}
              {plan && (
                <>
                  <Row
                    label="Plot size"
                    value={`${plan.project?.plotWidth ?? "—"} × ${plan.project?.plotLength ?? "—"} ${plan.project?.units || "ft"}`}
                  />
                  <Row label="Floors" value={plan.project?.floors ?? 1} />
                  <Row label="Doors" value={plan.doors?.length || 0} />
                  <Row label="Windows" value={plan.windows?.length || 0} />
                  <Row label="Furniture items" value={plan.furniture?.length || 0} />
                </>
              )}
            </dl>

            {plan?.rooms?.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 text-[10px] font-semibold text-[#56645c]">Rooms in this plan</p>
                <div className="flex flex-wrap gap-1.5">
                  {plan.rooms.map((room, index) => (
                    <span
                      key={room.id || index}
                      className="rounded-full bg-[#eaf0e9] px-3 py-1 text-[9px] font-medium text-[#315348]"
                    >
                      {room.name || room.type}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => removeProject(selected)}
              disabled={deletingId === selected.id}
              className="mt-8 w-full rounded-xl border border-[#f0d3cf] bg-[#fdf1ef] px-4 py-3 text-[11px] font-semibold text-[#b04a3f] transition hover:bg-[#fae3df] disabled:opacity-50"
            >
              {deletingId === selected.id ? "Deleting…" : "Delete project"}
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <dt className="text-[#8a948e]">{label}</dt>
      <dd className="text-right font-medium text-[#173d32]">{value}</dd>
    </div>
  );
}
