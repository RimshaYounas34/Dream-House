const features = [
  {
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=90",
    title: "2D Floor Planner",
    text: "Create accurate rooms, walls, doors and windows with an easy editor.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=90",
    title: "3D Visualization",
    text: "Turn your floor plan into a simple 3D view to understand your space.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=900&q=90",
    title: "AI House Assistant",
    text: "Describe what you want and get useful planning suggestions.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=900&q=90",
    title: "Smart Measurements",
    text: "Keep room sizes and plot dimensions organized while designing.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=900&q=90",
    title: "Save & Manage",
    text: "Save your projects and return to edit them whenever you want.",
  },
 {
  image:
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=90",
  title: "Responsive Design",
  text: "Plan comfortably across desktop, tablet and mobile screens.",
},
  {
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=90",
    title: "Ready Templates",
    text: "Start faster with practical house layouts and design ideas.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=900&q=90",
    title: "Export & Share",
    text: "Export your finished plan for sharing, printing or reference.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="bg-[#fbfaf5] px-5 py-16 sm:px-8 lg:px-10"
    >
      <div className="mx-auto max-w-[1200px]">

        {/* Heading */}
        <div className="max-w-[700px]">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6f8178]">
            Everything you need
          </p>

          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.03em] text-[#183b31] sm:text-5xl">
            A smarter way to plan your home.
          </h2>

          <p className="mt-5 text-[14px] leading-7 text-[#5f7068] sm:text-[16px]">
            From the first idea to the final floor plan, DreamHouse keeps the
            entire planning process simple and visual.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {features.map((feature) => (
            <div
              key={feature.title}
              className="group overflow-hidden rounded-3xl border border-[#dce2da] bg-white p-4 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#315348]/10"
            >

              {/* Image */}
              <div className="h-[180px] overflow-hidden rounded-2xl bg-[#eef1eb]">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              {/* Text */}
              <div className="px-2 pb-2 pt-5">

                <h3 className="font-serif text-[20px] font-semibold leading-tight text-[#173d32]">
                  {feature.title}
                </h3>

                <p className="mt-3 text-[13px] leading-6 text-[#60716a]">
                  {feature.text}
                </p>

                {/* Learn More */}
                <div className="mt-5 flex items-center gap-2 text-[11px] font-semibold text-[#0b5d46]">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0b5d46] text-sm text-white">
                    →
                  </span>

                  <span>Learn more</span>

                  <span>→</span>
                </div>

              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}