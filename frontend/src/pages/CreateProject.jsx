import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function buildInitialPlan(formData) {
  const bedroomCount = Math.max(1, Number(formData.bedrooms || 1));
  const bathroomCount = Math.max(1, Number(formData.bathrooms || 1));
  const rooms = [
    { id: "living-1", type: "living", name: "Living Room", x: 45, y: 45, width: 220, height: 135, rotation: 0 },
    { id: "kitchen-1", type: "kitchen", name: "Kitchen", x: 280, y: 45, width: 150, height: 110, rotation: 0 },
    { id: "dining-1", type: "dining", name: "Dining Room", x: 440, y: 45, width: 175, height: 110, rotation: 0 },
    { id: "garage-1", type: "garage", name: "Garage", x: 45, y: 195, width: 155, height: 110, rotation: 0 },
  ];
  for (let index = 0; index < bedroomCount; index += 1) {
    rooms.push({ id: `bedroom-${index + 1}`, type: "bedroom", name: index === 0 ? "Master Bedroom" : `Bedroom ${index + 1}`, x: 220 + (index % 2) * 200, y: 190 + Math.floor(index / 2) * 125, width: 175, height: 105, rotation: 0 });
  }
  for (let index = 0; index < bathroomCount; index += 1) {
    rooms.push({ id: `bathroom-${index + 1}`, type: "bathroom", name: index === 0 ? "Attached Bathroom" : `Bathroom ${index + 1}`, x: 45 + index * 85, y: 330, width: 70, height: 70, rotation: 0 });
  }
  return {
    project: { name: formData.projectName, plotWidth: Number(formData.plotWidth), plotLength: Number(formData.plotLength), floors: Number(formData.floors), units: "feet" },
    rooms,
    doors: [{ id: "main-door", name: "Main Entrance", x: 135, y: 39, width: 48, height: 10, rotation: 0 }],
    windows: rooms.filter((room) => room.type !== "bathroom").slice(0, 6).map((room, index) => ({ id: `window-${index + 1}`, name: `${room.name} Window`, x: room.x + room.width / 2 - 25, y: room.y - 4, width: 50, height: 8, rotation: 0 })),
    walls: [],
    furniture: [],
    dimensions: [],
    site: { boundaryWall: { enabled: true, height: 2.2 }, gate: { style: "modern", width: 4 }, driveway: true, garden: true, parkingSpaces: Number(formData.garage || 0) || 1 },
    exterior: { style: formData.houseType?.toLowerCase() || "modern", facadeMaterial: "white-plaster", facadeColor: "#f4f1e8" },
    materials: { wall: "white-paint", floor: "light-wood", door: "dark-wood", windowFrame: "black" },
    lighting: { mode: "day", intensity: 1.8, warmth: 0.45 },
    roof: { type: "parapet", material: "concrete", color: "#d9d5ca", height: 0.45 },
    source: "manual",
  };
}

export default function CreateProject() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    projectName: "",
    plotWidth: "30",
    plotLength: "50",
    floors: "1",
    bedrooms: "3",
    bathrooms: "2",
    kitchen: "1",
    garage: "1",
    houseType: "Modern",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.projectName.trim()) {
      alert("Please enter a project name.");
      return;
    }

    navigate("/floor-plan-editor", { state: { ...formData, ...buildInitialPlan(formData), plotWidth: Number(formData.plotWidth), plotLength: Number(formData.plotLength), floors: Number(formData.floors) } });
  };

  return (
    <div className="min-h-screen bg-[#f7f5ee] text-[#173d32]">

      {/* HEADER */}
      <header className="border-b border-[#dfe4dc] bg-[#f7f5ee]/95">
        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-6 lg:px-10">

          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5ece5]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                className="text-[#0b5d46]"
              >
                <path
                  d="M3 11.5 12 4l9 7.5V21H3V11.5Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="M8 21v-6h8v6M12 4v4"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
              </svg>
            </div>

            <div>
              <p className="font-serif text-[17px] font-bold leading-none">
                DreamHouse
              </p>
              <p className="mt-1 text-[9px] tracking-[0.28em] text-[#8b948d]">
                PLANNER
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            <div className="h-1 w-16 overflow-hidden rounded-full bg-[#dfe6df]">
              <div className="h-full w-1/4 rounded-full bg-[#0b5d46]" />
            </div>

            <span className="text-[11px] font-medium text-[#6d7770]">
              STEP 01 / 04
            </span>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 text-[11px] font-semibold text-[#647069] transition hover:text-[#0b5d46]"
          >
            <span>←</span>
            Back to Home
          </Link>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:px-10 lg:py-12">

        <div className="mb-9 max-w-2xl">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[#0b5d46]">
            Create a new project
          </p>

          <h1 className="font-serif text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-[#173d32] sm:text-5xl">
            Let's design your
            <span className="text-[#769083]"> dream home.</span>
          </h1>

          <p className="mt-4 max-w-xl text-[13px] leading-6 text-[#748078]">
            Tell us about your plot and requirements. We'll use these details
            to create a personalized floor plan for your home.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_520px]"
        >

          {/* LEFT FORM */}
          <div className="space-y-6">

            {/* PROJECT */}
            <section className="rounded-[28px] border border-[#dfe4dc] bg-white p-6 shadow-[0_12px_45px_rgba(36,62,51,0.05)] sm:p-7">

              <SectionTitle
                number="01"
                title="Project details"
                description="Give your project a name and choose your preferred house style."
              />

              <div className="mt-7 grid gap-5 sm:grid-cols-2">

                <InputField
                  label="Project name"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  placeholder="e.g. My Family Home"
                />

                <SelectField
                  label="House style"
                  name="houseType"
                  value={formData.houseType}
                  onChange={handleChange}
                  options={[
                    "Modern",
                    "Minimal",
                    "Contemporary",
                    "Traditional",
                    "Luxury",
                  ]}
                />

              </div>
            </section>

            {/* PLOT */}
            <section className="rounded-[28px] border border-[#dfe4dc] bg-white p-6 shadow-[0_12px_45px_rgba(36,62,51,0.05)] sm:p-7">

              <SectionTitle
                number="02"
                title="Plot dimensions"
                description="Enter the size of your available land."
              />

              <div className="mt-7 grid gap-5 sm:grid-cols-3">

                <InputField
                  label="Plot width"
                  name="plotWidth"
                  value={formData.plotWidth}
                  onChange={handleChange}
                  suffix="ft"
                  type="number"
                />

                <InputField
                  label="Plot length"
                  name="plotLength"
                  value={formData.plotLength}
                  onChange={handleChange}
                  suffix="ft"
                  type="number"
                />

                <SelectField
                  label="Floors"
                  name="floors"
                  value={formData.floors}
                  onChange={handleChange}
                  options={["1", "2", "3", "4"]}
                />

              </div>

              {/* DIMENSION DISPLAY */}
              <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#f5f7f2] px-5 py-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#89938c]">
                    Total plot area
                  </p>
                  <p className="mt-1 font-serif text-2xl text-[#173d32]">
                    {Number(formData.plotWidth || 0) *
                      Number(formData.plotLength || 0)}
                    <span className="ml-1 text-sm text-[#7d8981]">
                      sq ft
                    </span>
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-[#89938c]">
                    Plot size
                  </p>
                  <p className="mt-1 text-[13px] font-semibold text-[#315348]">
                    {formData.plotWidth} × {formData.plotLength} ft
                  </p>
                </div>
              </div>
            </section>

            {/* ROOMS */}
            <section className="rounded-[28px] border border-[#dfe4dc] bg-white p-6 shadow-[0_12px_45px_rgba(36,62,51,0.05)] sm:p-7">

              <SectionTitle
                number="03"
                title="House requirements"
                description="Choose how many spaces you'd like in your home."
              />

              <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">

                <NumberCard
                  label="Bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                />

                <NumberCard
                  label="Bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                />

                <NumberCard
                  label="Kitchens"
                  name="kitchen"
                  value={formData.kitchen}
                  onChange={handleChange}
                />

                <NumberCard
                  label="Garage"
                  name="garage"
                  value={formData.garage}
                  onChange={handleChange}
                />

              </div>
            </section>

            {/* SUBMIT */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <p className="max-w-sm text-[11px] leading-5 text-[#8a938d]">
                Your information will be used to create an initial floor plan
                that you can edit later.
              </p>

              <button
                type="submit"
                className="group flex h-14 items-center justify-center gap-3 rounded-full bg-[#0b5d46] px-8 text-[12px] font-bold text-white shadow-[0_12px_25px_rgba(11,93,70,0.2)] transition hover:-translate-y-0.5 hover:bg-[#084b3a]"
              >
                Continue to Floor Plan
                <span className="text-base transition group-hover:translate-x-1">
                  →
                </span>
              </button>

            </div>
          </div>

          {/* RIGHT PREVIEW */}
          <aside className="xl:sticky xl:top-7 xl:h-fit">

            <div className="overflow-hidden rounded-[30px] border border-[#dce2da] bg-[#fbfcf8] shadow-[0_20px_60px_rgba(35,59,49,0.08)]">

              {/* PREVIEW HEADER */}
              <div className="flex items-center justify-between border-b border-[#e0e5de] px-6 py-5">

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a938d]">
                    Live preview
                  </p>

                  <h2 className="mt-1 font-serif text-xl text-[#173d32]">
                    Your floor plan
                  </h2>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-[#e8f0e9] px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0b5d46]" />
                  <span className="text-[9px] font-semibold text-[#315348]">
                    LIVE
                  </span>
                </div>

              </div>

              {/* ARCHITECTURAL PLAN */}
              <div className="p-5 sm:p-7">

                <ArchitecturalPlan />

              </div>

              {/* PLAN INFO */}
              <div className="border-t border-[#e0e5de] bg-white px-6 py-5">

                <div className="grid grid-cols-3 divide-x divide-[#e1e5df]">

                  <MiniInfo
                    value={`${formData.plotWidth} × ${formData.plotLength}`}
                    label="Plot size"
                  />

                  <MiniInfo
                    value={formData.bedrooms}
                    label="Bedrooms"
                  />

                  <MiniInfo
                    value={`${formData.floors}`}
                    label="Floor"
                  />

                </div>

              </div>

            </div>

          </aside>
        </form>
      </main>
    </div>
  );
}


/* =========================================================
   ARCHITECTURAL FLOOR PLAN
========================================================= */

function ArchitecturalPlan() {
  return (
    <div className="relative aspect-[0.9] w-full overflow-hidden rounded-[22px] border border-[#d9dfd7] bg-[#f4f5ef]">

      {/* GRID */}
      <svg
        viewBox="0 0 600 670"
        className="absolute inset-0 h-full w-full"
      >

        <defs>

          <pattern
            id="smallGrid"
            width="12"
            height="12"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 12 0 L 0 0 0 12"
              fill="none"
              stroke="#dfe4dc"
              strokeWidth="0.7"
            />
          </pattern>

          <pattern
            id="largeGrid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <rect width="60" height="60" fill="url(#smallGrid)" />
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="#d2d9d1"
              strokeWidth="1"
            />
          </pattern>

        </defs>

        <rect
          width="600"
          height="670"
          fill="url(#largeGrid)"
        />

        {/* TOP DIMENSION */}
        <line
          x1="95"
          y1="45"
          x2="505"
          y2="45"
          stroke="#7b8880"
          strokeWidth="1"
        />

        <line
          x1="95"
          y1="39"
          x2="95"
          y2="51"
          stroke="#7b8880"
          strokeWidth="1"
        />

        <line
          x1="505"
          y1="39"
          x2="505"
          y2="51"
          stroke="#7b8880"
          strokeWidth="1"
        />

        <text
          x="300"
          y="38"
          textAnchor="middle"
          fill="#66736c"
          fontSize="11"
          fontFamily="Arial"
          letterSpacing="1"
        >
          30'-0"
        </text>

        {/* LEFT DIMENSION */}
        <line
          x1="62"
          y1="85"
          x2="62"
          y2="585"
          stroke="#7b8880"
          strokeWidth="1"
        />

        <line
          x1="56"
          y1="85"
          x2="68"
          y2="85"
          stroke="#7b8880"
          strokeWidth="1"
        />

        <line
          x1="56"
          y1="585"
          x2="68"
          y2="585"
          stroke="#7b8880"
          strokeWidth="1"
        />

        <text
          x="43"
          y="340"
          textAnchor="middle"
          fill="#66736c"
          fontSize="11"
          fontFamily="Arial"
          transform="rotate(-90 43 340)"
          letterSpacing="1"
        >
          50'-0"
        </text>

        {/* HOUSE OUTLINE */}
        <rect
          x="95"
          y="85"
          width="410"
          height="500"
          fill="#ffffff"
          stroke="#173d32"
          strokeWidth="7"
        />

        {/* ENTRY / LIVING */}
        <rect
          x="98"
          y="88"
          width="407"
          height="145"
          fill="#f8faf6"
          stroke="#49675b"
          strokeWidth="2"
        />

        <text
          x="301"
          y="151"
          textAnchor="middle"
          fill="#315348"
          fontSize="17"
          fontFamily="Georgia"
          fontWeight="bold"
        >
          LIVING ROOM
        </text>

        <text
          x="301"
          y="172"
          textAnchor="middle"
          fill="#8a958e"
          fontSize="9"
          fontFamily="Arial"
          letterSpacing="1.5"
        >
          14' × 16'
        </text>

        {/* MAIN DIVIDER */}
        <line
          x1="98"
          y1="233"
          x2="505"
          y2="233"
          stroke="#173d32"
          strokeWidth="4"
        />

        {/* LEFT BEDROOM */}
        <rect
          x="98"
          y="233"
          width="205"
          height="175"
          fill="#ffffff"
          stroke="#49675b"
          strokeWidth="2"
        />

        <text
          x="200"
          y="313"
          textAnchor="middle"
          fill="#315348"
          fontSize="15"
          fontFamily="Georgia"
          fontWeight="bold"
        >
          BEDROOM 01
        </text>

        <text
          x="200"
          y="333"
          textAnchor="middle"
          fill="#8a958e"
          fontSize="9"
          fontFamily="Arial"
          letterSpacing="1"
        >
          12' × 13'
        </text>

        {/* RIGHT BEDROOM */}
        <rect
          x="303"
          y="233"
          width="202"
          height="175"
          fill="#ffffff"
          stroke="#49675b"
          strokeWidth="2"
        />

        <text
          x="404"
          y="313"
          textAnchor="middle"
          fill="#315348"
          fontSize="15"
          fontFamily="Georgia"
          fontWeight="bold"
        >
          BEDROOM 02
        </text>

        <text
          x="404"
          y="333"
          textAnchor="middle"
          fill="#8a958e"
          fontSize="9"
          fontFamily="Arial"
          letterSpacing="1"
        >
          11' × 13'
        </text>

        {/* LOWER LEFT */}
        <rect
          x="98"
          y="408"
          width="130"
          height="174"
          fill="#f9faf7"
          stroke="#49675b"
          strokeWidth="2"
        />

        <text
          x="163"
          y="482"
          textAnchor="middle"
          fill="#315348"
          fontSize="13"
          fontFamily="Georgia"
          fontWeight="bold"
        >
          KITCHEN
        </text>

        <text
          x="163"
          y="501"
          textAnchor="middle"
          fill="#8a958e"
          fontSize="8"
          fontFamily="Arial"
        >
          9' × 11'
        </text>

        {/* LOWER CENTER */}
        <rect
          x="228"
          y="408"
          width="130"
          height="174"
          fill="#ffffff"
          stroke="#49675b"
          strokeWidth="2"
        />

        <text
          x="293"
          y="482"
          textAnchor="middle"
          fill="#315348"
          fontSize="13"
          fontFamily="Georgia"
          fontWeight="bold"
        >
          DINING
        </text>

        <text
          x="293"
          y="501"
          textAnchor="middle"
          fill="#8a958e"
          fontSize="8"
          fontFamily="Arial"
        >
          9' × 11'
        </text>

        {/* LOWER RIGHT */}
        <rect
          x="358"
          y="408"
          width="147"
          height="174"
          fill="#f9faf7"
          stroke="#49675b"
          strokeWidth="2"
        />

        <text
          x="431"
          y="477"
          textAnchor="middle"
          fill="#315348"
          fontSize="12"
          fontFamily="Georgia"
          fontWeight="bold"
        >
          BATH
        </text>

        <text
          x="431"
          y="495"
          textAnchor="middle"
          fill="#8a958e"
          fontSize="8"
          fontFamily="Arial"
        >
          6' × 8'
        </text>

        {/* DOOR - MAIN ENTRY */}
        <path
          d="M270 233 A48 48 0 0 1 318 185"
          fill="none"
          stroke="#789087"
          strokeWidth="1.5"
        />

        <line
          x1="270"
          y1="233"
          x2="318"
          y2="233"
          stroke="#173d32"
          strokeWidth="3"
        />

        {/* DOOR BEDROOM */}
        <path
          d="M303 300 A35 35 0 0 0 338 265"
          fill="none"
          stroke="#789087"
          strokeWidth="1.5"
        />

        {/* WINDOWS TOP */}
        <line
          x1="170"
          y1="85"
          x2="235"
          y2="85"
          stroke="#8da79b"
          strokeWidth="6"
        />

        <line
          x1="365"
          y1="85"
          x2="430"
          y2="85"
          stroke="#8da79b"
          strokeWidth="6"
        />

        {/* WINDOWS BEDROOM */}
        <line
          x1="98"
          y1="275"
          x2="98"
          y2="335"
          stroke="#8da79b"
          strokeWidth="6"
        />

        <line
          x1="505"
          y1="275"
          x2="505"
          y2="335"
          stroke="#8da79b"
          strokeWidth="6"
        />

        {/* KITCHEN WINDOW */}
        <line
          x1="130"
          y1="582"
          x2="185"
          y2="582"
          stroke="#8da79b"
          strokeWidth="6"
        />

        {/* NORTH ARROW */}
        <g transform="translate(530 105)">
          <circle
            cx="0"
            cy="0"
            r="19"
            fill="#ffffff"
            stroke="#cdd5cd"
          />

          <path
            d="M0 -11 L5 5 L0 2 L-5 5 Z"
            fill="#173d32"
          />

          <text
            x="0"
            y="-25"
            textAnchor="middle"
            fill="#6c7971"
            fontSize="8"
            fontFamily="Arial"
            fontWeight="bold"
          >
            N
          </text>
        </g>

        {/* ENTRY LABEL */}
        <text
          x="300"
          y="617"
          textAnchor="middle"
          fill="#7a8780"
          fontSize="9"
          fontFamily="Arial"
          letterSpacing="2"
        >
          MAIN ENTRY
        </text>

        {/* ENTRY ARROW */}
        <line
          x1="300"
          y1="585"
          x2="300"
          y2="605"
          stroke="#789087"
          strokeWidth="1"
        />

        <path
          d="M296 600 L300 606 L304 600"
          fill="none"
          stroke="#789087"
          strokeWidth="1"
        />

      </svg>

      {/* PLAN TAG */}
      <div className="absolute left-4 top-4 rounded-full border border-[#d7ded5] bg-white/90 px-3 py-1.5 backdrop-blur">
        <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#66736c]">
          Concept plan
        </span>
      </div>

    </div>
  );
}


/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({ number, title, description }) {
  return (
    <div className="flex gap-4">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e8eee7] text-[10px] font-bold text-[#0b5d46]">
        {number}
      </div>

      <div>
        <h2 className="font-serif text-[22px] text-[#173d32]">
          {title}
        </h2>

        <p className="mt-1 text-[11px] leading-5 text-[#849087]">
          {description}
        </p>
      </div>

    </div>
  );
}


/* =========================================================
   INPUT
========================================================= */

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  suffix,
  type = "text",
}) {
  return (
    <label className="block">

      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.13em] text-[#66736c]">
        {label}
      </span>

      <div className="relative">

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-12 w-full rounded-2xl border border-[#dce2da] bg-[#fbfcf9] px-4 text-[13px] text-[#173d32] outline-none transition placeholder:text-[#a5ada7] focus:border-[#0b5d46] focus:bg-white focus:ring-4 focus:ring-[#0b5d46]/5"
        />

        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[#89938d]">
            {suffix}
          </span>
        )}

      </div>
    </label>
  );
}


/* =========================================================
   SELECT
========================================================= */

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}) {
  return (
    <label className="block">

      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.13em] text-[#66736c]">
        {label}
      </span>

      <div className="relative">

        <select
          name={name}
          value={value}
          onChange={onChange}
          className="h-12 w-full appearance-none rounded-2xl border border-[#dce2da] bg-[#fbfcf9] px-4 text-[13px] text-[#173d32] outline-none transition focus:border-[#0b5d46] focus:bg-white focus:ring-4 focus:ring-[#0b5d46]/5"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#77837c]">
          ↓
        </span>

      </div>
    </label>
  );
}


/* =========================================================
   NUMBER CARD
========================================================= */

function NumberCard({
  label,
  name,
  value,
  onChange,
}) {
  return (
    <label className="rounded-2xl border border-[#dfe4dc] bg-[#fafbf8] p-4 transition hover:border-[#bfcfc3]">

      <span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#727d76]">
        {label}
      </span>

      <input
        type="number"
        min="0"
        name={name}
        value={value}
        onChange={onChange}
        className="mt-2 w-full bg-transparent font-serif text-2xl text-[#173d32] outline-none"
      />

    </label>
  );
}


/* =========================================================
   MINI INFO
========================================================= */

function MiniInfo({ value, label }) {
  return (
    <div className="text-center">

      <p className="font-serif text-lg text-[#173d32]">
        {value}
      </p>

      <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[#929a94]">
        {label}
      </p>

    </div>
  );
}