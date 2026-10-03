import { useEffect, useMemo, useState } from "react";
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
  Eye,
  Box,
  RefreshCw,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import {
  listProjects,
  getProject,
  deleteProject,
} from "../services/projectApi";

const STORAGE_KEY = "dreamHouseDesign";

const PLOT = {
  left: 35,
  top: 35,
  right: 660,
  bottom: 585,
  width: 625,
  height: 550,
};

const roomColors = {
  living: "#f2f0e8",
  bedroom: "#f4f1e8",
  kitchen: "#f1eee2",
  bathroom: "#edf3f2",
  dining: "#f2eee7",
  garage: "#e9e9e5",
  balcony: "#edf3eb",
  study: "#eeeaf0",
  stairs: "#eceee9",
  laundry: "#eef1ee",
  store: "#eeece7",
  porch: "#e9eee9",
};

const roomLabels = {
  living: "Living",
  bedroom: "Bedroom",
  kitchen: "Kitchen",
  bathroom: "Bath",
  dining: "Dining",
  garage: "Garage",
  balcony: "Balcony",
  study: "Study",
  stairs: "Stairs",
  laundry: "Laundry",
  store: "Store",
  porch: "Porch",
};

const normalizeType = (type) => {
  const value = String(type || "")
    .toLowerCase()
    .replace(/[\s_-]/g, "");

  const aliases = {
    livingroom: "living",
    drawingroom: "living",
    lounge: "living",
    masterbedroom: "bedroom",
    bedrooms: "bedroom",
    diningroom: "dining",
    carporch: "garage",
    parking: "garage",
    terrace: "balcony",
    washroom: "bathroom",
    bath: "bathroom",
    storeroom: "store",
    studyroom: "study",
    office: "study",
  };

  return aliases[value] || value || "bedroom";
};

const safeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

function formatDate(date) {
  if (!date) return "Recently created";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Recently created";
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* -------------------------------------------------------------------------- */
/*                         REAL 2D FLOOR PLAN PREVIEW                         */
/* -------------------------------------------------------------------------- */

function FloorPlanPreview({ design }) {
  const plan = design?.floorPlanData || {};

  const rooms = Array.isArray(plan.rooms) ? plan.rooms : [];
  const doors = Array.isArray(plan.doors) ? plan.doors : [];
  const windows = Array.isArray(plan.windows) ? plan.windows : [];
  const walls = Array.isArray(plan.walls) ? plan.walls : [];
  const furniture = Array.isArray(plan.furniture)
    ? plan.furniture
    : [];

  const hasPlan =
    rooms.length > 0 ||
    doors.length > 0 ||
    windows.length > 0 ||
    walls.length > 0;

  if (!hasPlan) {
    return (
      <div className="flex h-full min-h-[250px] items-center justify-center bg-[#eef1eb]">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d8e0d7] bg-white text-[#315348] shadow-[0_8px_25px_rgba(30,53,43,0.07)]">
            <Home size={27} strokeWidth={1.5} />
          </div>

          <p className="mt-4 text-xs font-bold text-[#315348]">
            No 2D floor plan yet
          </p>

          <p className="mt-1 text-[10px] text-[#89958e]">
            Open the editor to create your plan
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[250px] overflow-hidden bg-[#e6e8e2]">
      {/* Soft architectural background */}
      <div className="absolute inset-0 opacity-60">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(#d9ded8 1px, transparent 1px), linear-gradient(90deg, #d9ded8 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4">
        <svg
          viewBox="0 0 700 620"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          className="relative z-10 max-h-[315px] w-full drop-shadow-[0_14px_30px_rgba(35,55,45,0.18)]"
        >
          <defs>
            <pattern
              id={`previewSmallGrid-${design.id}`}
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="#edf0eb"
                strokeWidth="0.7"
              />
            </pattern>

            <pattern
              id={`previewLargeGrid-${design.id}`}
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <rect
                width="50"
                height="50"
                fill={`url(#previewSmallGrid-${design.id})`}
              />

              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="#e2e7e0"
                strokeWidth="1"
              />
            </pattern>

            <filter
              id={`previewShadow-${design.id}`}
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow
                dx="0"
                dy="3"
                stdDeviation="3"
                floodOpacity=".13"
              />
            </filter>
          </defs>

          {/* Canvas */}
          <rect
            width="700"
            height="620"
            fill="#ffffff"
          />

          {/* Architectural grid */}
          <rect
            x={PLOT.left}
            y={PLOT.top}
            width={PLOT.width}
            height={PLOT.height}
            fill={`url(#previewLargeGrid-${design.id})`}
          />

          {/* Plot boundary */}
          <rect
            x={PLOT.left}
            y={PLOT.top}
            width={PLOT.width}
            height={PLOT.height}
            fill="#fafaf6"
            stroke="#243d34"
            strokeWidth="7"
            filter={`url(#previewShadow-${design.id})`}
          />

          <rect
            x={PLOT.left + 7}
            y={PLOT.top + 7}
            width={PLOT.width - 14}
            height={PLOT.height - 14}
            fill="none"
            stroke="#8d9991"
            strokeWidth="1"
          />

          {/* Plot dimensions */}
          <text
            x="347"
            y="20"
            textAnchor="middle"
            fontSize="9"
            fontWeight="700"
            fill="#68766e"
          >
            {design.project?.plotWidth || 30} ft FRONT
          </text>

          <text
            x="17"
            y="315"
            textAnchor="middle"
            transform="rotate(-90 17 315)"
            fontSize="9"
            fontWeight="700"
            fill="#68766e"
          >
            {design.project?.plotLength || 60} ft
          </text>

          {/* North */}
          <g transform="translate(620 48)">
            <text
              x="0"
              y="-10"
              textAnchor="middle"
              fontSize="10"
              fontWeight="800"
              fill="#315348"
            >
              N
            </text>

            <path
              d="M0 25V0M0 0l-5 8M0 0l5 8"
              stroke="#315348"
              strokeWidth="1.7"
            />
          </g>

          {/* Rooms */}
          {rooms.map((room, index) => {
            const x = safeNumber(room.x, 60);
            const y = safeNumber(room.y, 65);

            const width = Math.max(
              25,
              safeNumber(room.width, 120)
            );

            const height = Math.max(
              25,
              safeNumber(room.height, 90)
            );

            const rotation = safeNumber(
              room.rotation,
              0
            );

            const type = normalizeType(room.type);

            const fill =
              room.floorColor ||
              roomColors[type] ||
              "#edf0ea";

            const cx = x + width / 2;
            const cy = y + height / 2;

            const roomName =
              room.name ||
              roomLabels[type] ||
              "Room";

            return (
              <g
                key={room.id || `room-${index}`}
                transform={`rotate(${rotation} ${cx} ${cy})`}
              >
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={fill}
                  stroke="#43584f"
                  strokeWidth="2"
                />

                <rect
                  x={x + 5}
                  y={y + 5}
                  width={Math.max(1, width - 10)}
                  height={Math.max(1, height - 10)}
                  fill="none"
                  stroke="#8c9891"
                  strokeWidth="0.8"
                />

                <text
                  x={cx}
                  y={cy + 2}
                  textAnchor="middle"
                  fontSize={
                    width < 75 || height < 60
                      ? "6"
                      : "7.5"
                  }
                  fontWeight="800"
                  fill="#41554d"
                  pointerEvents="none"
                >
                  {roomName
                    .toUpperCase()
                    .slice(0, 18)}
                </text>

                {width > 100 && height > 75 && (
                  <text
                    x={cx}
                    y={cy + 14}
                    textAnchor="middle"
                    fontSize="5.5"
                    fill="#77847d"
                    pointerEvents="none"
                  >
                    {Math.round(width)} ×{" "}
                    {Math.round(height)}
                  </text>
                )}
              </g>
            );
          })}

          {/* Walls */}
          {walls.map((wall, index) => {
            const x = safeNumber(wall.x);
            const y = safeNumber(wall.y);

            const width = safeNumber(
              wall.width,
              100
            );

            const height = safeNumber(
              wall.height,
              7
            );

            const rotation = safeNumber(
              wall.rotation,
              0
            );

            const cx = x + width / 2;
            const cy = y + height / 2;

            return (
              <g
                key={wall.id || `wall-${index}`}
                transform={`rotate(${rotation} ${cx} ${cy})`}
              >
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill="#344a41"
                />
              </g>
            );
          })}

          {/* Furniture */}
          {furniture.map((piece, index) => {
            const x = safeNumber(piece.x);
            const y = safeNumber(piece.y);

            const width = Math.max(
              8,
              safeNumber(piece.width, 30)
            );

            const height = Math.max(
              8,
              safeNumber(piece.height, 20)
            );

            const rotation = safeNumber(
              piece.rotation,
              0
            );

            const cx = x + width / 2;
            const cy = y + height / 2;

            return (
              <g
                key={
                  piece.id ||
                  `furniture-${index}`
                }
                transform={`rotate(${rotation} ${cx} ${cy})`}
              >
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  rx="3"
                  fill="#eef2f0"
                  stroke="#82928a"
                  strokeWidth="1"
                />

                {width > 35 && height > 18 && (
                  <text
                    x={cx}
                    y={cy + 2}
                    textAnchor="middle"
                    fontSize="4.5"
                    fontWeight="700"
                    fill="#53645b"
                  >
                    {(piece.name || "")
                      .slice(0, 12)}
                  </text>
                )}
              </g>
            );
          })}

          {/* Doors */}
          {doors.map((door, index) => {
            const x = safeNumber(door.x);
            const y = safeNumber(door.y);

            const width = Math.max(
              10,
              safeNumber(door.width, 42)
            );

            const height = Math.max(
              5,
              safeNumber(door.height, 10)
            );

            const rotation = safeNumber(
              door.rotation,
              0
            );

            const cx = x + width / 2;
            const cy = y + height / 2;

            return (
              <g
                key={door.id || `door-${index}`}
                transform={`rotate(${rotation} ${cx} ${cy})`}
              >
                <rect
                  x={x - 2}
                  y={y - 2}
                  width={width + 4}
                  height={height + 4}
                  fill="#fff"
                />

                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill="#fff"
                  stroke="#344a41"
                  strokeWidth="1.4"
                />

                <path
                  d={`M ${x} ${
                    y + height
                  } A ${width} ${width} 0 0 1 ${
                    x + width
                  } ${y}`}
                  fill="none"
                  stroke="#78847d"
                  strokeWidth="0.8"
                />
              </g>
            );
          })}

          {/* Windows */}
          {windows.map((win, index) => {
            const x = safeNumber(win.x);
            const y = safeNumber(win.y);

            const width = Math.max(
              8,
              safeNumber(win.width, 50)
            );

            const height = Math.max(
              4,
              safeNumber(win.height, 8)
            );

            const rotation = safeNumber(
              win.rotation,
              0
            );

            const cx = x + width / 2;
            const cy = y + height / 2;

            return (
              <g
                key={
                  win.id ||
                  `window-${index}`
                }
                transform={`rotate(${rotation} ${cx} ${cy})`}
              >
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill="#d7e9e6"
                  stroke="#55756d"
                  strokeWidth="1.4"
                />

                <path
                  d={
                    width >= height
                      ? `M ${
                          x + width / 2
                        } ${y} V ${
                          y + height
                        }`
                      : `M ${x} ${
                          y + height / 2
                        } H ${
                          x + width
                        }`
                  }
                  stroke="#76918a"
                  strokeWidth="0.8"
                />
              </g>
            );
          })}

          <text
            x="347"
            y="600"
            textAnchor="middle"
            fontSize="7"
            fontWeight="700"
            fill="#758078"
          >
            MAIN ENTRY ↓
          </text>
        </svg>
      </div>

      {/* Preview badge */}
      <div className="absolute left-4 top-4 z-20 flex items-center gap-1.5 rounded-full bg-[#0b5d46] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white shadow-lg">
        <Eye size={11} />
        2D Floor Plan
      </div>

      {/* Room count */}
      <div className="absolute bottom-4 right-4 z-20 rounded-full border border-white/70 bg-white/95 px-3 py-1.5 text-[9px] font-bold text-[#315348] shadow-md backdrop-blur">
        {rooms.length}{" "}
        {rooms.length === 1 ? "Room" : "Rooms"}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              PROJECT CARD                                  */
/* -------------------------------------------------------------------------- */

function ProjectCard({
  design,
  onEdit,
  onDelete,
  onView3D,
  viewMode,
}) {
  const roomCount =
    design.rooms?.length ||
    design.floorPlanData?.rooms?.length ||
    0;

  const bathroomCount =
    design.rooms?.filter(
      (room) =>
        normalizeType(room.type) ===
        "bathroom"
    ).length ||
    design.floorPlanData?.rooms?.filter(
      (room) =>
        normalizeType(room.type) ===
        "bathroom"
    ).length ||
    0;

  const plotWidth =
    design.project?.plotWidth ||
    design.floorPlanData?.project?.plotWidth ||
    30;

  const plotLength =
    design.project?.plotLength ||
    design.floorPlanData?.project?.plotLength ||
    60;

  if (viewMode === "list") {
    return (
      <article className="group overflow-hidden rounded-[26px] border border-[#d8e0d8] bg-white shadow-[0_12px_35px_rgba(30,53,43,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-[#bfd0c2] hover:shadow-[0_20px_50px_rgba(30,53,43,0.11)]">
        <div className="grid md:grid-cols-[300px_minmax(0,1fr)_auto]">
          <div className="h-[245px] md:h-full">
            <FloorPlanPreview design={design} />
          </div>

          <div className="flex min-w-0 flex-col justify-between p-6">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0b5d46]" />
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#87928b]">
                      Saved Design
                    </p>
                  </div>

                  <h3 className="truncate font-serif text-2xl font-bold text-[#173d32]">
                    {design.project?.name ||
                      design.name ||
                      "Untitled Project"}
                  </h3>
                </div>

                <span className="shrink-0 rounded-full bg-[#0b5d46] px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
                  2D
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-xl border border-[#e0e6df] bg-[#f6f8f4] px-3 py-2 text-[9px] font-semibold text-[#53645b]">
                  {plotWidth} × {plotLength} ft
                </span>

                <span className="rounded-xl border border-[#e0e6df] bg-[#f6f8f4] px-3 py-2 text-[9px] font-semibold text-[#53645b]">
                  {roomCount} Rooms
                </span>

                <span className="rounded-xl border border-[#e0e6df] bg-[#f6f8f4] px-3 py-2 text-[9px] font-semibold text-[#53645b]">
                  {bathroomCount} Baths
                </span>
              </div>

              <div className="mt-5 flex items-center gap-2 text-[10px] text-[#8a958f]">
                <Clock3 size={13} />
                Edited{" "}
                {formatDate(
                  design.updatedAt ||
                    design.floorPlanData?.savedAt
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onEdit(design)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0b5d46] px-5 py-3 text-[10px] font-bold text-white shadow-sm transition hover:bg-[#084936] hover:shadow-md"
              >
                <Pencil size={13} />
                Edit Design
              </button>

              <button
                type="button"
                onClick={() =>
                  onView3D(design)
                }
                className="inline-flex items-center gap-2 rounded-xl border border-[#cfdad0] bg-white px-5 py-3 text-[10px] font-bold text-[#315348] transition hover:border-[#0b5d46] hover:bg-[#f1f6f0]"
              >
                <Box size={13} />
                View 3D
              </button>
            </div>
          </div>

          <div className="flex items-end justify-end border-t border-[#edf0eb] p-4 md:border-l md:border-t-0">
            <button
              type="button"
              onClick={() => onDelete(design)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#ead7d3] bg-[#fff9f7] text-[#a46158] transition hover:border-[#d6aaa3] hover:bg-[#fff0ec]"
              title="Delete design"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group overflow-hidden rounded-[28px] border border-[#d8e0d8] bg-white shadow-[0_12px_35px_rgba(30,53,43,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#bfd0c2] hover:shadow-[0_22px_55px_rgba(30,53,43,0.12)]">
      <div className="relative overflow-hidden">
        <FloorPlanPreview design={design} />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#173d32]/15 to-transparent opacity-0 transition group-hover:opacity-100" />
      </div>

      <div className="p-5.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0b5d46]" />

              <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#87928b]">
                Saved Design
              </p>
            </div>

            <h3 className="truncate font-serif text-xl font-bold text-[#173d32]">
              {design.project?.name ||
                design.name ||
                "Untitled Project"}
            </h3>
          </div>

          <span className="shrink-0 rounded-full bg-[#0b5d46] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white shadow-sm">
            2D PLAN
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-[#e2e7e0] bg-[#f6f8f4] px-2 py-3 text-center transition group-hover:bg-[#f2f6f0]">
            <Maximize
              size={14}
              className="mx-auto text-[#315348]"
            />

            <p className="mt-1.5 text-[9px] font-bold text-[#315348]">
              {plotWidth} × {plotLength}
            </p>

            <p className="text-[8px] text-[#8b9690]">
              Plot ft
            </p>
          </div>

          <div className="rounded-xl border border-[#e2e7e0] bg-[#f6f8f4] px-2 py-3 text-center transition group-hover:bg-[#f2f6f0]">
            <BedDouble
              size={14}
              className="mx-auto text-[#315348]"
            />

            <p className="mt-1.5 text-[9px] font-bold text-[#315348]">
              {roomCount}
            </p>

            <p className="text-[8px] text-[#8b9690]">
              Rooms
            </p>
          </div>

          <div className="rounded-xl border border-[#e2e7e0] bg-[#f6f8f4] px-2 py-3 text-center transition group-hover:bg-[#f2f6f0]">
            <Bath
              size={14}
              className="mx-auto text-[#315348]"
            />

            <p className="mt-1.5 text-[9px] font-bold text-[#315348]">
              {bathroomCount}
            </p>

            <p className="text-[8px] text-[#8b9690]">
              Baths
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-[10px] text-[#8a958f]">
          <Clock3 size={13} />

          <span>
            Edited{" "}
            {formatDate(
              design.updatedAt ||
                design.floorPlanData?.savedAt
            )}
          </span>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(design)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0b5d46] px-3 py-3 text-[10px] font-bold text-white shadow-sm transition hover:bg-[#084936] hover:shadow-md"
          >
            <Pencil size={13} />
            Edit Design
          </button>

          <button
            type="button"
            onClick={() =>
              onView3D(design)
            }
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#cfdad0] bg-white px-3 py-3 text-[10px] font-bold text-[#315348] transition hover:border-[#0b5d46] hover:bg-[#f1f6f0]"
          >
            <Box size={13} />
            View 3D
          </button>

          <button
            type="button"
            onClick={() => onDelete(design)}
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-[#ead7d3] bg-[#fff9f7] text-[#a46158] transition hover:border-[#d6aaa3] hover:bg-[#fff0ec]"
            title="Delete design"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
/* -------------------------------------------------------------------------- */
/*                              MAIN PAGE                                     */
/* -------------------------------------------------------------------------- */

export default function MyDesigns() {
  const navigate = useNavigate();

  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  /* ------------------------------------------------------------------------ */
  /*                              LOAD PROJECTS                               */
  /* ------------------------------------------------------------------------ */

  const loadProjects = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      let cloudProjects = [];

      try {
        const projects = await listProjects();

        if (Array.isArray(projects)) {
          cloudProjects = await Promise.all(
            projects.map(async (item) => {
              try {
                const fullProject = await getProject(
                  item._id
                );

                return {
                  ...item,
                  ...fullProject,
                  floorPlanData:
                    fullProject?.floorPlanData ||
                    item?.floorPlanData ||
                    {},
                };
              } catch (error) {
                console.warn(
                  "Could not load project:",
                  item?._id,
                  error
                );

                return item;
              }
            })
          );
        }
      } catch (error) {
        console.warn(
          "Cloud projects could not be loaded:",
          error
        );
      }

      /* -------------------------------------------------------------------- */
      /*                         LOCAL FALLBACK                               */
      /* -------------------------------------------------------------------- */

      let localProjects = [];

      try {
        const currentPlan = localStorage.getItem(
          "dreamhouse_current_plan"
        );

        const oldPlan = localStorage.getItem(
          STORAGE_KEY
        );

        if (currentPlan) {
          const parsed = JSON.parse(currentPlan);

          if (parsed) {
            localProjects.push({
              id: "local-current",
              _id: "local-current",
              name:
                parsed?.project?.name ||
                "Current Design",
              project: parsed?.project || {},
              floorPlanData: parsed,
              updatedAt:
                parsed?.savedAt ||
                new Date().toISOString(),
            });
          }
        }

        if (oldPlan) {
          const parsedOld = JSON.parse(oldPlan);

          if (
            parsedOld &&
            !localProjects.some(
              (item) =>
                item?.floorPlanData?.project?.name ===
                parsedOld?.project?.name
            )
          ) {
            localProjects.push({
              id: "local-old",
              _id: "local-old",
              name:
                parsedOld?.project?.name ||
                "Saved Design",
              project:
                parsedOld?.project || {},
              floorPlanData: parsedOld,
              updatedAt:
                parsedOld?.savedAt ||
                new Date().toISOString(),
            });
          }
        }
      } catch (error) {
        console.warn(
          "Local designs could not be loaded:",
          error
        );
      }

      /* -------------------------------------------------------------------- */
      /*                           MERGE DATA                                  */
      /* -------------------------------------------------------------------- */

      const combined = [
        ...cloudProjects,
        ...localProjects,
      ];

      const unique = [];

      const seen = new Set();

      combined.forEach((item) => {
        const key =
          item?._id ||
          item?.id ||
          item?.floorPlanData?.project?.name ||
          Math.random();

        if (!seen.has(key)) {
          seen.add(key);
          unique.push(item);
        }
      });

      /* -------------------------------------------------------------------- */
      /*                         NORMALIZE DATA                                */
      /* -------------------------------------------------------------------- */

      const normalized = unique.map((item) => {
        const plan = item.floorPlanData || {};

        const project = plan.project || {
          name:
            item.name ||
            "Untitled Project",

          plotWidth: 30,
          plotLength: 60,
          floors: 1,
        };

        return {
          ...item,

          id:
            item._id ||
            item.id ||
            `design-${Date.now()}`,

          name:
            item.name ||
            project.name ||
            "Untitled Project",

          project,

          floorPlanData: plan,

          rooms: Array.isArray(plan.rooms)
            ? plan.rooms
            : [],

          doors: Array.isArray(plan.doors)
            ? plan.doors
            : [],

          windows: Array.isArray(plan.windows)
            ? plan.windows
            : [],

          walls: Array.isArray(plan.walls)
            ? plan.walls
            : [],

          furniture: Array.isArray(
            plan.furniture
          )
            ? plan.furniture
            : [],
        };
      });

      setDesigns(normalized);
    } catch (error) {
      console.error(
        "Failed to load designs:",
        error
      );

      setDesigns([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  /* ------------------------------------------------------------------------ */
  /*                              SEARCH                                      */
  /* ------------------------------------------------------------------------ */

  const filteredDesigns = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return designs;
    }

    return designs.filter((design) => {
      const name =
        design?.project?.name ||
        design?.name ||
        "";

      return name
        .toLowerCase()
        .includes(query);
    });
  }, [designs, search]);

  /* ------------------------------------------------------------------------ */
  /*                              ACTIONS                                     */
  /* ------------------------------------------------------------------------ */

  const handleEdit = (design) => {
    const plan =
      design?.floorPlanData || {};

    try {
      localStorage.setItem(
        "dreamhouse_current_plan",
        JSON.stringify(plan)
      );
    } catch (error) {
      console.warn(
        "Could not save current plan:",
        error
      );
    }

    navigate("/floor-plan-editor", {
      state: {
        projectId:
          design?._id ||
          design?.id,
        design,
      },
    });
  };

  const handleView3D = (design) => {
    navigate("/3d-view", {
      state: {
        projectId:
          design?._id ||
          design?.id,
        design,
      },
    });
  };

  const handleDelete = async (design) => {
    const projectId =
      design?._id ||
      design?.id;

    if (
      !window.confirm(
        `Delete "${design?.project?.name || design?.name || "this design"}"?`
      )
    ) {
      return;
    }

    try {
      if (
        projectId &&
        !String(projectId).startsWith("local-")
      ) {
        await deleteProject(projectId);
      }

      setDesigns((previous) =>
        previous.filter(
          (item) =>
            (item?._id || item?.id) !==
            projectId
        )
      );
    } catch (error) {
      console.error(
        "Delete failed:",
        error
      );

      alert(
        "Unable to delete this design. Please try again."
      );
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                               STATS                                      */
  /* ------------------------------------------------------------------------ */

  const totalRooms = designs.reduce(
    (total, design) =>
      total +
      (design?.rooms?.length || 0),
    0
  );

  const totalBathrooms = designs.reduce(
    (total, design) =>
      total +
      (design?.rooms?.filter(
        (room) =>
          normalizeType(room?.type) ===
          "bathroom"
      )?.length || 0),
    0
  );

  /* ------------------------------------------------------------------------ */
  /*                              RENDER                                      */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-[#f4f6f1] text-[#173d32]">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <header className="sticky top-0 z-40 border-b border-[#dfe5df] bg-[#fbfcf9]/95 shadow-[0_5px_25px_rgba(24,52,42,0.05)] backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1450px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="group flex h-10 w-10 items-center justify-center rounded-xl border border-[#d8e1d9] bg-white text-[#315348] shadow-sm transition hover:border-[#0b5d46] hover:bg-[#0b5d46] hover:text-white"
              title="Back to Dashboard"
            >
              <ArrowLeft
                size={18}
                className="transition group-hover:-translate-x-0.5"
              />
            </Link>

            <div className="hidden h-8 w-px bg-[#dfe5df] sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <span className="hidden rounded-full bg-[#0b5d46] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.15em] text-white sm:inline-flex">
                  Workspace
                </span>

                <span className="h-1.5 w-1.5 rounded-full bg-[#8ca497]" />

                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#829089]">
                  Architecture Studio
                </p>
              </div>

              <h1 className="mt-0.5 font-serif text-xl font-bold tracking-tight text-[#173d32] sm:text-2xl">
                My Designs
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() =>
                loadProjects(true)
              }
              disabled={refreshing}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d8e1d9] bg-white text-[#315348] shadow-sm transition hover:border-[#0b5d46] hover:bg-[#0b5d46] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              title="Refresh designs"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />
            </button>

            <Link
              to="/floor-plan-editor"
              className="group inline-flex h-10 items-center gap-2 rounded-xl bg-[#0b5d46] px-4 text-[10px] font-bold text-white shadow-[0_7px_20px_rgba(11,93,70,0.2)] transition hover:bg-[#084936] hover:shadow-[0_10px_25px_rgba(11,93,70,0.25)] sm:px-5"
            >
              <Plus
                size={15}
                className="transition group-hover:rotate-90"
              />
              <span className="hidden sm:inline">
                New Design
              </span>
              <span className="sm:hidden">
                New
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN                                                               */}
      {/* ------------------------------------------------------------------ */}

      <main className="mx-auto max-w-[1450px] px-4 pb-28 pt-5 sm:px-6 sm:pt-7 lg:px-8 lg:pb-12">
        {/* -------------------------------------------------------------- */}
        {/* HERO                                                           */}
        {/* -------------------------------------------------------------- */}

        <section className="relative overflow-hidden rounded-[30px] bg-[#123f33] shadow-[0_20px_55px_rgba(18,63,51,0.16)]">
          {/* Decorative architectural lines */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-24 -top-32 h-[360px] w-[360px] rounded-full border border-white/10" />

            <div className="absolute -right-10 -top-20 h-[260px] w-[260px] rounded-full border border-white/[0.07]" />

            <div className="absolute bottom-[-100px] left-[35%] h-[300px] w-[300px] rounded-full border border-white/[0.05]" />

            <div className="absolute right-12 top-10 hidden h-[180px] w-[240px] rotate-[-8deg] border border-white/[0.08] lg:block">
              <div className="absolute left-1/2 top-0 h-full w-px bg-white/[0.07]" />
              <div className="absolute left-0 top-1/2 h-px w-full bg-white/[0.07]" />
            </div>

            <div className="absolute bottom-0 left-0 h-px w-[55%] bg-white/10" />
          </div>

          <div className="relative z-10 grid items-center gap-8 px-6 py-8 sm:px-9 sm:py-10 lg:grid-cols-[1fr_320px] lg:px-12 lg:py-12">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                <Sparkles size={11} />
                Your Architecture Workspace
              </div>

              <h2 className="max-w-2xl font-serif text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl">
                Turn your ideas into a
                <span className="text-[#d9e9df]">
                  {" "}
                  thoughtful home plan.
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-[#d5e1dc] sm:text-[15px]">
                Manage your saved floor plans,
                refine room layouts, and move
                from a precise 2D plan to an
                immersive 3D view whenever
                you are ready.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/floor-plan-editor"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-[10px] font-bold text-[#123f33] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#f3f7f3]"
                >
                  <Plus size={14} />
                  Create New Design
                </Link>

                <Link
                  to="/ai-planner"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-[10px] font-bold text-white backdrop-blur-sm transition hover:bg-white/15"
                >
                  <Sparkles size={14} />
                  AI Planner
                </Link>
              </div>
            </div>

            {/* Architectural visual */}
            <div className="relative hidden h-[220px] lg:block">
              <div className="absolute inset-5 rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-sm" />

              <div className="absolute inset-12 rotate-[-4deg] rounded-[18px] border border-white/15 bg-[#edf2eb]/[0.08] p-4">
                <div className="h-full w-full border border-white/20 p-3">
                  <div className="grid h-full grid-cols-3 grid-rows-3 gap-2">
                    <div className="col-span-2 border border-white/20" />
                    <div className="border border-white/20" />
                    <div className="border border-white/20" />
                    <div className="col-span-2 border border-white/20" />
                    <div className="col-span-2 border border-white/20" />
                    <div className="border border-white/20" />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 right-2 rounded-xl bg-white px-3 py-2 shadow-xl">
                <p className="text-[8px] font-bold uppercase tracking-widest text-[#7d8982]">
                  Floor Plan
                </p>
                <p className="mt-0.5 text-xs font-bold text-[#123f33]">
                  Designed by you
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* STATS                                                           */}
        {/* -------------------------------------------------------------- */}

        <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="group rounded-[22px] border border-[#dce4dc] bg-white p-4 shadow-[0_8px_28px_rgba(30,53,43,0.045)] transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b5d46] text-white shadow-sm">
                <Home size={17} />
              </div>

              <span className="text-[8px] font-bold uppercase tracking-widest text-[#a0aaa4]">
                Saved
              </span>
            </div>

            <p className="mt-4 font-serif text-2xl font-bold text-[#173d32]">
              {designs.length}
            </p>

            <p className="mt-0.5 text-[9px] font-medium text-[#89958e]">
              Total designs
            </p>
          </div>

          <div className="group rounded-[22px] border border-[#dce4dc] bg-white p-4 shadow-[0_8px_28px_rgba(30,53,43,0.045)] transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b5d46] text-white shadow-sm">
                <BedDouble size={17} />
              </div>

              <span className="text-[8px] font-bold uppercase tracking-widest text-[#a0aaa4]">
                Layout
              </span>
            </div>

            <p className="mt-4 font-serif text-2xl font-bold text-[#173d32]">
              {totalRooms}
            </p>

            <p className="mt-0.5 text-[9px] font-medium text-[#89958e]">
              Rooms planned
            </p>
          </div>

          <div className="group rounded-[22px] border border-[#dce4dc] bg-white p-4 shadow-[0_8px_28px_rgba(30,53,43,0.045)] transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b5d46] text-white shadow-sm">
                <Bath size={17} />
              </div>

              <span className="text-[8px] font-bold uppercase tracking-widest text-[#a0aaa4]">
                Utility
              </span>
            </div>

            <p className="mt-4 font-serif text-2xl font-bold text-[#173d32]">
              {totalBathrooms}
            </p>

            <p className="mt-0.5 text-[9px] font-medium text-[#89958e]">
              Bathrooms
            </p>
          </div>

          <div className="group rounded-[22px] border border-[#dce4dc] bg-white p-4 shadow-[0_8px_28px_rgba(30,53,43,0.045)] transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b5d46] text-white shadow-sm">
                <Box size={17} />
              </div>

              <span className="text-[8px] font-bold uppercase tracking-widest text-[#a0aaa4]">
                View
              </span>
            </div>

            <p className="mt-4 font-serif text-2xl font-bold text-[#173d32]">
              2D + 3D
            </p>

            <p className="mt-0.5 text-[9px] font-medium text-[#89958e]">
              Design experience
            </p>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* TOOLBAR                                                         */}
        {/* -------------------------------------------------------------- */}

        <section className="mt-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0b5d46]" />

                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#87928b]">
                  Your Collection
                </p>
              </div>

              <h2 className="mt-1 font-serif text-2xl font-bold text-[#173d32] sm:text-3xl">
                Saved Floor Plans
              </h2>

              <p className="mt-1 text-[11px] text-[#8a958f]">
                Browse and continue working on
                your home designs.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-[280px]">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89958e]"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search your designs..."
                  className="h-11 w-full rounded-xl border border-[#d8e1d9] bg-white pl-10 pr-4 text-[11px] font-medium text-[#315348] outline-none transition placeholder:text-[#a1aaa5] focus:border-[#0b5d46] focus:ring-4 focus:ring-[#0b5d46]/8"
                />
              </div>

              {/* View switcher */}
              <div className="flex h-11 rounded-xl border border-[#d8e1d9] bg-white p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() =>
                    setViewMode("grid")
                  }
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 text-[9px] font-bold transition sm:flex-none ${
                    viewMode === "grid"
                      ? "bg-[#0b5d46] text-white shadow-sm"
                      : "text-[#7f8b84] hover:bg-[#f2f5f1] hover:text-[#315348]"
                  }`}
                >
                  <Grid3X3 size={14} />
                  <span className="hidden sm:inline">
                    Grid
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setViewMode("list")
                  }
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 text-[9px] font-bold transition sm:flex-none ${
                    viewMode === "list"
                      ? "bg-[#0b5d46] text-white shadow-sm"
                      : "text-[#7f8b84] hover:bg-[#f2f5f1] hover:text-[#315348]"
                  }`}
                >
                  <List size={14} />
                  <span className="hidden sm:inline">
                    List
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* CONTENT                                                         */}
        {/* -------------------------------------------------------------- */}

        <section className="mt-6">
          {/* Loading */}
          {loading && (
            <div
              className={
                viewMode === "grid"
                  ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
                  : "space-y-4"
              }
            >
              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="overflow-hidden rounded-[28px] border border-[#e0e6df] bg-white"
                  >
                    <div className="h-[250px] animate-pulse bg-[#e7ebe5]" />

                    <div className="space-y-3 p-5">
                      <div className="h-4 w-1/2 animate-pulse rounded bg-[#e7ebe5]" />

                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-16 animate-pulse rounded-xl bg-[#eef1ec]" />
                        <div className="h-16 animate-pulse rounded-xl bg-[#eef1ec]" />
                        <div className="h-16 animate-pulse rounded-xl bg-[#eef1ec]" />
                      </div>

                      <div className="h-10 animate-pulse rounded-xl bg-[#eef1ec]" />
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* Empty search */}
          {!loading &&
            filteredDesigns.length === 0 &&
            designs.length > 0 && (
              <div className="rounded-[28px] border border-[#dce4dc] bg-white px-6 py-16 text-center shadow-[0_12px_35px_rgba(30,53,43,0.05)]">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0b5d46] text-white shadow-lg">
                  <Search size={25} />
                </div>

                <h3 className="mt-5 font-serif text-2xl font-bold text-[#173d32]">
                  No matching designs
                </h3>

                <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#89958e]">
                  We couldn't find a saved design
                  matching "{search}". Try another
                  project name.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="mt-6 rounded-xl bg-[#0b5d46] px-5 py-3 text-[10px] font-bold text-white shadow-md transition hover:bg-[#084936]"
                >
                  Clear Search
                </button>
              </div>
            )}

          {/* No designs */}
          {!loading &&
            designs.length === 0 && (
              <div className="overflow-hidden rounded-[30px] border border-[#dce4dc] bg-white px-6 py-16 text-center shadow-[0_15px_45px_rgba(30,53,43,0.06)] sm:py-20">
                <div className="relative mx-auto w-fit">
                  <div className="absolute inset-0 rounded-3xl bg-[#0b5d46]/10 blur-xl" />

                  <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-[#0b5d46] text-white shadow-[0_15px_35px_rgba(11,93,70,0.22)]">
                    <Home
                      size={31}
                      strokeWidth={1.6}
                    />
                  </div>
                </div>

                <div className="mx-auto mt-6 max-w-lg">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#87928b]">
                    Your workspace is ready
                  </p>

                  <h3 className="mt-2 font-serif text-3xl font-bold text-[#173d32]">
                    Create your first home
                    design
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#89958e]">
                    Start with a plot size, arrange
                    your rooms in 2D, and refine
                    your design whenever you want.
                  </p>

                  <Link
                    to="/floor-plan-editor"
                    className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#0b5d46] px-6 py-3.5 text-[10px] font-bold text-white shadow-[0_8px_22px_rgba(11,93,70,0.2)] transition hover:-translate-y-0.5 hover:bg-[#084936] hover:shadow-lg"
                  >
                    <Plus size={15} />
                    Create Your First Design
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            )}

          {/* Designs */}
          {!loading &&
            filteredDesigns.length > 0 && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
                    : "space-y-4"
                }
              >
                {filteredDesigns.map(
                  (design) => (
                    <ProjectCard
                      key={
                        design.id ||
                        design._id
                      }
                      design={design}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onView3D={
                        handleView3D
                      }
                      viewMode={viewMode}
                    />
                  )
                )}
              </div>
            )}
        </section>

        {/* -------------------------------------------------------------- */}
        {/* BOTTOM INFO                                                     */}
        {/* -------------------------------------------------------------- */}

        {!loading &&
          designs.length > 0 && (
            <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl border border-[#dce4dc] bg-white px-5 py-4 sm:flex-row">
              <p className="text-[10px] text-[#89958e]">
                Showing{" "}
                <span className="font-bold text-[#315348]">
                  {filteredDesigns.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-[#315348]">
                  {designs.length}
                </span>{" "}
                saved designs
              </p>

              <Link
                to="/floor-plan-editor"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0b5d46] px-4 py-2.5 text-[9px] font-bold text-white transition hover:bg-[#084936]"
              >
                <Plus size={12} />
                Add New Design
              </Link>
            </div>
          )}
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* MOBILE BOTTOM NAV                                                  */}
      {/* ------------------------------------------------------------------ */}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#dce4dc] bg-[#fbfcf9]/95 px-3 py-2.5 shadow-[0_-8px_30px_rgba(30,53,43,0.08)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around">
          <Link
            to="/dashboard"
            className="flex min-w-[70px] flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[#87928b] transition hover:text-[#315348]"
          >
            <Home size={18} />

            <span className="text-[8px] font-bold">
              Dashboard
            </span>
          </Link>

          <div className="flex min-w-[70px] flex-col items-center gap-1 rounded-xl bg-[#0b5d46] px-3 py-1.5 text-white shadow-sm">
            <Grid3X3 size={18} />

            <span className="text-[8px] font-bold">
              Designs
            </span>
          </div>

          <Link
            to="/floor-plan-editor"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0b5d46] text-white shadow-[0_7px_20px_rgba(11,93,70,0.25)] transition hover:bg-[#084936]"
          >
            <Plus size={20} />
          </Link>

          <Link
            to="/ai-planner"
            className="flex min-w-[70px] flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[#87928b] transition hover:text-[#315348]"
          >
            <Sparkles size={18} />

            <span className="text-[8px] font-bold">
              AI Planner
            </span>
          </Link>

          <Link
            to="/floor-plan-editor"
            className="flex min-w-[70px] flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[#87928b] transition hover:text-[#315348]"
          >
            <Pencil size={18} />

            <span className="text-[8px] font-bold">
              Editor
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
}