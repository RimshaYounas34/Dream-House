import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Search,
  Grid3X3,
  List,
  Pencil,
  Trash2,
  Home,
  BedDouble,
  Bath,
  Maximize,
  Clock3,
  RectangleHorizontal,
} from "lucide-react";
import { listProjects, deleteProject } from "../services/projectApi";

const STORAGE_KEY = "dreamHouseDesign";

function MyDesigns() {
  const navigate = useNavigate();

  const [designs, setDesigns] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");

  async function loadDesigns() {
    if (localStorage.getItem("dreamhouse_token")) {
      try {
        const projects = await listProjects();
        setDesigns(projects.map((item) => ({
          id: item._id,
          project: { ...item.floorPlanData?.project, name: item.name },
          rooms: item.floorPlanData?.rooms || [],
          doors: item.floorPlanData?.doors || [],
          windows: item.floorPlanData?.windows || [],
          walls: item.floorPlanData?.walls || [],
          furniture: item.floorPlanData?.furniture || [],
          updatedAt: item.updatedAt,
        })));
        return;
      } catch (error) {
        console.error("Unable to load cloud designs:", error);
      }
    }
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      setDesigns([]);
      return;
    }

    try {
      const data = JSON.parse(saved);

      // Current editor saves one design object
      const design = {
        id: data.id || "dream-house-1",
        project: data.project || {
          projectName: "My Dream House",
          plotWidth: "30",
          plotLength: "50",
        },
        rooms: Array.isArray(data.rooms) ? data.rooms : [],
        elements: Array.isArray(data.elements) ? data.elements : [],
        updatedAt: data.updatedAt || new Date().toISOString(),
      };

      setDesigns([design]);
    } catch (error) {
      console.error("Unable to load saved design:", error);
      setDesigns([]);
    }
  }

  // Load saved designs
  useEffect(() => {
    queueMicrotask(() => loadDesigns());
  }, []);

  // Delete design
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this design?"
    );

    if (!confirmDelete) return;

    if (localStorage.getItem("dreamhouse_token")) {
      deleteProject(id).catch((error) => alert(error.message));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }

    setDesigns((prev) => prev.filter((design) => design.id !== id));
  };

  // Open design in editor
  const handleOpen = (design) => {
    navigate("/floor-plan-editor", {
      state: {
        project: design.project,
        rooms: design.rooms,
        doors: design.doors,
        windows: design.windows,
        walls: design.walls,
        furniture: design.furniture,
        projectId: design.id,
      },
    });
  };

  // Search
  const filteredDesigns = designs.filter((design) => {
    const name = design.project?.name || design.project?.projectName || "Untitled Design";

    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <h1 className="text-lg font-bold text-slate-900">
                My Designs
              </h1>
              <p className="hidden text-xs text-slate-500 sm:block">
                Your saved house floor plans
              </p>
            </div>
          </div>

          <Link
            to="/create-project"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <Plus size={17} />
            <span className="hidden sm:inline">New Design</span>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <Home size={13} />
              Floor Plan Library
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Your House Designs
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage and continue working on your saved floor plans.
            </p>
          </div>

          {designs.length > 0 && (
            <div className="text-sm text-slate-500">
              <span className="font-semibold text-slate-800">
                {designs.length}
              </span>{" "}
              {designs.length === 1 ? "design" : "designs"} saved
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search designs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* View buttons */}
          <div className="flex items-center self-end rounded-lg border border-slate-200 bg-slate-50 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex h-8 w-9 items-center justify-center rounded-md transition ${
                viewMode === "grid"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Grid view"
            >
              <Grid3X3 size={17} />
            </button>

            <button
              onClick={() => setViewMode("list")}
              className={`flex h-8 w-9 items-center justify-center rounded-md transition ${
                viewMode === "list"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Empty state */}
        {filteredDesigns.length === 0 && (
          <EmptyState hasSearch={search.length > 0} />
        )}

        {/* GRID VIEW */}
        {filteredDesigns.length > 0 && viewMode === "grid" && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDesigns.map((design) => (
              <DesignCard
                key={design.id}
                design={design}
                onOpen={() => handleOpen(design)}
                onDelete={() => handleDelete(design.id)}
              />
            ))}
          </div>
        )}

        {/* LIST VIEW */}
        {filteredDesigns.length > 0 && viewMode === "list" && (
          <div className="space-y-3">
            {filteredDesigns.map((design) => (
              <DesignListItem
                key={design.id}
                design={design}
                onOpen={() => handleOpen(design)}
                onDelete={() => handleDelete(design.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

/* =========================================================
   DESIGN CARD
========================================================= */

function DesignCard({ design, onOpen, onDelete }) {
  const project = design.project || {};

  const rooms = design.rooms || [];
  const elements = design.elements || [];

  const roomCount = rooms.length;

  const bedroomCount = rooms.filter(
    (room) =>
      room.type?.toLowerCase() === "bedroom" ||
      room.name?.toLowerCase().includes("bedroom")
  ).length;

  const bathroomCount = rooms.filter(
    (room) =>
      room.type?.toLowerCase() === "bathroom" ||
      room.name?.toLowerCase().includes("bathroom")
  ).length;

  const plotSize = `${project.plotWidth || "—"} × ${
    project.plotLength || "—"
  } ft`;

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
      {/* Floor plan preview */}
      <div className="relative h-56 overflow-hidden bg-slate-100">
        <MiniFloorPlan rooms={rooms} elements={elements} />

        {/* Edit button */}
        <button
          onClick={onOpen}
          className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-lg border border-white/70 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 opacity-0 shadow-sm transition group-hover:opacity-100 hover:bg-white"
        >
          <Pencil size={14} />
          Edit
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-bold text-slate-900">
              {project.projectName || "Untitled Design"}
            </h3>

            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <Clock3 size={13} />
              Updated {formatDate(design.updatedAt)}
            </div>
          </div>

          <button
            onClick={onDelete}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
            title="Delete design"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 border-y border-slate-100 py-3">
          <Stat
            icon={<Maximize size={14} />}
            label="Plot"
            value={plotSize}
          />

          <Stat
            icon={<BedDouble size={14} />}
            label="Beds"
            value={bedroomCount}
          />

          <Stat
            icon={<Bath size={14} />}
            label="Baths"
            value={bathroomCount}
          />
        </div>

        {/* Bottom */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <RectangleHorizontal size={14} />
            {roomCount} rooms
          </div>

          <button
            onClick={onOpen}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
          >
            Open Design
            <Pencil size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   LIST ITEM
========================================================= */

function DesignListItem({ design, onOpen, onDelete }) {
  const project = design.project || {};

  const rooms = design.rooms || [];

  const bedroomCount = rooms.filter(
    (room) =>
      room.type?.toLowerCase() === "bedroom" ||
      room.name?.toLowerCase().includes("bedroom")
  ).length;

  const bathroomCount = rooms.filter(
    (room) =>
      room.type?.toLowerCase() === "bathroom" ||
      room.name?.toLowerCase().includes("bathroom")
  ).length;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:shadow-md md:flex-row md:items-center">
      {/* Preview */}
      <div className="h-32 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 md:w-52">
        <MiniFloorPlan
          rooms={design.rooms || []}
          elements={design.elements || []}
        />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-bold text-slate-900">
          {project.projectName || "Untitled Design"}
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Updated {formatDate(design.updatedAt)}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <InfoBadge
            icon={<Maximize size={13} />}
            text={`${project.plotWidth || "—"} × ${
              project.plotLength || "—"
            } ft`}
          />

          <InfoBadge
            icon={<BedDouble size={13} />}
            text={`${bedroomCount} Bedrooms`}
          />

          <InfoBadge
            icon={<Bath size={13} />}
            text={`${bathroomCount} Bathrooms`}
          />

          <InfoBadge
            icon={<RectangleHorizontal size={13} />}
            text={`${rooms.length} Rooms`}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 md:flex-col">
        <button
          onClick={onOpen}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 md:w-32"
        >
          <Pencil size={15} />
          Open
        </button>

        <button
          onClick={onDelete}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   MINI FLOOR PLAN
========================================================= */

function MiniFloorPlan({ rooms = [], elements = [] }) {
  const defaultRooms = [
    {
      id: "living",
      name: "Living",
      type: "Living",
      x: 40,
      y: 40,
      w: 240,
      h: 170,
    },
    {
      id: "bedroom",
      name: "Bedroom",
      type: "Bedroom",
      x: 300,
      y: 40,
      w: 170,
      h: 170,
    },
    {
      id: "kitchen",
      name: "Kitchen",
      type: "Kitchen",
      x: 40,
      y: 230,
      w: 180,
      h: 130,
    },
    {
      id: "bathroom",
      name: "Bathroom",
      type: "Bathroom",
      x: 240,
      y: 230,
      w: 100,
      h: 130,
    },
  ];

  const displayRooms = rooms.length > 0 ? rooms : defaultRooms;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#f8fafc]">
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(#dbe4e8 1px, transparent 1px), linear-gradient(90deg, #dbe4e8 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* House outline */}
      <div className="absolute left-[8%] top-[10%] h-[80%] w-[84%] rounded-md border-2 border-slate-700 bg-white/50" />

      {/* Rooms */}
      {displayRooms.map((room, index) => {
        const roomType = room.type?.toLowerCase() || "";

        let bg = "bg-slate-100";
        let border = "border-slate-400";

        if (roomType.includes("living")) {
          bg = "bg-emerald-50";
          border = "border-emerald-500";
        } else if (roomType.includes("bedroom")) {
          bg = "bg-blue-50";
          border = "border-blue-400";
        } else if (roomType.includes("kitchen")) {
          bg = "bg-amber-50";
          border = "border-amber-400";
        } else if (roomType.includes("bathroom")) {
          bg = "bg-cyan-50";
          border = "border-cyan-400";
        } else if (roomType.includes("garage")) {
          bg = "bg-slate-100";
          border = "border-slate-500";
        } else if (roomType.includes("balcony")) {
          bg = "bg-purple-50";
          border = "border-purple-400";
        }

        return (
          <div
            key={room.id || index}
            className={`absolute flex items-center justify-center border ${border} ${bg} overflow-hidden`}
            style={{
              left: `${Math.max(4, (room.x / 600) * 100)}%`,
              top: `${Math.max(4, (room.y / 600) * 100)}%`,
              width: `${Math.min(45, (room.w / 600) * 100)}%`,
              height: `${Math.min(40, (room.h / 600) * 100)}%`,
            }}
          >
            <span className="truncate px-1 text-[8px] font-semibold text-slate-600">
              {room.name || room.type || "Room"}
            </span>
          </div>
        );
      })}

      {/* Doors / windows */}
      {elements.map((element, index) => {
        const type = element.type?.toLowerCase();

        if (type !== "door" && type !== "window") return null;

        return (
          <div
            key={element.id || index}
            className={`absolute ${
              type === "door"
                ? "bg-amber-500"
                : "bg-sky-500"
            }`}
            style={{
              left: `${(element.x / 600) * 100}%`,
              top: `${(element.y / 600) * 100}%`,
              width: `${Math.max(1, (element.w / 600) * 100)}%`,
              height: `${Math.max(1, (element.h / 600) * 100)}%`,
              transform: `rotate(${element.rotation || 0}deg)`,
              transformOrigin: "center",
            }}
          />
        );
      })}

      {/* Entrance */}
      <div className="absolute bottom-[7%] left-1/2 h-1.5 w-10 -translate-x-1/2 rounded-full bg-amber-500" />
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({ hasSearch }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
        <Home size={28} />
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900">
        {hasSearch ? "No designs found" : "No designs yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {hasSearch
          ? "Try another project name or clear the search."
          : "Create your first house floor plan and it will appear here automatically after you save it."}
      </p>

      {!hasSearch && (
        <Link
          to="/create-project"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Plus size={17} />
          Create Your First Design
        </Link>
      )}
    </div>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function Stat({ icon, label, value }) {
  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-center gap-1 text-slate-400">
        {icon}
        <span className="text-[10px] uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="truncate text-xs font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}

function InfoBadge({ icon, text }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600">
      {icon}
      {text}
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function formatDate(date) {
  if (!date) return "Recently";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Recently";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default MyDesigns;