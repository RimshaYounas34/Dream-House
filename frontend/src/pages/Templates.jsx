import { useNavigate } from "react-router-dom";

const templates = [
  { id: "modern-3", name: "Modern 3 Bedroom", size: "30 x 60 ft", style: "Pakistani Modern", rooms: ["Living Room", "Kitchen", "Dining Room", "Master Bedroom", "Bedroom 2", "Bedroom 3", "Bathroom"] },
  { id: "family-25", name: "25 x 50 Family House", size: "25 x 50 ft", style: "Warm Modern", rooms: ["Living Room", "Open Kitchen", "Master Bedroom", "Bedroom 2", "Bathrooms"] },
  { id: "luxury-40", name: "40 x 60 Luxury Villa", size: "40 x 60 ft", style: "Luxury", rooms: ["Drawing Room", "Family Room", "Kitchen", "Dining", "4 Bedrooms", "Garage", "Garden"] },
  { id: "minimal-single", name: "Minimal Single Story", size: "30 x 45 ft", style: "Minimal Modern", rooms: ["Living Room", "Kitchen", "2 Bedrooms", "2 Bathrooms", "Courtyard"] },
];

function templatePlan(template) {
  return {
    project: { name: template.name, plotWidth: Number(template.size.split(" x ")[0]), plotLength: Number(template.size.split(" x ")[1].replace(" ft", "")), floors: 1, units: "feet" },
    rooms: [
      { id: "living-1", type: "living", name: "Living Room", x: 45, y: 45, width: 220, height: 140, rotation: 0 },
      { id: "kitchen-1", type: "kitchen", name: "Kitchen", x: 280, y: 45, width: 160, height: 110, rotation: 0 },
      { id: "master-1", type: "bedroom", name: "Master Bedroom", x: 45, y: 205, width: 200, height: 125, rotation: 0 },
      { id: "bedroom-2", type: "bedroom", name: "Bedroom 2", x: 265, y: 205, width: 165, height: 115, rotation: 0 },
      { id: "bath-1", type: "bathroom", name: "Bathroom", x: 450, y: 205, width: 80, height: 75, rotation: 0 },
      { id: "garden-1", type: "garden", name: "Front Garden", x: 45, y: 350, width: 485, height: 65, rotation: 0 },
    ],
    doors: [{ id: "main-door", name: "Main Entrance", x: 130, y: 38, width: 52, height: 10, rotation: 0 }],
    windows: [{ id: "living-window", name: "Living Window", x: 110, y: 38, width: 55, height: 8, rotation: 0 }],
    walls: [], furniture: [], dimensions: [], source: "template",
    site: { boundaryWall: { enabled: true, height: 2.2 }, gate: { style: "modern", width: 4 }, garden: true, driveway: true, parkingSpaces: 2 },
    exterior: { style: template.style.toLowerCase(), facadeMaterial: "white-plaster", facadeColor: "#f4f1e8" },
    materials: { wall: "white-paint", floor: "light-wood", door: "dark-wood", windowFrame: "black" },
    lighting: { mode: "day", intensity: 1.8, warmth: 0.45 },
    roof: { type: "parapet", material: "concrete", color: "#d9d5ca", height: 0.45 },
  };
}

export default function Templates() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#f7f5ed] px-5 py-10 text-[#173d32] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#0b5d46]">Dream House Library</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div><h1 className="font-serif text-4xl font-semibold">Editable templates</h1><p className="mt-2 text-sm text-[#718078]">Start with a real plan, then continue in the same 2D and 3D editor.</p></div>
          <button type="button" onClick={() => navigate("/create-project")} className="rounded-xl bg-[#0b5d46] px-5 py-3 text-[11px] font-bold text-white">Create from scratch</button>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {templates.map((template) => (
            <article key={template.id} className="overflow-hidden rounded-3xl border border-[#dfe4dc] bg-white shadow-[0_14px_40px_rgba(36,62,51,0.06)]">
              <div className="relative h-40 bg-[#e8eee6] p-5"><div className="absolute inset-7 grid grid-cols-3 grid-rows-2 gap-1 border-2 border-[#315348] bg-[#f7f5ed] p-1"><span className="col-span-2 bg-[#c8d6c7]" /><span className="bg-[#d8c8ae]" /><span className="bg-[#ded9cc]" /><span className="col-span-2 bg-[#c8d6c7]" /></div><span className="absolute bottom-4 left-5 rounded-full bg-white/85 px-2 py-1 text-[9px] font-bold text-[#315348]">{template.style}</span></div>
              <div className="p-5"><h2 className="font-serif text-lg font-semibold">{template.name}</h2><p className="mt-1 text-[11px] text-[#718078]">{template.size} · {template.rooms.length} spaces</p><p className="mt-3 min-h-10 text-[10px] leading-5 text-[#7d8982]">{template.rooms.join(" · ")}</p><button type="button" onClick={() => navigate("/floor-plan-editor", { state: templatePlan(template) })} className="mt-5 w-full rounded-xl border border-[#cbd8ce] bg-[#f8faf6] px-4 py-3 text-[11px] font-bold text-[#315348] hover:bg-[#eaf2e9]">Use template</button></div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}