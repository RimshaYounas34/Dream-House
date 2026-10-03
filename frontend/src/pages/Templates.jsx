import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
export const templates = [
  {
    id: 1,
    name: "Modern Villa",
    category: "Modern",
    bedrooms: 4,
    bathrooms: 3,
    kitchens: 1,
    floors: 2,
    plot: "30 × 60 ft",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=90",
    description:
      "A spacious modern family villa with open living spaces, bedrooms, parking and outdoor areas.",
    rooms: [
      {
        id: "tv1-living",
        type: "living",
        name: "Living Room",
        x: 235,
        y: 55,
        width: 235,
        height: 115,
        rotation: 0,
      },
      {
        id: "tv1-kitchen",
        type: "kitchen",
        name: "Kitchen",
        x: 480,
        y: 55,
        width: 155,
        height: 115,
        rotation: 0,
      },
      {
        id: "tv1-dining",
        type: "dining",
        name: "Dining Room",
        x: 55,
        y: 185,
        width: 205,
        height: 105,
        rotation: 0,
      },
      {
        id: "tv1-stairs",
        type: "stairs",
        name: "Stairs",
        x: 275,
        y: 185,
        width: 85,
        height: 105,
        rotation: 0,
      },
      {
        id: "tv1-master",
        type: "bedroom",
        name: "Master Bedroom",
        x: 55,
        y: 305,
        width: 200,
        height: 105,
        rotation: 0,
      },
      {
        id: "tv1-bath1",
        type: "bathroom",
        name: "Attached Bathroom",
        x: 265,
        y: 305,
        width: 75,
        height: 75,
        rotation: 0,
      },
      {
        id: "tv1-bed2",
        type: "bedroom",
        name: "Bedroom 2",
        x: 350,
        y: 305,
        width: 190,
        height: 105,
        rotation: 0,
      },
      {
        id: "tv1-bath2",
        type: "bathroom",
        name: "Bathroom 2",
        x: 550,
        y: 305,
        width: 80,
        height: 75,
        rotation: 0,
      },
      {
        id: "tv1-bed3",
        type: "bedroom",
        name: "Bedroom 3",
        x: 55,
        y: 425,
        width: 245,
        height: 100,
        rotation: 0,
      },
      {
        id: "tv1-bed4",
        type: "bedroom",
        name: "Bedroom 4",
        x: 315,
        y: 425,
        width: 245,
        height: 100,
        rotation: 0,
      },
      {
        id: "tv1-bath3",
        type: "bathroom",
        name: "Bathroom 3",
        x: 570,
        y: 425,
        width: 60,
        height: 75,
        rotation: 0,
      },
      {
        id: "tv1-garage",
        type: "garage",
        name: "Garage",
        x: 55,
        y: 55,
        width: 170,
        height: 115,
        rotation: 0,
      },
    ],
  },

  {
    id: 2,
    name: "Family House",
    category: "Family",
    bedrooms: 3,
    bathrooms: 2,
    kitchens: 1,
    floors: 1,
    plot: "25 × 50 ft",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=90",
    description:
      "Comfortable single-storey family home with practical room placement and a spacious living area.",
    rooms: [
      {
        id: "fh-living",
        type: "living",
        name: "Living Room",
        x: 55,
        y: 55,
        width: 260,
        height: 125,
        rotation: 0,
      },
      {
        id: "fh-kitchen",
        type: "kitchen",
        name: "Kitchen",
        x: 330,
        y: 55,
        width: 170,
        height: 125,
        rotation: 0,
      },
      {
        id: "fh-dining",
        type: "dining",
        name: "Dining Room",
        x: 55,
        y: 195,
        width: 200,
        height: 95,
        rotation: 0,
      },
      {
        id: "fh-bed1",
        type: "bedroom",
        name: "Master Bedroom",
        x: 270,
        y: 195,
        width: 230,
        height: 105,
        rotation: 0,
      },
      {
        id: "fh-bed2",
        type: "bedroom",
        name: "Bedroom 2",
        x: 55,
        y: 315,
        width: 210,
        height: 105,
        rotation: 0,
      },
      {
        id: "fh-bed3",
        type: "bedroom",
        name: "Bedroom 3",
        x: 280,
        y: 315,
        width: 220,
        height: 105,
        rotation: 0,
      },
      {
        id: "fh-bath1",
        type: "bathroom",
        name: "Bathroom 1",
        x: 55,
        y: 440,
        width: 105,
        height: 70,
        rotation: 0,
      },
      {
        id: "fh-bath2",
        type: "bathroom",
        name: "Bathroom 2",
        x: 175,
        y: 440,
        width: 105,
        height: 70,
        rotation: 0,
      },
      {
        id: "fh-garage",
        type: "garage",
        name: "Parking",
        x: 295,
        y: 440,
        width: 205,
        height: 70,
        rotation: 0,
      },
    ],
  },

  {
    id: 3,
    name: "Luxury Villa",
    category: "Luxury",
    bedrooms: 5,
    bathrooms: 4,
    kitchens: 2,
    floors: 2,
    plot: "40 × 60 ft",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=90",
    description:
      "Large luxury villa concept with multiple bedrooms, bathrooms, kitchens, garage and entertainment spaces.",
    rooms: [
      {
        id: "lv-living",
        type: "living",
        name: "Grand Living Room",
        x: 55,
        y: 55,
        width: 300,
        height: 125,
        rotation: 0,
      },
      {
        id: "lv-kitchen1",
        type: "kitchen",
        name: "Main Kitchen",
        x: 375,
        y: 55,
        width: 120,
        height: 125,
        rotation: 0,
      },
      {
        id: "lv-kitchen2",
        type: "kitchen",
        name: "Dirty Kitchen",
        x: 510,
        y: 55,
        width: 120,
        height: 125,
        rotation: 0,
      },
      {
        id: "lv-dining",
        type: "dining",
        name: "Dining Room",
        x: 55,
        y: 195,
        width: 220,
        height: 105,
        rotation: 0,
      },
      {
        id: "lv-master",
        type: "bedroom",
        name: "Master Bedroom",
        x: 290,
        y: 195,
        width: 210,
        height: 105,
        rotation: 0,
      },
      {
        id: "lv-bed2",
        type: "bedroom",
        name: "Bedroom 2",
        x: 55,
        y: 315,
        width: 180,
        height: 105,
        rotation: 0,
      },
      {
        id: "lv-bed3",
        type: "bedroom",
        name: "Bedroom 3",
        x: 250,
        y: 315,
        width: 180,
        height: 105,
        rotation: 0,
      },
      {
        id: "lv-bed4",
        type: "bedroom",
        name: "Bedroom 4",
        x: 445,
        y: 315,
        width: 185,
        height: 105,
        rotation: 0,
      },
      {
        id: "lv-bed5",
        type: "bedroom",
        name: "Bedroom 5",
        x: 55,
        y: 440,
        width: 180,
        height: 85,
        rotation: 0,
      },
      {
        id: "lv-bath1",
        type: "bathroom",
        name: "Bathroom 1",
        x: 250,
        y: 440,
        width: 85,
        height: 75,
        rotation: 0,
      },
      {
        id: "lv-bath2",
        type: "bathroom",
        name: "Bathroom 2",
        x: 350,
        y: 440,
        width: 85,
        height: 75,
        rotation: 0,
      },
      {
        id: "lv-garage",
        type: "garage",
        name: "Garage",
        x: 450,
        y: 440,
        width: 180,
        height: 85,
        rotation: 0,
      },
    ],
  },

  {
    id: 4,
    name: "Minimal House",
    category: "Minimal",
    bedrooms: 3,
    bathrooms: 2,
    kitchens: 1,
    floors: 1,
    plot: "30 × 50 ft",
    image:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=90",
    description:
      "Clean and minimal home layout designed for comfortable everyday family living.",
    rooms: [
      {
        id: "mh-living",
        type: "living",
        name: "Living Room",
        x: 55,
        y: 55,
        width: 230,
        height: 120,
        rotation: 0,
      },
      {
        id: "mh-kitchen",
        type: "kitchen",
        name: "Kitchen",
        x: 300,
        y: 55,
        width: 180,
        height: 120,
        rotation: 0,
      },
      {
        id: "mh-bed1",
        type: "bedroom",
        name: "Master Bedroom",
        x: 55,
        y: 190,
        width: 200,
        height: 110,
        rotation: 0,
      },
      {
        id: "mh-bed2",
        type: "bedroom",
        name: "Bedroom 2",
        x: 270,
        y: 190,
        width: 210,
        height: 110,
        rotation: 0,
      },
      {
        id: "mh-bed3",
        type: "bedroom",
        name: "Bedroom 3",
        x: 55,
        y: 315,
        width: 200,
        height: 105,
        rotation: 0,
      },
      {
        id: "mh-bath1",
        type: "bathroom",
        name: "Bathroom 1",
        x: 270,
        y: 315,
        width: 100,
        height: 80,
        rotation: 0,
      },
      {
        id: "mh-bath2",
        type: "bathroom",
        name: "Bathroom 2",
        x: 380,
        y: 315,
        width: 100,
        height: 80,
        rotation: 0,
      },
      {
        id: "mh-garage",
        type: "garage",
        name: "Parking",
        x: 270,
        y: 410,
        width: 210,
        height: 100,
        rotation: 0,
      },
    ],
  },

  {
    id: 5,
    name: "Compact Home",
    category: "Compact",
    bedrooms: 2,
    bathrooms: 2,
    kitchens: 1,
    floors: 1,
    plot: "25 × 40 ft",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=90",
    description:
      "Smart compact layout for smaller plots with efficient use of every available space.",
    rooms: [
      {
        id: "ch-living",
        type: "living",
        name: "Living Room",
        x: 55,
        y: 55,
        width: 220,
        height: 110,
        rotation: 0,
      },
      {
        id: "ch-kitchen",
        type: "kitchen",
        name: "Kitchen",
        x: 295,
        y: 55,
        width: 170,
        height: 110,
        rotation: 0,
      },
      {
        id: "ch-bed1",
        type: "bedroom",
        name: "Master Bedroom",
        x: 55,
        y: 185,
        width: 195,
        height: 105,
        rotation: 0,
      },
      {
        id: "ch-bed2",
        type: "bedroom",
        name: "Bedroom 2",
        x: 265,
        y: 185,
        width: 200,
        height: 105,
        rotation: 0,
      },
      {
        id: "ch-bath1",
        type: "bathroom",
        name: "Bathroom 1",
        x: 55,
        y: 310,
        width: 100,
        height: 75,
        rotation: 0,
      },
      {
        id: "ch-bath2",
        type: "bathroom",
        name: "Bathroom 2",
        x: 170,
        y: 310,
        width: 100,
        height: 75,
        rotation: 0,
      },
      {
        id: "ch-garage",
        type: "garage",
        name: "Parking",
        x: 285,
        y: 310,
        width: 180,
        height: 100,
        rotation: 0,
      },
    ],
  },

  {
    id: 6,
    name: "Double Storey Family",
    category: "Family",
    bedrooms: 4,
    bathrooms: 3,
    kitchens: 1,
    floors: 2,
    plot: "30 × 60 ft",
    image:
      "https://images.unsplash.com/photo-1600566753051-f0b89df2dd90?auto=format&fit=crop&w=1000&q=90",
    description:
      "Double-storey family plan with balanced private and shared spaces for a growing family.",
    rooms: [
      {
        id: "ds-living",
        type: "living",
        name: "Living Room",
        x: 55,
        y: 55,
        width: 240,
        height: 120,
        rotation: 0,
      },
      {
        id: "ds-kitchen",
        type: "kitchen",
        name: "Kitchen",
        x: 315,
        y: 55,
        width: 180,
        height: 120,
        rotation: 0,
      },
      {
        id: "ds-dining",
        type: "dining",
        name: "Dining Room",
        x: 55,
        y: 190,
        width: 200,
        height: 100,
        rotation: 0,
      },
      {
        id: "ds-stairs",
        type: "stairs",
        name: "Stairs",
        x: 270,
        y: 190,
        width: 90,
        height: 100,
        rotation: 0,
      },
      {
        id: "ds-master",
        type: "bedroom",
        name: "Master Bedroom",
        x: 375,
        y: 190,
        width: 120,
        height: 100,
        rotation: 0,
      },
      {
        id: "ds-bed2",
        type: "bedroom",
        name: "Bedroom 2",
        x: 55,
        y: 305,
        width: 200,
        height: 105,
        rotation: 0,
      },
      {
        id: "ds-bed3",
        type: "bedroom",
        name: "Bedroom 3",
        x: 270,
        y: 305,
        width: 200,
        height: 105,
        rotation: 0,
      },
      {
        id: "ds-bed4",
        type: "bedroom",
        name: "Bedroom 4",
        x: 55,
        y: 425,
        width: 200,
        height: 90,
        rotation: 0,
      },
      {
        id: "ds-bath1",
        type: "bathroom",
        name: "Bathroom 1",
        x: 270,
        y: 425,
        width: 90,
        height: 70,
        rotation: 0,
      },
      {
        id: "ds-bath2",
        type: "bathroom",
        name: "Bathroom 2",
        x: 375,
        y: 425,
        width: 90,
        height: 70,
        rotation: 0,
      },
      {
        id: "ds-garage",
        type: "garage",
        name: "Garage",
        x: 485,
        y: 305,
        width: 145,
        height: 110,
        rotation: 0,
      },
    ],
  },
];

const categories = [
  "All",
  "Modern",
  "Family",
  "Luxury",
  "Minimal",
  "Compact",
];

function Icon({ name, size = 18 }) {
  const icons = {
    home: (
      <>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9 21v-6h6v6" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    plan: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M8 4v16M16 4v16M3 10h5M16 14h5" />
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
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
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
      {icons[name]}
    </svg>
  );
}

function Sidebar({ navigate, logout }) {
  const items = [
    {
      label: "Dashboard",
      icon: "grid",
      path: "/dashboard",
    },
    {
      label: "My Projects",
      icon: "plan",
      path: "/my-designs",
    },
    {
      label: "Templates",
      icon: "plan",
      path: "/templates",
      active: true,
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

      {/* NAV */}
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
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[12px] text-white/65 hover:bg-white/5 hover:text-white"
        >
          <Icon name="logout" size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default function Templates() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const categoryMatch =
        category === "All" || template.category === category;

      const searchMatch =
        template.name.toLowerCase().includes(search.toLowerCase()) ||
        template.plot.toLowerCase().includes(search.toLowerCase()) ||
        template.category.toLowerCase().includes(search.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [category, search]);

  const logout = () => {
    localStorage.removeItem("dreamhouse_logged_in");
    localStorage.removeItem("dreamhouse_role");
    navigate("/login");
  };

  const useTemplate = (template) => {
    navigate("/floor-plan-editor", {
      state: {
        source: "template",
        templateId: template.id,
        templateName: template.name,
        rooms: template.rooms,
        plotWidth: Number(template.plot.split("×")[0]),
        plotLength: Number(
          template.plot.split("×")[1]?.replace("ft", "").trim()
        ),
        floors: template.floors,
        requirementsText: `${template.name}: ${template.bedrooms} bedrooms, ${template.bathrooms} bathrooms, ${template.kitchens} kitchen`,
        style: template.category,
        generatedByAI: false,
        fromTemplate: true,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f5ed] text-[#173d32]">
      <Sidebar navigate={navigate} logout={logout} />

      <main className="min-h-screen lg:ml-[245px]">
        {/* HEADER */}
        <header className="flex min-h-[76px] items-center justify-between border-b border-[#dfe3dc] bg-[#faf9f4] px-5 py-4 sm:px-8">
          <div>
            <p className="text-[9px] uppercase tracking-[2px] text-[#7b877f]">
              DreamHouse Planner
            </p>

            <h1 className="font-serif text-[22px] font-semibold">
              House Templates
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/create-project")}
              className="hidden items-center gap-2 rounded-xl bg-[#174d3d] px-4 py-2.5 text-[10px] font-semibold text-white transition hover:bg-[#103c2f] sm:flex"
            >
              <Icon name="plus" size={14} />
              Start From Scratch
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e3ece4] text-[11px] font-semibold text-[#174d3d]">
              {(localStorage.getItem("dreamhouse_name") || "U")
                .charAt(0)
                .toUpperCase()}
            </div>
          </div>
        </header>

        <div className="p-5 sm:p-7 xl:p-9">
          {/* HERO */}
          <section className="mb-7 rounded-3xl border border-[#dfe4dd] bg-[#e9efe8] p-6 sm:p-8">
            <div className="max-w-[650px]">
              <span className="inline-flex rounded-full bg-white px-3 py-1 text-[9px] font-semibold uppercase tracking-[1.5px] text-[#315f50]">
                Ready-made designs
              </span>

              <h2 className="mt-4 font-serif text-[30px] font-semibold leading-tight sm:text-[36px]">
                Start with a professionally designed home.
              </h2>

              <p className="mt-3 max-w-[570px] text-[11px] leading-6 text-[#68766e] sm:text-[12px]">
                Choose a house template that matches your needs, use it as
                your starting point, and then customize every room in the
                floor-plan editor.
              </p>
            </div>
          </section>

          {/* FILTER BAR */}
          <section className="mb-7">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap gap-2">
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`rounded-full px-4 py-2 text-[10px] font-semibold transition ${
                      category === item
                        ? "bg-[#174d3d] text-white"
                        : "border border-[#dce2da] bg-white text-[#647169] hover:border-[#b7c8bb]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="relative">
                <div className="absolute left-3 top-[10px] text-[#829087]">
                  <Icon name="search" size={14} />
                </div>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full rounded-xl border border-[#dce2da] bg-white py-2.5 pl-9 pr-4 text-[11px] outline-none focus:border-[#174d3d] sm:w-[230px]"
                />
              </div>
            </div>
          </section>

          {/* RESULT COUNT */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-[20px] font-semibold">
                Explore Templates
              </h3>

              <p className="mt-1 text-[10px] text-[#7b877f]">
                {filteredTemplates.length} designs available
              </p>
            </div>
          </div>

          {/* TEMPLATE GRID */}
          {filteredTemplates.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onUse={() => useTemplate(template)}
                  onDetails={() => setSelectedTemplate(template)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#cbd5cc] bg-white p-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf3ed] text-[#174d3d]">
                <Icon name="search" size={20} />
              </div>

              <h3 className="mt-4 font-serif text-[19px] font-semibold">
                No templates found
              </h3>

              <p className="mt-1 text-[11px] text-[#7c8881]">
                Try another search or category.
              </p>
            </div>
          )}

          {/* BOTTOM CTA */}
          <section className="mt-8 flex flex-col items-start justify-between gap-5 rounded-3xl bg-[#123d32] p-6 text-white sm:flex-row sm:items-center sm:p-7">
            <div>
              <h3 className="font-serif text-[22px] font-semibold">
                Want to design from scratch?
              </h3>

              <p className="mt-1 text-[10px] text-white/60">
                Create your own floor plan with complete control.
              </p>
            </div>

            <button
              onClick={() => navigate("/create-project")}
              className="rounded-xl bg-white px-5 py-3 text-[10px] font-semibold text-[#174d3d] transition hover:bg-[#edf3ed]"
            >
              Create New Plan →
            </button>
          </section>
        </div>
      </main>

      {/* DETAILS MODAL */}
      {selectedTemplate && (
        <TemplateModal
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          onUse={() => {
            useTemplate(selectedTemplate);
            setSelectedTemplate(null);
          }}
        />
      )}
    </div>
  );
}

function TemplateCard({ template, onUse, onDetails }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-[#dce2da] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#315348]/10">
      {/* IMAGE */}
      <div className="relative h-[205px] overflow-hidden">
        <img
          src={template.image}
          alt={template.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[1px] text-[#174d3d] backdrop-blur">
          {template.category}
        </div>

        <button
          onClick={onDetails}
          className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#174d3d] shadow-sm backdrop-blur transition hover:bg-white"
          title="View details"
        >
          <Icon name="eye" size={15} />
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-serif text-[18px] font-semibold">
              {template.name}
            </h3>

            <p className="mt-1 text-[10px] text-[#7a867f]">
              {template.plot}
            </p>
          </div>

          <span className="rounded-full bg-[#edf3ed] px-2.5 py-1 text-[8px] font-semibold text-[#315f50]">
            {template.floors} Floor{template.floors > 1 ? "s" : ""}
          </span>
        </div>

        {/* DETAILS */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <MiniDetail
            value={template.bedrooms}
            label="Bedrooms"
          />

          <MiniDetail
            value={template.bathrooms}
            label="Bathrooms"
          />

          <MiniDetail
            value={template.kitchens}
            label="Kitchen"
          />
        </div>

        {/* BUTTONS */}
        <div className="mt-5 flex gap-2">
          <button
            onClick={onDetails}
            className="flex-1 rounded-xl border border-[#cfd9d1] py-2.5 text-[10px] font-semibold text-[#315f50] transition hover:bg-[#f0f4ef]"
          >
            View Details
          </button>

          <button
            onClick={onUse}
            className="flex-1 rounded-xl bg-[#174d3d] py-2.5 text-[10px] font-semibold text-white transition hover:bg-[#103c2f]"
          >
            Use Template
          </button>
        </div>
      </div>
    </article>
  );
}

function MiniDetail({ value, label }) {
  return (
    <div className="rounded-xl bg-[#f6f7f2] px-2 py-2.5 text-center">
      <p className="text-[13px] font-semibold text-[#174d3d]">
        {value}
      </p>

      <p className="mt-0.5 text-[8px] text-[#89938d]">
        {label}
      </p>
    </div>
  );
}

function TemplateModal({ template, onClose, onUse }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#102e27]/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-[850px] overflow-y-auto rounded-3xl bg-[#faf9f4] shadow-2xl">
        {/* IMAGE */}
        <div className="relative h-[250px] sm:h-[320px]">
          <img
            src={template.image}
            alt={template.name}
            className="h-full w-full object-cover"
          />

          <button
            onClick={onClose}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#173d32] shadow"
          >
            ×
          </button>

          <div className="absolute bottom-5 left-5 rounded-full bg-[#174d3d] px-4 py-2 text-[9px] font-semibold text-white">
            {template.category}
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row">
            <div>
              <h2 className="font-serif text-[28px] font-semibold">
                {template.name}
              </h2>

              <p className="mt-1 text-[11px] text-[#77837c]">
                {template.plot} · {template.floors} Floor
                {template.floors > 1 ? "s" : ""}
              </p>
            </div>

            <button
              onClick={onUse}
              className="rounded-xl bg-[#174d3d] px-6 py-3 text-[10px] font-semibold text-white hover:bg-[#103c2f]"
            >
              Use This Template →
            </button>
          </div>

          <p className="mt-5 max-w-[680px] text-[12px] leading-6 text-[#66736b]">
            {template.description}
          </p>

          {/* STATS */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <ModalStat
              label="Bedrooms"
              value={template.bedrooms}
            />

            <ModalStat
              label="Bathrooms"
              value={template.bathrooms}
            />

            <ModalStat
              label="Kitchen"
              value={template.kitchens}
            />

            <ModalStat
              label="Floors"
              value={template.floors}
            />
          </div>

          {/* FEATURES */}
          <div className="mt-7">
            <h3 className="font-serif text-[18px] font-semibold">
              What's included
            </h3>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {[
                "Editable floor plan",
                "Movable rooms",
                "Resizable spaces",
                "Doors & windows",
                "2D floor plan",
                "3D view compatible",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-xl bg-white p-3 text-[10px] text-[#536158]"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e8f0e9] text-[9px] text-[#174d3d]">
                    ✓
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#dfe4dd] bg-white p-4 text-center">
      <p className="font-serif text-[22px] font-semibold text-[#174d3d]">
        {value}
      </p>

      <p className="mt-1 text-[9px] text-[#7c8881]">
        {label}
      </p>
    </div>
  );
}