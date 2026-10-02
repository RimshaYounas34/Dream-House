const templates = [
  ["5 Marla House", "3 Beds · 3 Baths", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85"],
  ["10 Marla House", "4 Beds · 4 Baths", "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=85"],
  ["Modern Villa", "5 Beds · 5 Baths", "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85"],
  ["Small House", "2 Beds · 2 Baths", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85"],
  ["Double Story", "4 Beds · 5 Baths", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85"],
];

export default function Templates() {
  return (
    <section id="templates" className="bg-[#fbfaf5] px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6f8178]">Start faster</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.03em] text-[#183b31] sm:text-5xl">
              Popular templates.
            </h2>
          </div>
          <p className="max-w-[420px] text-[14px] leading-6 text-[#707a74]">
            Pick a starting point, then customize every room to match your own requirements.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {templates.map(([title, details, image]) => (
            <div key={title} className="group overflow-hidden rounded-3xl border border-[#dce1da] bg-white shadow-sm">
              <div className="overflow-hidden">
                <img src={image} alt={title} className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <h3 className="text-[15px] font-bold text-[#24483c]">{title}</h3>
                <p className="mt-1.5 text-[12px] text-[#7a827d]">{details}</p>
                <button className="mt-5 rounded-full border border-[#ccd7cf] px-4 py-2.5 text-[11px] font-semibold text-[#315348]">
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
