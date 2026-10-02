import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Icon({ name, size = 18 }) {
  const icons = {
    home: (
      <>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9 21v-6h6v6" />
      </>
    ),

    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),

    projects: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M8 4v16M16 4v16M3 10h5M16 14h5" />
      </>
    ),

    templates: (
      <>
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="3" width="8" height="8" rx="1" />
        <rect x="3" y="13" width="8" height="8" rx="1" />
        <rect x="13" y="13" width="8" height="8" rx="1" />
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

    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c.8-4 3.4-6 8-6s7.2 2 8 6" />
      </>
    ),

    ruler: (
      <>
        <path d="m4 17 13-13 4 4L8 21H4v-4Z" />
        <path d="m13 8 3 3M10 11l3 3M7 14l3 3" />
      </>
    ),

    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),

    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),

    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),

    logout: (
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M21 3v18" />
      </>
    ),

    save: (
      <>
        <path d="M5 3h12l3 3v15H4V3h1Z" />
        <path d="M8 3v6h8V3M8 21v-7h8v7" />
      </>
    ),

    check: <path d="m5 12 4 4L19 6" />,

    warning: (
      <>
        <path d="M12 3 2.5 20h19L12 3Z" />
        <path d="M12 9v5M12 17h.01" />
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
      {icons[name]}
    </svg>
  );
}

function Sidebar({ navigate, logout }) {
  const items = [
    {
      label: "Dashboard",
      icon: "dashboard",
      path: "/dashboard",
    },
    {
      label: "My Projects",
      icon: "projects",
      path: "/my-designs",
    },
    {
      label: "Templates",
      icon: "templates",
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
      active: true,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[245px] flex-col bg-[#123d32] text-white lg:flex">
      {/* LOGO */}
      <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-7">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef3e9] text-[#123d32]">
          <span className="text-xl">⌂</span>
        </div>

        <div>
          <div className="font-serif text-[17px] font-semibold">
            DreamHouse
          </div>

          <div className="text-[8px] uppercase tracking-[3px] text-white/50">
            Planner
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 py-7">
        <div className="mb-3 px-3 text-[9px] uppercase tracking-[2px] text-white/35">
          Menu
        </div>

        <div className="space-y-1.5">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[12px] transition ${
                item.active
                  ? "bg-[#315f50] text-white"
                  : "text-white/65 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </button>
          ))}
        </div>

        {/* WEBSITE */}
        <div className="mb-3 mt-9 px-3 text-[9px] uppercase tracking-[2px] text-white/35">
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
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[12px] text-white/65 transition hover:bg-white/5 hover:text-white"
        >
          <Icon name="logout" size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}

function SectionHeader({ icon, eyebrow, title, description }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e8f0e9] text-[#174d3d]">
        <Icon name={icon} size={17} />
      </div>

      <div>
        <p className="text-[8px] font-semibold uppercase tracking-[1.8px] text-[#8a958e]">
          {eyebrow}
        </p>

        <h2 className="mt-0.5 font-serif text-[20px] font-semibold text-[#173d32]">
          {title}
        </h2>

        <p className="mt-1 text-[10px] leading-5 text-[#7b877f]">
          {description}
        </p>
      </div>
    </div>
  );
}

function Toggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative h-6 w-11 rounded-full transition ${
        enabled ? "bg-[#174d3d]" : "bg-[#d6ddd7]"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
          enabled ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

function SelectField({
  label,
  value,
  onChange,
  children,
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[1px] text-[#738078]">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#dce2da] bg-[#fafbf8] px-3 py-2.5 text-[11px] text-[#31443b] outline-none transition focus:border-[#174d3d]"
      >
        {children}
      </select>
    </label>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[1px] text-[#738078]">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#dce2da] bg-[#fafbf8] px-3 py-2.5 text-[11px] text-[#31443b] outline-none placeholder:text-[#a5aea8] focus:border-[#174d3d]"
      />
    </label>
  );
}

export default function Settings() {
  const navigate = useNavigate();

  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [preferences, setPreferences] = useState({
    unit: "Feet",
    defaultFloors: "Ground + First Floor",
    defaultStyle: "Modern",
    defaultPlot: "30 × 60 ft",
  });

  const [aiSettings, setAiSettings] = useState({
    smartSuggestions: true,
    autoAnalysis: true,
    naturalLanguage: true,
  });

  const [notifications, setNotifications] = useState({
    projectUpdates: true,
    aiSuggestions: true,
    templateUpdates: false,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  useEffect(() => {
    const savedName =
      localStorage.getItem("dreamhouse_name") || "";

    const savedEmail =
      localStorage.getItem("dreamhouse_email") || "";

    setProfile({
      name: savedName,
      email: savedEmail,
    });

    const savedPreferences = localStorage.getItem(
      "dreamhouse_preferences"
    );

    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch {
        // Ignore invalid old settings.
      }
    }

    const savedAI = localStorage.getItem(
      "dreamhouse_ai_settings"
    );

    if (savedAI) {
      try {
        setAiSettings(JSON.parse(savedAI));
      } catch {
        // Ignore invalid old settings.
      }
    }

    const savedNotifications = localStorage.getItem(
      "dreamhouse_notifications"
    );

    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch {
        // Ignore invalid old settings.
      }
    }
  }, []);

  const updateProfile = (key, value) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updatePreference = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateAI = (key, value) => {
    setAiSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateNotification = (key, value) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveChanges = () => {
    localStorage.setItem("dreamhouse_name", profile.name);
    localStorage.setItem("dreamhouse_email", profile.email);

    localStorage.setItem(
      "dreamhouse_preferences",
      JSON.stringify(preferences)
    );

    localStorage.setItem(
      "dreamhouse_ai_settings",
      JSON.stringify(aiSettings)
    );

    localStorage.setItem(
      "dreamhouse_notifications",
      JSON.stringify(notifications)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const updatePassword = () => {
    if (!passwords.current || !passwords.newPassword) {
      alert("Please fill in the password fields.");
      return;
    }

    if (passwords.newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    if (passwords.newPassword !== passwords.confirm) {
      alert("New passwords do not match.");
      return;
    }

    const savedPassword =
      localStorage.getItem("dreamhouse_password");

    if (savedPassword && passwords.current !== savedPassword) {
      alert("Current password is incorrect.");
      return;
    }

    localStorage.setItem(
      "dreamhouse_password",
      passwords.newPassword
    );

    setPasswords({
      current: "",
      newPassword: "",
      confirm: "",
    });

    alert("Password updated successfully.");
  };

  const logout = () => {
    localStorage.removeItem("dreamhouse_logged_in");
    localStorage.removeItem("dreamhouse_role");

    navigate("/login");
  };

  const deleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your DreamHouse account?"
    );

    if (!confirmed) return;

    localStorage.removeItem("dreamhouse_logged_in");
    localStorage.removeItem("dreamhouse_role");
    localStorage.removeItem("dreamhouse_name");
    localStorage.removeItem("dreamhouse_email");
    localStorage.removeItem("dreamhouse_password");
    localStorage.removeItem("dreamhouse_preferences");
    localStorage.removeItem("dreamhouse_ai_settings");
    localStorage.removeItem("dreamhouse_notifications");

    alert("Account data removed from this browser.");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f7f5ed] text-[#173d32]">
      <Sidebar
        navigate={navigate}
        logout={logout}
      />

      <main className="min-h-screen lg:ml-[245px]">
        {/* HEADER */}
        <header className="flex min-h-[76px] items-center justify-between border-b border-[#dfe3dc] bg-[#faf9f4] px-5 py-4 sm:px-8">
          <div>
            <p className="text-[9px] uppercase tracking-[2px] text-[#7b877f]">
              DreamHouse Planner
            </p>

            <h1 className="font-serif text-[22px] font-semibold">
              Settings
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {saved && (
              <div className="hidden items-center gap-1.5 rounded-full bg-[#e7f1e8] px-3 py-1.5 text-[9px] font-semibold text-[#285d48] sm:flex">
                <Icon name="check" size={12} />
                Changes saved
              </div>
            )}

            <button
              onClick={saveChanges}
              className="flex items-center gap-2 rounded-xl bg-[#174d3d] px-4 py-2.5 text-[10px] font-semibold text-white transition hover:bg-[#103c2f]"
            >
              <Icon name="save" size={14} />
              Save Changes
            </button>

            <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-[#e3ece4] text-[11px] font-semibold text-[#174d3d] sm:flex">
              {(profile.name || "U")
                .charAt(0)
                .toUpperCase()}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1100px] p-5 sm:p-7 xl:p-9">
          {/* INTRO */}
          <section className="mb-7 rounded-3xl border border-[#dfe4dd] bg-[#e9efe8] p-6 sm:p-7">
            <p className="text-[9px] font-semibold uppercase tracking-[2px] text-[#527062]">
              Account preferences
            </p>

            <h2 className="mt-2 font-serif text-[29px] font-semibold leading-tight">
              Make DreamHouse work your way.
            </h2>

            <p className="mt-2 max-w-[620px] text-[11px] leading-6 text-[#68766e]">
              Manage your profile, planning preferences, AI assistance,
              notifications and account settings from one place.
            </p>
          </section>

          {/* PROFILE */}
          <section className="rounded-3xl border border-[#dfe4dd] bg-white p-5 sm:p-7">
            <SectionHeader
              icon="user"
              eyebrow="Account"
              title="Profile Information"
              description="Update the information associated with your DreamHouse account."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <InputField
                label="Full Name"
                value={profile.name}
                onChange={(value) =>
                  updateProfile("name", value)
                }
                placeholder="Your name"
              />

              <InputField
                label="Email Address"
                value={profile.email}
                onChange={(value) =>
                  updateProfile("email", value)
                }
                placeholder="you@example.com"
                type="email"
              />
            </div>

            <div className="mt-5 rounded-2xl bg-[#f5f7f3] p-4">
              <p className="text-[9px] font-semibold text-[#52635a]">
                Account type
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="rounded-full bg-[#dfece2] px-2.5 py-1 text-[8px] font-semibold text-[#285d48]">
                  User
                </span>

                <span className="text-[9px] text-[#87928c]">
                  Standard DreamHouse Planner account
                </span>
              </div>
            </div>
          </section>

          {/* PLANNING PREFERENCES */}
          <section className="mt-5 rounded-3xl border border-[#dfe4dd] bg-white p-5 sm:p-7">
            <SectionHeader
              icon="ruler"
              eyebrow="Planning"
              title="Planning Preferences"
              description="Set defaults that make creating your next floor plan faster."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField
                label="Measurement Unit"
                value={preferences.unit}
                onChange={(value) =>
                  updatePreference("unit", value)
                }
              >
                <option>Feet</option>
                <option>Meters</option>
              </SelectField>

              <SelectField
                label="Default Floors"
                value={preferences.defaultFloors}
                onChange={(value) =>
                  updatePreference("defaultFloors", value)
                }
              >
                <option>Ground Floor</option>
                <option>Ground + First Floor</option>
                <option>Ground + 2 Floors</option>
                <option>Ground + 3 Floors</option>
              </SelectField>

              <SelectField
                label="Default House Style"
                value={preferences.defaultStyle}
                onChange={(value) =>
                  updatePreference("defaultStyle", value)
                }
              >
                <option>Modern</option>
                <option>Minimal</option>
                <option>Family</option>
                <option>Luxury</option>
                <option>Traditional</option>
              </SelectField>

              <SelectField
                label="Default Plot Size"
                value={preferences.defaultPlot}
                onChange={(value) =>
                  updatePreference("defaultPlot", value)
                }
              >
                <option>25 × 40 ft</option>
                <option>25 × 50 ft</option>
                <option>30 × 50 ft</option>
                <option>30 × 60 ft</option>
                <option>40 × 60 ft</option>
              </SelectField>
            </div>
          </section>

          {/* AI SETTINGS */}
          <section className="mt-5 rounded-3xl border border-[#dfe4dd] bg-white p-5 sm:p-7">
            <SectionHeader
              icon="ai"
              eyebrow="Intelligence"
              title="AI Assistant"
              description="Control how DreamHouse's AI helps you design and improve your home."
            />

            <div className="divide-y divide-[#edf0eb]">
              <SettingRow
                title="Smart Suggestions"
                description="Show suggestions while planning your home."
                enabled={aiSettings.smartSuggestions}
                onChange={(value) =>
                  updateAI("smartSuggestions", value)
                }
              />

              <SettingRow
                title="Automatic Plan Analysis"
                description="Allow AI to analyze room placement and planning."
                enabled={aiSettings.autoAnalysis}
                onChange={(value) =>
                  updateAI("autoAnalysis", value)
                }
              />

              <SettingRow
                title="Natural Language Commands"
                description="Use simple text commands to modify your floor plan."
                enabled={aiSettings.naturalLanguage}
                onChange={(value) =>
                  updateAI("naturalLanguage", value)
                }
              />
            </div>
          </section>

          {/* NOTIFICATIONS */}
          <section className="mt-5 rounded-3xl border border-[#dfe4dd] bg-white p-5 sm:p-7">
            <SectionHeader
              icon="bell"
              eyebrow="Communication"
              title="Notifications"
              description="Choose which updates you want to receive."
            />

            <div className="divide-y divide-[#edf0eb]">
              <SettingRow
                title="Project Updates"
                description="Notifications about saved and updated projects."
                enabled={notifications.projectUpdates}
                onChange={(value) =>
                  updateNotification("projectUpdates", value)
                }
              />

              <SettingRow
                title="AI Suggestions"
                description="Get notified when AI has useful design suggestions."
                enabled={notifications.aiSuggestions}
                onChange={(value) =>
                  updateNotification("aiSuggestions", value)
                }
              />

              <SettingRow
                title="New Template Updates"
                description="Be notified when new house templates are available."
                enabled={notifications.templateUpdates}
                onChange={(value) =>
                  updateNotification("templateUpdates", value)
                }
              />
            </div>
          </section>

          {/* PASSWORD */}
          <section className="mt-5 rounded-3xl border border-[#dfe4dd] bg-white p-5 sm:p-7">
            <SectionHeader
              icon="lock"
              eyebrow="Security"
              title="Change Password"
              description="Update your password for this account."
            />

            <div className="grid gap-5 sm:grid-cols-3">
              <InputField
                label="Current Password"
                type="password"
                value={passwords.current}
                onChange={(value) =>
                  setPasswords((prev) => ({
                    ...prev,
                    current: value,
                  }))
                }
                placeholder="Current password"
              />

              <InputField
                label="New Password"
                type="password"
                value={passwords.newPassword}
                onChange={(value) =>
                  setPasswords((prev) => ({
                    ...prev,
                    newPassword: value,
                  }))
                }
                placeholder="New password"
              />

              <InputField
                label="Confirm Password"
                type="password"
                value={passwords.confirm}
                onChange={(value) =>
                  setPasswords((prev) => ({
                    ...prev,
                    confirm: value,
                  }))
                }
                placeholder="Confirm password"
              />
            </div>

            <button
              onClick={updatePassword}
              className="mt-5 rounded-xl border border-[#cfd9d1] bg-[#f5f7f3] px-4 py-2.5 text-[10px] font-semibold text-[#315f50] transition hover:bg-[#eaf0e9]"
            >
              Update Password
            </button>
          </section>

          {/* SAVE AREA */}
          <section className="mt-5 flex flex-col justify-between gap-4 rounded-3xl bg-[#123d32] p-6 text-white sm:flex-row sm:items-center sm:p-7">
            <div>
              <p className="text-[9px] uppercase tracking-[1.5px] text-white/45">
                Settings
              </p>

              <h3 className="mt-1 font-serif text-[21px] font-semibold">
                Ready to save your preferences?
              </h3>

              <p className="mt-1 text-[10px] text-white/55">
                Your settings will be saved on this device.
              </p>
            </div>

            <button
              onClick={saveChanges}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-[10px] font-semibold text-[#174d3d] transition hover:bg-[#edf3ed]"
            >
              <Icon name="save" size={14} />
              Save Changes
            </button>
          </section>

          {/* DANGER ZONE */}
          <section className="mt-5 rounded-3xl border border-[#ead6d1] bg-[#fffafa] p-5 sm:p-7">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f8e9e5] text-[#a45b4c]">
                <Icon name="warning" size={17} />
              </div>

              <div>
                <p className="text-[8px] font-semibold uppercase tracking-[1.8px] text-[#aa7569]">
                  Danger Zone
                </p>

                <h2 className="mt-0.5 font-serif text-[20px] font-semibold text-[#55352f]">
                  Delete Account
                </h2>

                <p className="mt-1 max-w-[620px] text-[10px] leading-5 text-[#8e7772]">
                  Delete your local DreamHouse account information from this
                  browser. This action cannot be undone.
                </p>
              </div>
            </div>

            <button
              onClick={deleteAccount}
              className="mt-5 rounded-xl border border-[#d9aaa0] px-4 py-2.5 text-[10px] font-semibold text-[#9a5145] transition hover:bg-[#fbeeea]"
            >
              Delete Account
            </button>
          </section>

          <div className="h-8" />
        </div>
      </main>
    </div>
  );
}

function SettingRow({
  title,
  description,
  enabled,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-5 py-4">
      <div>
        <h3 className="text-[11px] font-semibold text-[#30453b]">
          {title}
        </h3>

        <p className="mt-1 max-w-[650px] text-[9px] leading-5 text-[#87918b]">
          {description}
        </p>
      </div>

      <Toggle
        enabled={enabled}
        onChange={onChange}
      />
    </div>
  );
}