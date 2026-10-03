import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAdminContactMessages,
  updateAdminContactMessageStatus,
  deleteAdminContactMessage,
} from "../services/adminApi";

/* =========================================================
   ICON
========================================================= */

const Icon = ({ name, size = 18 }) => {
  const paths = {
    arrowLeft: (
      <>
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </>
    ),

    refresh: (
      <>
        <path d="M20 11a8.1 8.1 0 0 0-14.5-4.9L4 8" />
        <path d="M4 4v4h4" />
        <path d="M4 13a8.1 8.1 0 0 0 14.5 4.9L20 16" />
        <path d="M20 20v-4h-4" />
      </>
    ),

    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),

    message: (
      <>
        <path d="M21 11.5a8.38 8.38 0 0 1-9 8.5 8.8 8.8 0 0 1-4-.9L3 21l1.9-4.8A8.2 8.2 0 0 1 3 11.5a8.5 8.5 0 0 1 9-8.5 8.5 8.5 0 0 1 9 8.5Z" />
        <path d="M8 12h.01M12 12h.01M16 12h.01" />
      </>
    ),

    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),

    calendar: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </>
    ),

    check: (
      <>
        <path d="m5 12 4 4L19 6" />
      </>
    ),

    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),

    trash: (
      <>
        <path d="M4 7h16" />
        <path d="M10 11v6M14 11v6" />
        <path d="M6 7l1 13h10l1-13" />
        <path d="M9 7V4h6v3" />
      </>
    ),

    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),

    chevron: (
      <>
        <path d="m6 9 6 6 6-6" />
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
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
};

/* =========================================================
   HELPERS
========================================================= */

const formatDate = (date) => {
  if (!date) return "—";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return "—";

  return value.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (date) => {
  if (!date) return "";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return "";

  return value.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* =========================================================
   STATUS
========================================================= */

const statusStyles = {
  new: {
    label: "New",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },

  read: {
    label: "Read",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },

  resolved: {
    label: "Resolved",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({ title, value, icon, type }) {
  const styles = {
    total: "bg-[#f0f7f2] text-[#245c42]",
    new: "bg-amber-50 text-amber-600",
    read: "bg-blue-50 text-blue-600",
    resolved: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="rounded-2xl border border-[#e4ebe5] bg-white p-5 shadow-[0_8px_30px_rgba(24,54,39,0.05)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold text-[#173d2c]">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            styles[type] || styles.total
          }`}
        >
          <Icon name={icon} size={20} />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN
========================================================= */

export default function ContactQueries() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [selectedMessage, setSelectedMessage] = useState(null);

  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  /* =========================================================
     LOAD MESSAGES
  ========================================================= */

  const loadMessages = useCallback(async (showRefresh = false) => {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await getAdminContactMessages();

      /*
        IMPORTANT:
        Backend response:

        {
          success: true,
          data: {
            messages: [],
            newCount: 1,
            total: 1
          }
        }

        Is liye messages response.data.messages mein hain.
      */

      const data = response?.data;

      const contactMessages = Array.isArray(data?.messages)
        ? data.messages
        : [];

      setMessages(contactMessages);
    } catch (err) {
      console.error("Contact queries error:", err);

      setError(
        err?.message ||
          "Unable to load contact queries. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  /* =========================================================
     FILTERED MESSAGES
  ========================================================= */

  const filteredMessages = useMemo(() => {
    const term = search.trim().toLowerCase();

    return messages.filter((item) => {
      const matchesStatus =
        filter === "All" ||
        String(item.status || "").toLowerCase() ===
          filter.toLowerCase();

      if (!matchesStatus) return false;

      if (!term) return true;

      return [
        item.name,
        item.email,
        item.subject,
        item.message,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(term)
        );
    });
  }, [messages, search, filter]);

  /* =========================================================
     STATS
  ========================================================= */

  const stats = useMemo(() => {
    return {
      total: messages.length,

      newCount: messages.filter(
        (item) => item.status === "new"
      ).length,

      readCount: messages.filter(
        (item) => item.status === "read"
      ).length,

      resolvedCount: messages.filter(
        (item) => item.status === "resolved"
      ).length,
    };
  }, [messages]);

  /* =========================================================
     UPDATE STATUS
  ========================================================= */

  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");

      const response =
        await updateAdminContactMessageStatus(id, status);

      const updatedMessage = response?.data;

      setMessages((current) =>
        current.map((item) =>
          String(item._id || item.id) === String(id)
            ? {
                ...item,
                ...(updatedMessage || {}),
                status,
              }
            : item
        )
      );

      setSelectedMessage((current) => {
        if (!current) return current;

        if (
          String(current._id || current.id) === String(id)
        ) {
          return {
            ...current,
            ...(updatedMessage || {}),
            status,
          };
        }

        return current;
      });
    } catch (err) {
      console.error("Status update error:", err);

      setError(
        err?.message || "Unable to update message status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this query? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await deleteAdminContactMessage(id);

      setMessages((current) =>
        current.filter(
          (item) =>
            String(item._id || item.id) !== String(id)
        )
      );

      setSelectedMessage((current) => {
        if (
          current &&
          String(current._id || current.id) === String(id)
        ) {
          return null;
        }

        return current;
      });
    } catch (err) {
      console.error("Delete query error:", err);

      setError(
        err?.message || "Unable to delete this query."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =========================================================
     OPEN MESSAGE
  ========================================================= */

  const openMessage = async (message) => {
    setSelectedMessage(message);

    if (message.status === "new") {
      await handleStatusChange(
        message._id || message.id,
        "read"
      );
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7faf7] p-6">
        <div className="mx-auto max-w-[1400px]">
          <div className="animate-pulse">
            <div className="h-8 w-48 rounded-lg bg-slate-200" />
            <div className="mt-3 h-4 w-80 rounded bg-slate-200" />

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-32 rounded-2xl bg-white shadow-sm"
                />
              ))}
            </div>

            <div className="mt-6 h-96 rounded-2xl bg-white shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#f7faf7] text-[#173d2c]">
      <div className="mx-auto max-w-[1450px] px-5 py-6 lg:px-8">

        {/* HEADER */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <button
              onClick={() => navigate("/admin")}
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-[#527363] transition hover:text-[#173d2c]"
            >
              <Icon name="arrowLeft" size={17} />
              Back to Dashboard
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#173d2c] text-white shadow-sm">
                <Icon name="message" size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#173d2c] sm:text-3xl">
                  Contact Queries
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage messages submitted through your contact form.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => loadMessages(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-[#dbe6de] bg-white px-4 py-2.5 text-sm font-semibold text-[#245c42] shadow-sm transition hover:bg-[#f4f8f5] disabled:cursor-not-allowed disabled:opacity-60 lg:self-auto"
          >
            <Icon name="refresh" size={17} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="shrink-0 font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* STATS */}
        <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Queries"
            value={stats.total}
            icon="message"
            type="total"
          />

          <StatCard
            title="New Queries"
            value={stats.newCount}
            icon="clock"
            type="new"
          />

          <StatCard
            title="Read"
            value={stats.readCount}
            icon="mail"
            type="read"
          />

          <StatCard
            title="Resolved"
            value={stats.resolvedCount}
            icon="check"
            type="resolved"
          />
        </div>

        {/* CONTENT */}
        <div className="mt-7 overflow-hidden rounded-2xl border border-[#e3ebe5] bg-white shadow-[0_8px_30px_rgba(24,54,39,0.05)]">

          {/* TOOLBAR */}
          <div className="border-b border-[#e8eee9] p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              {/* SEARCH */}
              <div className="relative w-full lg:max-w-md">
                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Icon name="search" size={18} />
                </div>

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search name, email, subject..."
                  className="w-full rounded-xl border border-[#dfe8e1] bg-[#fbfdfb] py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#6f9d82] focus:ring-4 focus:ring-[#e7f1ea]"
                />
              </div>

              {/* FILTER */}
              <div className="flex items-center gap-2">
                <span className="hidden text-sm font-medium text-slate-500 sm:block">
                  Status:
                </span>

                <div className="relative">
                  <select
                    value={filter}
                    onChange={(event) =>
                      setFilter(event.target.value)
                    }
                    className="appearance-none rounded-xl border border-[#dfe8e1] bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-[#315744] outline-none focus:border-[#6f9d82] focus:ring-4 focus:ring-[#e7f1ea]"
                  >
                    <option value="All">All Queries</option>
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="resolved">
                      Resolved
                    </option>
                  </select>

                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Icon name="chevron" size={15} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TABLE */}
          {filteredMessages.length === 0 ? (
            <div className="flex min-h-[380px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eef5ef] text-[#4b765d]">
                <Icon name="message" size={28} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-[#173d2c]">
                {messages.length === 0
                  ? "No queries yet"
                  : "No matching queries"}
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                {messages.length === 0
                  ? "When someone submits the contact form, their message will appear here."
                  : "Try changing your search or status filter."}
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-[#e8eee9] bg-[#fbfdfb] text-left">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Contact
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Subject
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Date
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#edf1ee]">
                    {filteredMessages.map((message) => {
                      const id =
                        message._id || message.id;

                      const status =
                        statusStyles[message.status] ||
                        statusStyles.new;

                      return (
                        <tr
                          key={id}
                          className="transition hover:bg-[#fbfdfb]"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f1ea] text-sm font-bold text-[#356348]">
                                {String(
                                  message.name || "U"
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate font-semibold text-[#214b35]">
                                  {message.name || "Unknown"}
                                </p>

                                <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                                  <Icon name="mail" size={12} />

                                  <span className="max-w-[220px] truncate">
                                    {message.email || "—"}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="max-w-[280px] px-6 py-4">
                            <button
                              onClick={() =>
                                openMessage(message)
                              }
                              className="block max-w-full text-left"
                            >
                              <p className="truncate font-semibold text-[#315744] hover:text-[#173d2c]">
                                {message.subject ||
                                  "No subject"}
                              </p>

                              <p className="mt-1 max-w-[280px] truncate text-xs text-slate-400">
                                {message.message || ""}
                              </p>
                            </button>
                          </td>

                          <td className="whitespace-nowrap px-6 py-4">
                            <p className="text-sm font-medium text-slate-600">
                              {formatDate(message.createdAt)}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              {formatTime(message.createdAt)}
                            </p>
                          </td>

                          <td className="px-6 py-4">
                            <select
                              value={
                                message.status || "new"
                              }
                              disabled={
                                updatingId === id
                              }
                              onChange={(event) =>
                                handleStatusChange(
                                  id,
                                  event.target.value
                                )
                              }
                              className={`rounded-full border px-3 py-1.5 text-xs font-bold outline-none ${status.className}`}
                            >
                              <option value="new">
                                New
                              </option>

                              <option value="read">
                                Read
                              </option>

                              <option value="resolved">
                                Resolved
                              </option>
                            </select>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() =>
                                  openMessage(message)
                                }
                                className="rounded-lg border border-[#dbe6de] px-3 py-2 text-xs font-semibold text-[#356348] transition hover:bg-[#eef5ef]"
                              >
                                View
                              </button>

                              <button
                                onClick={() =>
                                  handleDelete(id)
                                }
                                disabled={
                                  deletingId === id
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                                title="Delete query"
                              >
                                <Icon
                                  name="trash"
                                  size={16}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE */}
              <div className="divide-y divide-[#edf1ee] lg:hidden">
                {filteredMessages.map((message) => {
                  const id =
                    message._id || message.id;

                  const status =
                    statusStyles[message.status] ||
                    statusStyles.new;

                  return (
                    <div key={id} className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f1ea] text-sm font-bold text-[#356348]">
                            {String(
                              message.name || "U"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[#214b35]">
                              {message.name || "Unknown"}
                            </p>

                            <p className="truncate text-xs text-slate-500">
                              {message.email || "—"}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          openMessage(message)
                        }
                        className="mt-4 block w-full rounded-xl bg-[#f8fbf8] p-4 text-left"
                      >
                        <p className="font-semibold text-[#315744]">
                          {message.subject || "No subject"}
                        </p>

                        <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                          {message.message || ""}
                        </p>
                      </button>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Icon name="calendar" size={13} />
                          {formatDate(message.createdAt)}
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={
                              message.status || "new"
                            }
                            disabled={
                              updatingId === id
                            }
                            onChange={(event) =>
                              handleStatusChange(
                                id,
                                event.target.value
                              )
                            }
                            className="rounded-lg border border-[#dbe6de] bg-white px-2.5 py-2 text-xs font-semibold text-[#356348] outline-none"
                          >
                            <option value="new">
                              New
                            </option>

                            <option value="read">
                              Read
                            </option>

                            <option value="resolved">
                              Resolved
                            </option>
                          </select>

                          <button
                            onClick={() =>
                              handleDelete(id)
                            }
                            disabled={
                              deletingId === id
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 hover:bg-red-50 disabled:opacity-50"
                          >
                            <Icon
                              name="trash"
                              size={16}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* FOOTER */}
          {filteredMessages.length > 0 && (
            <div className="border-t border-[#e8eee9] bg-[#fbfdfb] px-5 py-3">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="font-semibold text-[#315744]">
                  {filteredMessages.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[#315744]">
                  {messages.length}
                </span>{" "}
                queries
              </p>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          MESSAGE MODAL
      ===================================================== */}

      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#10271b]/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedMessage(null);
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">

            {/* HEADER */}
            <div className="flex items-start justify-between border-b border-[#e8eee9] px-6 py-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f1ea] text-[#356348]">
                  <Icon name="message" size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#173d2c]">
                    Query Details
                  </h2>

                  <p className="text-xs text-slate-500">
                    Contact form submission
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  setSelectedMessage(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <Icon name="close" size={19} />
              </button>
            </div>

            {/* CONTENT */}
            <div className="max-h-[calc(90vh-150px)] overflow-y-auto px-6 py-6">

              {/* PERSON */}
              <div className="flex items-center gap-3 rounded-2xl bg-[#f7faf7] p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dfece2] font-bold text-[#315744]">
                  {String(
                    selectedMessage.name || "U"
                  )
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="font-bold text-[#214b35]">
                    {selectedMessage.name || "Unknown"}
                  </p>

                  <a
                    href={`mailto:${selectedMessage.email || ""}`}
                    className="mt-0.5 block truncate text-sm text-[#527363] hover:underline"
                  >
                    {selectedMessage.email || "—"}
                  </a>
                </div>
              </div>

              {/* DETAILS */}
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Subject
                  </p>

                  <p className="mt-1.5 font-semibold text-[#315744]">
                    {selectedMessage.subject ||
                      "No subject"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Submitted
                  </p>

                  <p className="mt-1.5 font-semibold text-[#315744]">
                    {formatDate(
                      selectedMessage.createdAt
                    )}{" "}
                    ·{" "}
                    {formatTime(
                      selectedMessage.createdAt
                    )}
                  </p>
                </div>
              </div>

              {/* MESSAGE */}
              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Message
                </p>

                <div className="mt-2 rounded-2xl border border-[#e4ebe5] bg-[#fbfdfb] p-5">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                    {selectedMessage.message ||
                      "No message provided."}
                  </p>
                </div>
              </div>

              {/* STATUS */}
              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Update Status
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {["new", "read", "resolved"].map(
                    (status) => {
                      const active =
                        selectedMessage.status === status;

                      const config =
                        statusStyles[status];

                      return (
                        <button
                          key={status}
                          disabled={
                            updatingId ===
                            (selectedMessage._id ||
                              selectedMessage.id)
                          }
                          onClick={() =>
                            handleStatusChange(
                              selectedMessage._id ||
                                selectedMessage.id,
                              status
                            )
                          }
                          className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                            active
                              ? config.className
                              : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          {config.label}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between gap-3 border-t border-[#e8eee9] bg-[#fbfdfb] px-6 py-4">
              <button
                onClick={() =>
                  handleDelete(
                    selectedMessage._id ||
                      selectedMessage.id
                  )
                }
                disabled={
                  deletingId ===
                  (selectedMessage._id ||
                    selectedMessage.id)
                }
                className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-white px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-50"
              >
                <Icon name="trash" size={16} />
                Delete
              </button>

              <button
                onClick={() =>
                  setSelectedMessage(null)
                }
                className="rounded-xl bg-[#173d2c] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#245c42]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}