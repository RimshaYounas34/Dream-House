import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAdminReports } from "../services/adminApi";

const menu = [
  { label: "Dashboard", icon: "▦", path: "/admin" },
  { label: "Users", icon: "♙", path: "/admin/users" },
  { label: "Projects", icon: "⌂", path: "/admin/projects" },
  { label: "AI Usage", icon: "✦", path: "/admin/ai-usage" },
  { label: "Reports", icon: "◒", path: "/admin/reports" },
  { label: "Settings", icon: "⚙", path: "/settings" },
];

export default function Reports() {
  const location = useLocation();

  const [period, setPeriod] = useState("30");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReports() {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminReports(Number(period));

      if (!response?.success) {
        throw new Error(
          response?.message || "Unable to load reports."
        );
      }

      setReport(response.data);
    } catch (err) {
      console.error("Reports error:", err);
      setError(
        err?.message ||
          "Unable to load reports. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, [period]);

  const summary = report?.summary || {};

  const totalUsers = Number(summary.totalUsers || 0);
  const newUsers = Number(summary.newUsers || 0);

  const totalProjects = Number(summary.totalProjects || 0);
  const newProjects = Number(summary.newProjects || 0);

  const totalAiRequests = Number(
    summary.totalAiRequests || 0
  );

  const periodAiRequests = Number(
    summary.periodAiRequests || 0
  );

  const aiSuccessRate = Number(
    summary.aiSuccessRate ?? 100
  );

  const charts = report?.charts || {};

  const usersChart = Array.isArray(charts.users)
    ? charts.users
    : [];

  const projectsChart = Array.isArray(charts.projects)
    ? charts.projects
    : [];

  const aiChart = Array.isArray(charts.aiRequests)
    ? charts.aiRequests
    : [];

  const weeklyData = useMemo(() => {
    const days = 7;

    const result = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();

      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);

      const key = date.toISOString().slice(0, 10);

      const userRow = usersChart.find(
        (item) => item.date === key
      );

      const projectRow = projectsChart.find(
        (item) => item.date === key
      );

      const aiRow = aiChart.find(
        (item) => item.date === key
      );

      result.push({
        date: key,
        label: date.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        users: Number(userRow?.count || 0),
        projects: Number(projectRow?.count || 0),
        ai: Number(aiRow?.count || 0),
      });
    }

    return result;
  }, [usersChart, projectsChart, aiChart]);

  const maxChart = Math.max(
    ...weeklyData.map((item) =>
      Math.max(
        item.users,
        item.projects,
        item.ai
      )
    ),
    1
  );

  const projectTypes = Array.isArray(
    report?.projectTypes
  )
    ? report.projectTypes
    : [];

  const aiProjects = getProjectTypeCount(
    projectTypes,
    ["ai", "ai generated", "ai-generated", "ai planner"]
  );

  const manualProjects = getProjectTypeCount(
    projectTypes,
    ["manual", "manual plan", "manual plans"]
  );

  const threeDProjects = getProjectTypeCount(
    projectTypes,
    ["3d", "3d project", "3d projects"]
  );

  const topCreators = Array.isArray(
    report?.topCreators
  )
    ? report.topCreators
    : [];

  const aiFeatures = Array.isArray(
    report?.aiFeatures
  )
    ? report.aiFeatures
    : [];

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
                Analytics & Reports
              </p>

              <h1 className="mt-1 font-serif text-[32px] leading-none">
                Reports
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={period}
                onChange={(e) =>
                  setPeriod(e.target.value)
                }
                className="rounded-xl border border-[#cbd8cf] bg-[#e5ece4] px-4 py-2.5 text-[11px] font-semibold text-[#315c4d] outline-none"
              >
                <option value="7">
                  Last 7 Days
                </option>

                <option value="30">
                  Last 30 Days
                </option>

                <option value="90">
                  Last 90 Days
                </option>

                <option value="365">
                  Last 365 Days
                </option>
              </select>

              <button
                onClick={loadReports}
                disabled={loading}
                className="rounded-xl bg-[#dce9e1] px-4 py-2.5 text-[10px] font-bold text-[#315c4d] transition hover:bg-[#cbded1] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Loading..." : "Refresh"}
              </button>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#12382e] text-sm font-semibold text-white">
                A
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* ERROR */}
          {error && (
            <div className="mb-6 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-[12px] text-red-700">
              <span>{error}</span>

              <button
                onClick={loadReports}
                className="font-bold underline"
              >
                Try Again
              </button>
            </div>
          )}

          {/* HERO */}
          <section className="relative overflow-hidden rounded-[28px] bg-[#174235] p-7 text-white shadow-xl">
            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#8eb6a3]/20 blur-2xl" />

            <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-[#a7c7b6]/10 blur-3xl" />

            <div className="relative">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c9ddd3]">
                <span>◒</span>
                Website Report
              </div>

              <h2 className="max-w-2xl font-serif text-[32px] leading-tight">
                A complete overview of your DreamHouse Planner activity.
              </h2>

              <p className="mt-3 max-w-2xl text-[13px] leading-6 text-[#c5d8d0]">
                Monitor registered users, saved projects, AI activity and
                planning trends from one dashboard.
              </p>
            </div>
          </section>

          {/* STATS */}
          <section className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <ReportCard
              title="Total Users"
              value={loading ? "—" : totalUsers}
              icon="♙"
              type="dark"
            />

            <ReportCard
              title="Total Projects"
              value={loading ? "—" : totalProjects}
              icon="⌂"
              type="green"
            />

            <ReportCard
              title="AI Generated"
              value={
                loading
                  ? "—"
                  : aiProjects
              }
              icon="✦"
              type="sage"
            />

            <ReportCard
              title="Manual Plans"
              value={
                loading
                  ? "—"
                  : manualProjects
              }
              icon="✎"
              type="cream"
            />
          </section>

          {/* SECOND STATS */}
          <section className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <SmallStat
              label="New Users"
              value={
                loading ? "—" : newUsers
              }
            />

            <SmallStat
              label="AI Requests"
              value={
                loading
                  ? "—"
                  : totalAiRequests
              }
            />

            <SmallStat
              label="AI Success Rate"
              value={
                loading
                  ? "—"
                  : `${aiSuccessRate}%`
              }
            />

            <SmallStat
              label="Projects in Period"
              value={
                loading
                  ? "—"
                  : newProjects
              }
            />
          </section>

          {/* CHART + BREAKDOWN */}
          <section className="mt-7 grid gap-6 xl:grid-cols-[1.55fr_1fr]">
            {/* ACTIVITY CHART */}
            <div className="rounded-[26px] border border-[#d4ddd4] bg-[#e9eee7] p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#789086]">
                    Activity
                  </p>

                  <h3 className="mt-1 font-serif text-[24px]">
                    Weekly Overview
                  </h3>
                </div>

                <div className="flex gap-2">
                  <Legend
                    label="Users"
                    className="bg-[#173f34]"
                  />

                  <Legend
                    label="Projects"
                    className="bg-[#6e9c88]"
                  />

                  <Legend
                    label="AI"
                    className="bg-[#a5bea9]"
                  />
                </div>
              </div>

              <div className="mt-8 flex h-[240px] items-end gap-4 border-b border-[#cbd7cc] px-2">
                {weeklyData.map((item) => (
                  <div
                    key={item.date}
                    className="flex h-full flex-1 items-end justify-center gap-1.5"
                  >
                    <div className="flex h-full flex-1 flex-col items-center justify-end">
                      <div
                        className="w-full max-w-[14px] rounded-t-lg bg-[#173f34]"
                        title={`Users: ${item.users}`}
                        style={{
                          height: `${Math.max(
                            (item.users / maxChart) * 170,
                            item.users ? 12 : 4
                          )}px`,
                        }}
                      />

                      <span className="mt-3 pb-2 text-[10px] font-semibold text-[#71857c]">
                        {item.label}
                      </span>
                    </div>

                    <div className="flex h-full flex-1 flex-col items-center justify-end">
                      <div
                        className="w-full max-w-[14px] rounded-t-lg bg-[#6e9c88]"
                        title={`Projects: ${item.projects}`}
                        style={{
                          height: `${Math.max(
                            (item.projects / maxChart) * 170,
                            item.projects ? 12 : 4
                          )}px`,
                        }}
                      />

                      <span className="mt-3 pb-2 text-[10px] text-transparent">
                        {item.label}
                      </span>
                    </div>

                    <div className="flex h-full flex-1 flex-col items-center justify-end">
                      <div
                        className="w-full max-w-[14px] rounded-t-lg bg-[#a5bea9]"
                        title={`AI: ${item.ai}`}
                        style={{
                          height: `${Math.max(
                            (item.ai / maxChart) * 170,
                            item.ai ? 12 : 4
                          )}px`,
                        }}
                      />

                      <span className="mt-3 pb-2 text-[10px] text-transparent">
                        {item.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {!loading &&
                totalUsers === 0 &&
                totalProjects === 0 &&
                totalAiRequests === 0 && (
                  <div className="mt-5 rounded-2xl bg-[#dce7dc] px-4 py-3 text-center text-[11px] text-[#668076]">
                    No activity has been recorded yet.
                  </div>
                )}
            </div>

            {/* PLAN BREAKDOWN */}
            <div className="rounded-[26px] bg-[#173f34] p-6 text-white shadow-lg">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9dbbae]">
                Project Breakdown
              </p>

              <h3 className="mt-1 font-serif text-[24px]">
                Project Types
              </h3>

              <div className="mt-8">
                <Breakdown
                  label="AI Generated Plans"
                  value={aiProjects}
                  total={totalProjects}
                  dark
                />

                <Breakdown
                  label="Manual Plans"
                  value={manualProjects}
                  total={totalProjects}
                  dark
                />

                <Breakdown
                  label="3D Projects"
                  value={threeDProjects}
                  total={totalProjects}
                  dark
                />
              </div>

              {projectTypes.length > 0 && (
                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.15em] text-[#8eafa1]">
                    Recorded Types
                  </p>

                  <div className="space-y-2">
                    {projectTypes.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2"
                      >
                        <span className="text-[10px] capitalize text-[#c7d8d1]">
                          {formatLabel(item.name)}
                        </span>

                        <span className="text-[11px] font-bold text-white">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {totalProjects === 0 && (
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-[11px] text-[#abc2b7]">
                  Project reports will appear after users save their first
                  project.
                </div>
              )}
            </div>
          </section>

          {/* TOP CREATORS + AI FEATURES */}
          <section className="mt-7 grid gap-6 xl:grid-cols-2">
            {/* TOP CREATORS */}
            <div className="rounded-[26px] border border-[#d4ddd4] bg-[#fbfaf4] p-6 shadow-sm">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#789086]">
                  User Activity
                </p>

                <h3 className="mt-1 font-serif text-[24px]">
                  Top Project Creators
                </h3>
              </div>

              {topCreators.length > 0 ? (
                <div className="mt-6 space-y-3">
                  {topCreators.map((creator, index) => (
                    <div
                      key={`${creator.email}-${index}`}
                      className="flex items-center gap-3 rounded-2xl bg-[#e9efe8] px-4 py-3"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#173f34] text-[11px] font-bold text-white">
                        {index + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-bold text-[#31574a]">
                          {creator.name || "User"}
                        </p>

                        <p className="truncate text-[9px] text-[#7c9187]">
                          {creator.email || "No email"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-serif text-[20px] text-[#173d32]">
                          {creator.count}
                        </p>

                        <p className="text-[8px] uppercase tracking-wide text-[#789086]">
                          Projects
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyBox
                  icon="♙"
                  title="No creators yet"
                  text="Users with saved projects will appear here."
                />
              )}
            </div>

            {/* AI FEATURES */}
            <div className="rounded-[26px] bg-[#dce8df] p-6 shadow-sm">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#789086]">
                  AI Analytics
                </p>

                <h3 className="mt-1 font-serif text-[24px]">
                  AI Feature Usage
                </h3>
              </div>

              <div className="mt-6">
                <div className="rounded-2xl bg-[#173f34] p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#9dbbae]">
                        Selected Period
                      </p>

                      <p className="mt-1 font-serif text-[30px]">
                        {loading
                          ? "—"
                          : periodAiRequests}
                      </p>

                      <p className="text-[10px] text-[#a9c0b5]">
                        AI requests
                      </p>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl">
                      ✦
                    </div>
                  </div>
                </div>

                {aiFeatures.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {aiFeatures.map((feature) => (
                      <div
                        key={feature.name}
                        className="flex items-center justify-between rounded-2xl bg-[#eef3ed] px-4 py-3"
                      >
                        <span className="text-[11px] font-semibold text-[#31574a]">
                          {formatLabel(feature.name)}
                        </span>

                        <span className="rounded-full bg-[#cbded1] px-3 py-1 text-[10px] font-bold text-[#315c4d]">
                          {feature.count}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-dashed border-[#b9cabd] bg-[#edf2eb] p-7 text-center">
                    <p className="text-[11px] text-[#71857c]">
                      No AI feature activity recorded for this period.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* REPORT SUMMARY */}
          <section className="mt-7 rounded-[26px] border border-[#d4ddd4] bg-[#fbfaf4] p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#789086]">
                  Report Summary
                </p>

                <h3 className="mt-1 font-serif text-[24px]">
                  Database Activity
                </h3>
              </div>

              <div className="rounded-xl bg-[#e0ebe1] px-4 py-2 text-[10px] font-bold text-[#315c4d]">
                Last {report?.period || period} Days
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <SummaryItem
                label="Total Registered Users"
                value={totalUsers}
              />

              <SummaryItem
                label="Total Saved Projects"
                value={totalProjects}
              />

              <SummaryItem
                label="Total AI Requests"
                value={totalAiRequests}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* =========================
   HELPERS
========================= */

function getProjectTypeCount(items, names) {
  const normalizedNames = names.map(normalize);

  return items.reduce((total, item) => {
    const name = normalize(item?.name);

    if (
      normalizedNames.some(
        (value) =>
          name === value ||
          name.includes(value)
      )
    ) {
      return total + Number(item?.count || 0);
    }

    return total;
  }, 0);
}

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function formatLabel(value) {
  const text = String(value || "Unknown")
    .replace(/[_-]+/g, " ")
    .trim();

  return text
    .split(" ")
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

/* =========================
   COMPONENTS
========================= */

function ReportCard({
  title,
  value,
  icon,
  type,
}) {
  const styles = {
    dark: "bg-[#173f34] text-white",
    green: "bg-[#d8e7dc] text-[#173d32]",
    sage: "bg-[#c7d9cc] text-[#173d32]",
    cream: "bg-[#e6e3d6] text-[#173d32]",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-[24px] p-5 shadow-sm ${styles[type]}`}
    >
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />

      <div className="relative flex items-start justify-between">
        <div>
          <p
            className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
              type === "dark"
                ? "text-[#a8c5b7]"
                : "text-[#678076]"
            }`}
          >
            {title}
          </p>

          <p className="mt-3 font-serif text-[36px] leading-none">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl text-lg ${
            type === "dark"
              ? "bg-white/10 text-[#d6e5df]"
              : "bg-white/60 text-[#315c4d]"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function SmallStat({ label, value }) {
  return (
    <div className="rounded-[20px] border border-[#d2ddd3] bg-[#dfe9df] px-5 py-4">
      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#71877d]">
        {label}
      </p>

      <p className="mt-1 font-serif text-[25px] text-[#173d32]">
        {value}
      </p>
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="rounded-2xl bg-[#e8eee7] px-5 py-4">
      <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#789086]">
        {label}
      </p>

      <p className="mt-2 font-serif text-[28px] text-[#173d32]">
        {value}
      </p>
    </div>
  );
}

function Legend({ label, className }) {
  return (
    <div className="flex items-center gap-1.5 text-[9px] font-semibold text-[#657d72]">
      <span
        className={`h-2 w-2 rounded-full ${className}`}
      />

      {label}
    </div>
  );
}

function Breakdown({
  label,
  value,
  total,
  dark = false,
}) {
  const percentage =
    total > 0
      ? Math.round((value / total) * 100)
      : 0;

  return (
    <div className="mb-7 last:mb-0">
      <div className="flex items-center justify-between">
        <span
          className={`text-[11px] font-semibold ${
            dark
              ? "text-[#d1e0d9]"
              : "text-[#31574a]"
          }`}
        >
          {label}
        </span>

        <span
          className={`text-[11px] font-bold ${
            dark
              ? "text-white"
              : "text-[#173d32]"
          }`}
        >
          {value}
        </span>
      </div>

      <div
        className={`mt-2 h-2 overflow-hidden rounded-full ${
          dark
            ? "bg-white/10"
            : "bg-[#d5e1d6]"
        }`}
      >
        <div
          className="h-full rounded-full bg-[#8eb6a3] transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <p
        className={`mt-1 text-right text-[9px] ${
          dark
            ? "text-[#8eafa1]"
            : "text-[#71857c]"
        }`}
      >
        {percentage}%
      </p>
    </div>
  );
}

function EmptyBox({
  icon,
  title,
  text,
}) {
  return (
    <div className="mt-6 rounded-[22px] border border-dashed border-[#b9cabd] bg-[#e9efe8] px-6 py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#173f34] text-xl text-white">
        {icon}
      </div>

      <h4 className="mt-4 font-serif text-[21px] text-[#173d32]">
        {title}
      </h4>

      <p className="mt-2 text-[11px] text-[#71857c]">
        {text}
      </p>
    </div>
  );
}