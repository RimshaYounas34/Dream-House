import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Icon = ({ name, size = 18 }) => {
  const paths = {
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
      </>
    ),

    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),

    ai: (
      <>
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
        <path d="m5.6 5.6 2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
        <circle cx="12" cy="12" r="4" />
      </>
    ),

    website: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </>
    ),

    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),

    save: (
      <>
        <path d="M5 3h12l3 3v15H5z" />
        <path d="M8 3v6h8V3M8 21v-7h8v7" />
      </>
    ),

    back: (
      <>
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
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

export default function AdminSettings() {
  const navigate = useNavigate();

  const [adminName, setAdminName] = useState(
    localStorage.getItem("dreamhouse_admin_name") || "Administrator"
  );

  const [adminEmail, setAdminEmail] = useState(
    localStorage.getItem("dreamhouse_admin_email") ||
      "admin@dreamhouse.com"
  );

  const [aiEnabled, setAiEnabled] = useState(
    localStorage.getItem("dreamhouse_admin_ai") !== "false"
  );

  const [notifications, setNotifications] = useState(
    localStorage.getItem("dreamhouse_admin_notifications") !== "false"
  );

  const [maintenance, setMaintenance] = useState(
    localStorage.getItem("dreamhouse_maintenance") === "true"
  );

  const [saved, setSaved] = useState(false);

  const saveSettings = () => {
    localStorage.setItem("dreamhouse_admin_name", adminName);
    localStorage.setItem("dreamhouse_admin_email", adminEmail);
    localStorage.setItem(
      "dreamhouse_admin_ai",
      String(aiEnabled)
    );
    localStorage.setItem(
      "dreamhouse_admin_notifications",
      String(notifications)
    );
    localStorage.setItem(
      "dreamhouse_maintenance",
      String(maintenance)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f4f3eb] text-[#173d32]">
      {/* SIDEBAR */}
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
            <SidebarItem
              label="Dashboard"
              path="/admin"
              navigate={navigate}
            />

            <SidebarItem
              label="Users"
              path="/admin/users"
              navigate={navigate}
            />

            <SidebarItem
              label="Projects"
              path="/admin/projects"
              navigate={navigate}
            />

            <SidebarItem
              label="AI Usage"
              path="/admin/ai-usage"
              navigate={navigate}
            />

            <SidebarItem
              label="Reports"
              path="/admin/reports"
              navigate={navigate}
            />

            <button className="flex w-full items-center gap-3 rounded-xl bg-[#28564a] px-3 py-3 text-left text-[12px] text-white">
              <span className="text-base">⚙</span>
              Settings
            </button>
          </div>

          <div className="mb-3 mt-9 px-3 text-[9px] uppercase tracking-[2px] text-white/35">
            Website
          </div>

          <button
            onClick={() => navigate("/")}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[12px] text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            <span>⌂</span>
            Home
          </button>
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            onClick={() => {
              localStorage.removeItem("dreamhouse_logged_in");
              localStorage.removeItem("dreamhouse_role");
              navigate("/login");
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[12px] text-white/60 hover:bg-white/5 hover:text-white"
          >
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="min-h-screen lg:ml-[245px]">
        <header className="flex h-[76px] items-center justify-between border-b border-[#d9dfd8] bg-[#f8f7f1] px-6 sm:px-8">
          <div>
            <p className="text-[9px] uppercase tracking-[2px] text-[#738079]">
              Administration
            </p>

            <h1 className="font-serif text-[21px] font-semibold">
              Admin Settings
            </h1>
          </div>

          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 rounded-xl border border-[#d9dfd8] bg-white px-4 py-2.5 text-[10px] font-semibold text-[#174d3d] hover:bg-[#f0f3ed]"
          >
            <Icon name="back" size={14} />
            Back to Dashboard
          </button>
        </header>

        <div className="p-5 sm:p-7 xl:p-9">
          <div className="mb-7">
            <h2 className="font-serif text-[28px] font-semibold">
              Admin Settings
            </h2>

            <p className="mt-1 text-[11px] text-[#718078]">
              Manage administrator profile, AI controls and website settings.
            </p>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            {/* ADMIN PROFILE */}
            <SettingsCard
              icon="user"
              title="Administrator Profile"
              description="Update your admin account information."
            >
              <div className="space-y-4">
                <Field
                  label="Administrator Name"
                  value={adminName}
                  onChange={setAdminName}
                />

                <Field
                  label="Admin Email"
                  value={adminEmail}
                  onChange={setAdminEmail}
                  type="email"
                />
              </div>
            </SettingsCard>

            {/* SECURITY */}
            <SettingsCard
              icon="lock"
              title="Security"
              description="Manage administrator security settings."
            >
              <div className="space-y-3">
                <button className="w-full rounded-xl border border-[#dce2db] bg-[#fafbf8] px-4 py-3 text-left text-[11px] font-semibold text-[#173d32] hover:bg-[#f1f4ef]">
                  Change Admin Password
                </button>

                <button className="w-full rounded-xl border border-[#dce2db] bg-[#fafbf8] px-4 py-3 text-left text-[11px] font-semibold text-[#173d32] hover:bg-[#f1f4ef]">
                  Two-Factor Authentication
                </button>

                <p className="text-[9px] leading-5 text-[#859089]">
                  These controls are currently frontend settings. Real
                  authentication and security should later be connected to
                  Supabase Auth.
                </p>
              </div>
            </SettingsCard>

            {/* AI SETTINGS */}
            <SettingsCard
              icon="ai"
              title="AI Settings"
              description="Control AI features across the platform."
            >
              <Toggle
                label="Enable AI Planner"
                description="Allow users to generate AI floor plans."
                checked={aiEnabled}
                onChange={setAiEnabled}
              />

              <Toggle
                label="AI Notifications"
                description="Receive notifications about AI usage."
                checked={notifications}
                onChange={setNotifications}
              />
            </SettingsCard>

            {/* WEBSITE SETTINGS */}
            <SettingsCard
              icon="website"
              title="Website Settings"
              description="Manage general website behavior."
            >
              <Toggle
                label="Maintenance Mode"
                description="Temporarily disable access for normal users."
                checked={maintenance}
                onChange={setMaintenance}
              />

              <div className="mt-5 rounded-xl bg-[#edf3ed] p-4">
                <p className="text-[10px] font-semibold text-[#174d3d]">
                  Current Environment
                </p>

                <p className="mt-1 text-[9px] text-[#718078]">
                  Frontend / Local Storage
                </p>
              </div>
            </SettingsCard>
          </div>

          {/* SAVE */}
          <div className="mt-5 flex justify-end">
            <button
              onClick={saveSettings}
              className="flex items-center gap-2 rounded-xl bg-[#173d32] px-6 py-3 text-[11px] font-semibold text-white transition hover:bg-[#28564a]"
            >
              <Icon name="save" size={15} />
              {saved ? "Settings Saved ✓" : "Save Settings"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ label, path, navigate }) {
  return (
    <button
      onClick={() => navigate(path)}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[12px] text-white/60 transition hover:bg-white/5 hover:text-white"
    >
      <span className="text-base">
        {label === "Dashboard" && "▦"}
        {label === "Users" && "♙"}
        {label === "Projects" && "▤"}
        {label === "AI Usage" && "✦"}
        {label === "Reports" && "▥"}
      </span>

      {label}
    </button>
  );
}

function SettingsCard({ icon, title, description, children }) {
  return (
    <section className="rounded-2xl border border-[#dce2db] bg-white p-5">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3ed] text-[#174d3d]">
          <Icon name={icon} size={18} />
        </div>

        <div>
          <h3 className="font-serif text-[18px] font-semibold">
            {title}
          </h3>

          <p className="mt-1 text-[10px] text-[#819087]">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-semibold text-[#56645c]">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#dce2db] bg-[#fafbf8] px-4 py-3 text-[11px] text-[#173d32] outline-none transition focus:border-[#7b9b8d] focus:ring-2 focus:ring-[#dce8df]"
      />
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#edf0eb] py-4 last:border-b-0">
      <div className="pr-5">
        <p className="text-[11px] font-semibold text-[#173d32]">
          {label}
        </p>

        <p className="mt-1 text-[9px] leading-4 text-[#849089]">
          {description}
        </p>
      </div>

      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-[#173d32]" : "bg-[#cbd3cc]"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}