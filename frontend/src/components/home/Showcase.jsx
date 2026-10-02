const houseImage =
  "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=90";

export default function Showcase() {
  return (
    <section id="about" className="bg-[#f8f5eb] px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-[1200px] items-center gap-14 lg:grid-cols-2">
        <div className="relative">
          <div className="overflow-hidden rounded-[34px] border border-white bg-white p-3 shadow-2xl shadow-[#315348]/10">
            <img src={houseImage} alt="DreamHouse 3D visualization" className="h-[500px] w-full rounded-[27px] object-cover" />
          </div>

          <div className="absolute -bottom-7 -right-5 hidden w-64 rounded-2xl border border-[#d7ded6] bg-[#fbfaf5] p-4 shadow-xl sm:block">
            <p className="text-[11px] font-bold text-[#24483c]">AI Material Suggestions</p>
            <div className="mt-3 flex gap-2">
              <div className="h-10 flex-1 rounded-lg bg-[#d9d0bd]" />
              <div className="h-10 flex-1 rounded-lg bg-[#a7b0a2]" />
              <div className="h-10 flex-1 rounded-lg bg-[#d8ddd5]" />
            </div>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6f8178]">See your space</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-[-0.03em] text-[#183b31] sm:text-5xl">
            One plan. Two ways to understand it.
          </h2>
          <p className="mt-6 text-[14px] leading-7 text-[#69736d] sm:text-[15px]">
            Build precisely in 2D, then switch to a 3D view for a more natural
            sense of scale, flow and atmosphere.
          </p>

          <div className="mt-8 space-y-5">
            {[
              ["2D planning", "Place rooms, walls, doors and windows with a clear top-down layout."],
              ["3D visualization", "Understand how your rooms connect and how the finished home can feel."],
              ["AI guidance", "Ask questions whenever you need ideas or improvements."],
            ].map(([title, text], index) => (
              <div key={title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8eee5] text-[12px] font-bold text-[#0b5d46]">
                  0{index + 1}
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#24483c]">{title}</h3>
                  <p className="mt-1 text-[12px] leading-6 text-[#707a74]">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
