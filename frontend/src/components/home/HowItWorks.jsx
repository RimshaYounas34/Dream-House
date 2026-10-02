const steps = [
  ["01", "Create Your Project", "Enter your plot size, floors and room requirements."],
  ["02", "Design Your Floor Plan", "Use AI or start manually and arrange your spaces."],
  ["03", "View in 3D", "See your plan as a simple three-dimensional home view."],
  ["04", "Get AI Suggestions", "Ask for ideas about rooms, flow, measurements and layouts."],
  ["05", "Save & Export", "Save your project and export the final design when ready."],
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#f8f5eb] px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6f8178]">Simple process</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.03em] text-[#183b31] sm:text-5xl">
            From idea to home plan.
          </h2>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-5">
          {steps.map(([number, title, text], index) => (
            <div key={number} className="relative rounded-3xl border border-[#d9dfd7] bg-white/70 p-6">
              <span className="font-serif text-3xl font-semibold text-[#b2c1b8]">{number}</span>
              <h3 className="mt-5 text-[15px] font-bold text-[#24483c]">{title}</h3>
              <p className="mt-2 text-[12px] leading-6 text-[#707a74]">{text}</p>
              {index < steps.length - 1 && (
                <div className="absolute -right-3 top-10 z-10 hidden text-xl text-[#a6b5ad] md:block">→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
