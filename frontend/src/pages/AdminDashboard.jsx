import { useNavigate } from "react-router-dom";

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

export default function AdminDashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("dreamhouse_logged_in");
    localStorage.removeItem("dreamhouse_role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f4f3eb] text-[#173d32]">
      <AdminSidebar
        navigate={navigate}
        active="/admin"
        logout={logout}
      />

      <main className="min-h-screen lg:ml-[245px]">
        {/* TOP */}
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
          <div className="mb-7">
            <h2 className="font-serif text-[27px] font-semibold">
              Good Morning, Admin 👋
            </h2>

            <p className="mt-1 text-[11px] text-[#718078]">
              Here's what's happening with DreamHouse Planner today.
            </p>
          </div>

          {/* STAT CARDS */}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStat
              title="Total Users"
              value="1,820"
              change="+12%"
              icon="users"
            />

            <AdminStat
              title="Total Projects"
              value="634"
              change="+8%"
              icon="plan"
            />

            <AdminStat
              title="3D Projects"
              value="412"
              change="+15%"
              icon="cube"
            />

            <AdminStat
              title="AI Requests"
              value="1,820"
              change="+20%"
              icon="ai"
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
                  onClick={() => navigate("/admin/users")}
                  className="text-[10px] font-semibold text-[#174d3d]"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-3">
                <UserRow
                  name="Ayesha Khan"
                  email="ayesha@gmail.com"
                  projects="4 projects"
                  avatar="AK"
                />

                <UserRow
                  name="Hassan Ali"
                  email="hassan@gmail.com"
                  projects="7 projects"
                  avatar="HA"
                />

                <UserRow
                  name="Rimsha Tariq"
                  email="rimsha@gmail.com"
                  projects="3 projects"
                  avatar="RT"
                />

                <UserRow
                  name="Sara Ahmed"
                  email="sara@gmail.com"
                  projects="5 projects"
                  avatar="SA"
                />
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
                  onClick={() => navigate("/admin/projects")}
                  className="text-[10px] font-semibold text-[#174d3d]"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-3">
                <ProjectRow
                  name="Modern Villa"
                  user="Ayesha Khan"
                  type="3D"
                />

                <ProjectRow
                  name="Family House"
                  user="Hassan Ali"
                  type="2D"
                />

                <ProjectRow
                  name="Dream Home"
                  user="Rimsha Tariq"
                  type="AI"
                />

                <ProjectRow
                  name="Minimal House"
                  user="Sara Ahmed"
                  type="3D"
                />
              </div>
            </section>
          </div>

          {/* ANALYTICS */}
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <section className="rounded-2xl border border-[#dce2db] bg-white p-5">
              <h3 className="font-serif text-[18px] font-semibold">
                Project Growth
              </h3>

              <p className="mt-1 text-[10px] text-[#819087]">
                Projects created this month
              </p>

              <div className="mt-6 flex h-[170px] items-end gap-3 border-b border-[#e5e8e3] px-2">
                {[38, 62, 48, 75, 66, 92, 78, 100, 84, 112, 96, 126].map(
                  (height, index) => (
                    <div
                      key={index}
                      className="flex flex-1 items-end justify-center"
                    >
                      <div
                        className="w-full max-w-[26px] rounded-t-lg bg-[#1d5544]"
                        style={{ height }}
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

function AdminStat({ title, value, change, icon }) {
  return (
    <div className="rounded-2xl border border-[#dce2db] bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] text-[#7c8981]">{title}</p>

          <p className="mt-2 font-serif text-[28px] font-semibold text-[#173d32]">
            {value}
          </p>

          <p className="mt-1 text-[9px] font-semibold text-[#3d8065]">
            {change} this month
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3ed] text-[#174d3d]">
          <Icon name={icon} size={18} />
        </div>
      </div>
    </div>
  );
}

function UserRow({ name, email, projects, avatar }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#edf0eb] p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e6eee7] text-[9px] font-semibold text-[#174d3d]">
          {avatar}
        </div>

        <div>
          <p className="text-[11px] font-semibold">{name}</p>
          <p className="text-[9px] text-[#8a948e]">{email}</p>
        </div>
      </div>

      <span className="text-[9px] text-[#7c8981]">
        {projects}
      </span>
    </div>
  );
}

function ProjectRow({ name, user, type }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#edf0eb] p-3">
      <div>
        <p className="text-[11px] font-semibold">{name}</p>
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

function Activity({ label, value, width }) {
  return (
    <div>
      <div className="mb-2 flex justify-between">
        <span className="text-[10px] text-[#56645c]">{label}</span>
        <span className="text-[10px] font-semibold">{value}</span>
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