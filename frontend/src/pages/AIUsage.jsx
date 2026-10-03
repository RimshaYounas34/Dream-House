import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const menu = [
  { label: "Dashboard", icon: "▦", path: "/admin" },
  { label: "Users", icon: "♙", path: "/admin/users" },
  { label: "Projects", icon: "⌂", path: "/admin/projects" },
  { label: "AI Usage", icon: "✦", path: "/admin/ai-usage" },
  { label: "Reports", icon: "◒", path: "/admin/reports" },
  { label: "Settings", icon: "⚙", path: "/settings" },
];

const featureNames = [
  "AI Floor Plan Generator",
  "AI Edit Commands",
  "Add Room Commands",
  "Move Room Commands",
  "Delete Room Commands",
  "3D Generation",
];

function readUsage() {
  try {
    const data = JSON.parse(
      localStorage.getItem("dreamhouse_ai_usage") || "[]"
    );

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default function AIUsage() {
  const location = useLocation();
  const [usage, setUsage] = useState(readUsage);

  useEffect(() => {
    const refresh = () => setUsage(readUsage());

    window.addEventListener("storage", refresh);
    window.addEventListener("dreamhouse-ai-usage-updated", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("dreamhouse-ai-usage-updated", refresh);
    };
  }, []);

  const stats = useMemo(() => {
    const total = usage.length;

    const plans = usage.filter(
      (item) =>
        item.feature === "AI Floor Plan Generator" ||
        item.action === "generate"
    ).length;

    const commands = usage.filter(
      (item) =>
        item.feature === "AI Edit Commands" ||
        item.action === "edit-command"
    ).length;

    const users = new Set(
      usage
        .map((item) => item.userId || item.email)
        .filter(Boolean)
    ).size;

    return {
      total,
      plans,
      commands,
      users,
    };
  }, [usage]);

  const featureStats = useMemo(() => {
    return featureNames.map((feature) => ({
      name: feature,
      count: usage.filter((item) => item.feature === feature).length,
    }));
  }, [usage]);

  const dailyUsage = useMemo(() => {
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();

      date.setDate(date.getDate() - i);

      const key = date.toISOString().slice(0, 10);

      const count = usage.filter((item) => {
        if (!item.createdAt) return false;

        return String(item.createdAt).slice(0, 10) === key;
      }).length;

      days.push({
        date: key,
        label: date.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        count,
      });
    }

    return days;
  }, [usage]);

  const maxUsage = Math.max(
    ...dailyUsage.map((item) => item.count),
    1
  );

  const activeUsers = useMemo(() => {
    const map = {};

    usage.forEach((item) => {
      const key =
        item.email ||
        item.userId ||
        item.userName ||
        "Unknown User";

      if (!map[key]) {
        map[key] = {
          name: item.userName || "Registered User",
          email: item.email || key,
          count: 0,
        };
      }

      map[key].count += 1;
    });

    return Object.values(map)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [usage]);

  return (
    <div className="min-h-screen bg-[#f3f0e5] text-[#173d32]">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 z-30 flex h-screen w-[250px] flex-col bg-[#12382e] text-white shadow-2xl">
        {/* Logo */}
        <div className="border-b border-white/10 px-7 py-7">
          <Link to="/" className="block">
            <div className="font-serif text-[26px] tracking-tight">
              DreamHouse
            </div>

            <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a9c5b8]">
              Admin Panel
            </div>
          </Link>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-6">
          <p className="px-4 pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#86a89a]">
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
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-[13px] font-medium transition ${
                    active
                      ? "bg-[#a9c7b7] text-[#12382e] shadow-lg shadow-black/10"
                      : "text-[#d8e4de] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-xl text-[16px] ${
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

        {/* Bottom */}
        <div className="border-t border-white/10 p-4">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-2xl bg-[#1d4a3d] px-4 py-3 text-[12px] font-medium text-[#dce9e2] transition hover:bg-[#28594a]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#315f50]">
              ↗
            </span>

            <div>
              <div>Visit Website</div>
              <div className="text-[10px] text-[#91b1a4]">
                Back to DreamHouse
              </div>
            </div>
          </Link>
        </div>
      </aside>

      {/* MAIN */}
      <main className="ml-[250px] min-h-screen">
        {/* TOP BAR */}
        <header className="sticky top-0 z-20 border-b border-[#d6ddd3] bg-[#f3f0e5]/95 px-8 py-5 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#628075]">
                Analytics
              </p>

              <h1 className="mt-1 font-serif text-[32px] leading-none text-[#173d32]">
                AI Usage
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full border border-[#cbd8cf] bg-[#e5ece4] px-4 py-2 text-[11px] font-semibold text-[#315c4d]">
                ✦ AI Activity
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#12382e] text-sm font-semibold text-white">
                A
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* INTRO */}
          <section className="relative overflow-hidden rounded-[28px] bg-[#174235] p-7 text-white shadow-xl">
            <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#75a895]/20 blur-2xl" />
            <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-[#9cbea9]/10 blur-3xl" />

            <div className="relative">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c9ddd3]">
                <span>✦</span>
                AI Analytics
              </div>

              <h2 className="max-w-2xl font-serif text-[32px] leading-tight">
                Understand how users are using your AI planning tools.
              </h2>

              <p className="mt-3 max-w-2xl text-[13px] leading-6 text-[#c5d8d0]">
                Track floor-plan generation, AI editing commands and other
                AI-powered features from one place.
              </p>
            </div>
          </section>

          {/* STAT CARDS */}
          <section className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total AI Requests"
              value={stats.total}
              icon="✦"
              tone="dark"
            />

            <StatCard
              title="Plans Generated"
              value={stats.plans}
              icon="⌂"
              tone="green"
            />

            <StatCard
              title="AI Edit Commands"
              value={stats.commands}
              icon="✎"
              tone="cream"
            />

            <StatCard
              title="Active AI Users"
              value={stats.users}
              icon="♙"
              tone="sage"
            />
          </section>

          {/* ANALYTICS + FEATURES */}
          <section className="mt-7 grid gap-6 xl:grid-cols-[1.55fr_1fr]">
            {/* CHART */}
            <div className="rounded-[26px] border border-[#d4ddd4] bg-[#fbfaf4] p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#789086]">
                    Last 7 Days
                  </p>

                  <h3 className="mt-1 font-serif text-[24px] text-[#173d32]">
                    AI Activity
                  </h3>
                </div>

                <div className="rounded-xl bg-[#dce9e1] px-3 py-2 text-[10px] font-bold text-[#315c4d]">
                  LIVE
                </div>
              </div>

              <div className="mt-8 flex h-[235px] items-end gap-3 border-b border-[#d9dfd8] px-2 pb-0">
                {dailyUsage.map((item) => {
                  const height =
                    item.count === 0
                      ? 8
                      : Math.max(
                          (item.count / maxUsage) * 175,
                          16
                        );

                  return (
                    <div
                      key={item.date}
                      className="flex h-full flex-1 flex-col items-center justify-end"
                    >
                      <span className="mb-2 text-[10px] font-bold text-[#547467]">
                        {item.count}
                      </span>

                      <div
                        className="w-full max-w-[38px] rounded-t-xl bg-gradient-to-t from-[#12382e] to-[#6f9c89] transition hover:from-[#1d4f40] hover:to-[#8ab29f]"
                        style={{
                          height: `${height}px`,
                        }}
                      />

                      <span className="mt-3 pb-2 text-[10px] font-semibold text-[#71857c]">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {usage.length === 0 && (
                <div className="mt-5 rounded-2xl bg-[#edf2eb] px-4 py-3 text-center text-[11px] text-[#678076]">
                  No AI activity recorded yet. The chart will update when
                  users start using AI features.
                </div>
              )}
            </div>

            {/* FEATURES */}
            <div className="rounded-[26px] border border-[#d4ddd4] bg-[#fbfaf4] p-6 shadow-sm">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#789086]">
                  Feature Breakdown
                </p>

                <h3 className="mt-1 font-serif text-[24px] text-[#173d32]">
                  AI Features
                </h3>
              </div>

              <div className="mt-6 space-y-3">
                {featureStats.map((feature, index) => (
                  <div
                    key={feature.name}
                    className="group rounded-2xl border border-[#dbe2da] bg-[#eef2eb] p-3 transition hover:border-[#9db9aa] hover:bg-[#e4ece4]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[13px] font-bold ${
                            index % 2 === 0
                              ? "bg-[#173f34] text-white"
                              : "bg-[#c6d9cd] text-[#173f34]"
                          }`}
                        >
                          ✦
                        </div>

                        <span className="truncate text-[11px] font-semibold text-[#345a4c]">
                          {feature.name}
                        </span>
                      </div>

                      <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-[#315c4d] shadow-sm">
                        {feature.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* USERS */}
          <section className="mt-7 rounded-[26px] border border-[#d4ddd4] bg-[#fbfaf4] p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#789086]">
                  User Activity
                </p>

                <h3 className="mt-1 font-serif text-[24px] text-[#173d32]">
                  Most Active AI Users
                </h3>
              </div>

              <div className="rounded-xl bg-[#dce9e1] px-3 py-2 text-[10px] font-bold text-[#315c4d]">
                {activeUsers.length} USERS
              </div>
            </div>

            {activeUsers.length > 0 ? (
              <div className="mt-6 overflow-hidden rounded-2xl border border-[#dce3dc]">
                <div className="grid grid-cols-[1.5fr_1.5fr_100px] bg-[#e7eee7] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#678076]">
                  <span>User</span>
                  <span>Email</span>
                  <span className="text-right">Requests</span>
                </div>

                {activeUsers.map((user, index) => (
                  <div
                    key={user.email}
                    className="grid grid-cols-[1.5fr_1.5fr_100px] items-center border-t border-[#e1e6e0] px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#173f34] text-[11px] font-bold text-white">
                        {(user.name || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <p className="text-[12px] font-semibold text-[#254c40]">
                          {user.name}
                        </p>

                        <p className="text-[10px] text-[#81938a]">
                          User #{index + 1}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] text-[#61786d]">
                      {user.email}
                    </span>

                    <div className="text-right">
                      <span className="rounded-full bg-[#dce9e1] px-3 py-1 text-[10px] font-bold text-[#315c4d]">
                        {user.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-[22px] border border-dashed border-[#b8c9bd] bg-[#e9efe8] px-6 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#173f34] text-xl text-white shadow-lg">
                  ✦
                </div>

                <h4 className="mt-4 font-serif text-[21px] text-[#173d32]">
                  No AI activity yet
                </h4>

                <p className="mx-auto mt-2 max-w-md text-[12px] leading-5 text-[#71857c]">
                  AI usage will appear here automatically when registered
                  users generate plans or use AI editing commands.
                </p>
              </div>
            )}
          </section>

          {/* BOTTOM INFO */}
          <section className="mt-7 grid gap-5 md:grid-cols-2">
            <div className="rounded-[24px] bg-[#dbe8df] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#173f34] text-white">
                  ✦
                </div>

                <div>
                  <h4 className="font-serif text-[20px] text-[#173d32]">
                    AI tracking
                  </h4>

                  <p className="mt-1 text-[11px] leading-5 text-[#557267]">
                    Every AI action can be recorded so administrators can
                    understand feature usage over time.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] bg-[#173f34] p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#8fb3a2] text-[#173f34]">
                  ✓
                </div>

                <div>
                  <h4 className="font-serif text-[20px]">
                    No demo statistics
                  </h4>

                  <p className="mt-1 text-[11px] leading-5 text-[#b9d0c5]">
                    This dashboard only displays recorded AI activity from
                    your application.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, tone }) {
  const styles = {
    dark: "bg-[#173f34] text-white",
    green: "bg-[#d9e7de] text-[#173d32]",
    cream: "bg-[#e8e6d9] text-[#173d32]",
    sage: "bg-[#c8dacf] text-[#173d32]",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-[24px] p-5 shadow-sm ${styles[tone]}`}
    >
      <div className="absolute -right-7 -top-7 h-24 w-24 rounded-full bg-white/10" />

      <div className="relative flex items-start justify-between">
        <div>
          <p
            className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
              tone === "dark"
                ? "text-[#a9c5b8]"
                : "text-[#678076]"
            }`}
          >
            {title}
          </p>

          <p className="mt-3 font-serif text-[35px] leading-none">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl text-lg ${
            tone === "dark"
              ? "bg-white/10 text-[#d3e4dc]"
              : "bg-white/70 text-[#315c4d]"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}