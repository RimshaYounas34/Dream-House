import { Link, useNavigate } from "react-router-dom";

export default function DesignMethod() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f5eb] text-[#173d32]">
      {/* Header */}
      <header className="border-b border-[#dfe4dc] bg-[#f8f5eb]/95">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-5 sm:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e8eee5] text-[#0b5d46]">
              <svg
                width="23"
                height="23"
                viewBox="0 0 24 24"
                fill="none"
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
              <p className="font-serif text-base font-bold leading-none">
                DreamHouse
              </p>
              <p className="mt-1.5 text-[9px] font-medium tracking-[0.25em] text-[#8a928c]">
                PLANNER
              </p>
            </div>
          </Link>

          <Link
            to="/"
            className="text-[11px] font-semibold text-[#53615a] transition hover:text-[#0b5d46]"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-[1050px] px-5 py-14 sm:px-8 lg:py-20">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#0b5d46]">
            Start Your Design
          </p>

          <h1 className="mt-4 font-serif text-4xl leading-tight text-[#173d32] sm:text-5xl">
            How would you like to design your dream home?
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#66736c]">
            Choose the way you want to create your floor plan. You can edit
            everything later in our interactive 2D editor.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* AI CARD */}
          <div className="group overflow-hidden rounded-[28px] border border-[#d8e0d7] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#aebfb3] hover:shadow-2xl hover:shadow-[#315348]/10">
            {/* Visual */}
            <div className="relative h-56 overflow-hidden bg-[#eaf0e8] p-6">
              <div className="absolute right-6 top-5 rounded-full bg-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-[#0b5d46] shadow-sm">
                Recommended
              </div>

              {/* Mini AI floor plan */}
              <div className="absolute left-1/2 top-1/2 w-[82%] -translate-x-1/2 -translate-y-1/2 rotate-[-2deg] rounded-2xl border border-[#cbd7cb] bg-white p-3 shadow-xl">
                <div className="grid h-32 grid-cols-3 gap-1.5">
                  <div className="rounded-lg border border-[#cbd7cb] bg-[#f4f7f1] p-2 text-[8px] text-[#53615a]">
                    Living
                  </div>

                  <div className="rounded-lg border border-[#cbd7cb] bg-[#eef4ed] p-2 text-[8px] text-[#53615a]">
                    Kitchen
                  </div>

                  <div className="rounded-lg border border-[#cbd7cb] bg-[#f4f7f1] p-2 text-[8px] text-[#53615a]">
                    Dining
                  </div>

                  <div className="rounded-lg border border-[#cbd7cb] bg-[#f1f4ef] p-2 text-[8px] text-[#53615a]">
                    Bedroom
                  </div>

                  <div className="rounded-lg border border-[#cbd7cb] bg-[#eef4ed] p-2 text-[8px] text-[#53615a]">
                    Bedroom
                  </div>

                  <div className="rounded-lg border border-[#cbd7cb] bg-[#f4f7f1] p-2 text-[8px] text-[#53615a]">
                    Bath
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-5 rounded-full border border-[#cbd7cb] bg-white/90 px-3 py-1.5 text-[9px] font-semibold text-[#315348] shadow-sm">
                AI generated layout
              </div>
            </div>

            {/* Content */}
            <div className="p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8eee5] text-xl text-[#0b5d46]">
                  ✦
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#173d32]">
                    AI Planner
                  </h2>

                  <p className="mt-2 text-xs leading-6 text-[#6a756f]">
                    Simply describe your dream house in normal words. AI will
                    understand your requirements and create an initial floor
                    plan for you.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-2.5">
                {[
                  "Describe rooms in your own words",
                  "AI detects bedrooms, kitchen, garage, balcony & more",
                  "Edit the generated plan in 2D",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-[11px] text-[#53615a]"
                  >
                    <span className="text-[#0b5d46]">✓</span>
                    {item}
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate("/ai-planner")}
                className="mt-7 w-full rounded-full bg-[#0b5d46] px-5 py-3.5 text-[11px] font-bold text-white transition hover:bg-[#174c3d]"
              >
                Create with AI →
              </button>
            </div>
          </div>

          {/* MANUAL CARD */}
          <div className="group overflow-hidden rounded-[28px] border border-[#d8e0d7] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#aebfb3] hover:shadow-2xl hover:shadow-[#315348]/10">
            {/* Visual */}
            <div className="relative h-56 overflow-hidden bg-[#f0eee6] p-6">
              <div className="absolute left-6 top-5 rounded-full border border-[#ccd4cc] bg-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-[#53615a]">
                Full Control
              </div>

              {/* Manual architectural plan */}
              <div className="absolute left-1/2 top-1/2 w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-[#8b958d] bg-white p-3 shadow-xl">
                <div className="relative h-32 border border-[#9da69f]">
                  <div className="absolute left-0 top-0 h-1/2 w-1/2 border-b border-r border-[#9da69f] p-2 text-[8px] text-[#53615a]">
                    Living Room
                  </div>

                  <div className="absolute right-0 top-0 h-1/2 w-1/2 border-b border-[#9da69f] p-2 text-[8px] text-[#53615a]">
                    Kitchen
                  </div>

                  <div className="absolute bottom-0 left-0 h-1/2 w-1/2 border-r border-[#9da69f] p-2 text-[8px] text-[#53615a]">
                    Bedroom
                  </div>

                  <div className="absolute bottom-0 right-0 h-1/2 w-1/2 p-2 text-[8px] text-[#53615a]">
                    Bathroom
                  </div>

                  <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0b5d46] bg-white" />
                </div>
              </div>

              <div className="absolute bottom-4 right-5 rounded-full border border-[#ccd4cc] bg-white/90 px-3 py-1.5 text-[9px] font-semibold text-[#53615a] shadow-sm">
                Drag & customize
              </div>
            </div>

            {/* Content */}
            <div className="p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f0eee6] text-xl text-[#315348]">
                  ✎
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#173d32]">
                    Manual Planner
                  </h2>

                  <p className="mt-2 text-xs leading-6 text-[#6a756f]">
                    Start from scratch and decide everything yourself. Choose
                    your plot, rooms and layout before entering the editor.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-2.5">
                {[
                  "Choose plot dimensions yourself",
                  "Add the rooms you need",
                  "Move and customize everything in 2D",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-[11px] text-[#53615a]"
                  >
                    <span className="text-[#0b5d46]">✓</span>
                    {item}
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate("/create-project")}
                className="mt-7 w-full rounded-full border border-[#bfcac1] bg-white px-5 py-3.5 text-[11px] font-bold text-[#315348] transition hover:bg-[#0b5d46] hover:text-white"
              >
                Start Manually →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <div className="mx-auto mt-10 flex max-w-2xl items-center justify-center gap-3 rounded-2xl border border-[#dce2da] bg-white/60 px-5 py-4 text-center">
          <span className="text-[#0b5d46]">✦</span>

          <p className="text-[11px] leading-5 text-[#66736c]">
            Not sure which one to choose? Start with{" "}
            <span className="font-semibold text-[#173d32]">AI Planner</span>.
            You can edit the complete plan later.
          </p>
        </div>
      </main>
    </div>
  );
}