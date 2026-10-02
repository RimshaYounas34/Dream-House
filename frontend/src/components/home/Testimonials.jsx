const testimonials = [
  ["Ayesha Khan", "Homeowner", "I finally understood how all my rooms could fit together before speaking to a builder.", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"],
  ["Usman Raza", "Designer", "The 2D editor makes it easy to test different layouts without starting over.", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"],
  ["Sara Ahmed", "Homeowner", "Being able to move from a floor plan to a 3D view makes the idea feel much more real.", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"],
];

export default function Testimonials() {
  return (
    <section className="bg-[#fbfaf5] px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6f8178]">What people say</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.03em] text-[#183b31] sm:text-5xl">
            Designed for real people.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map(([name, role, quote, image]) => (
            <div key={name} className="rounded-3xl border border-[#dce1da] bg-white p-7">
              <div className="flex items-center gap-4">
                <img src={image} alt={name} className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <p className="text-[14px] font-bold text-[#24483c]">{name}</p>
                  <p className="mt-0.5 text-[11px] text-[#7b847e]">{role}</p>
                </div>
              </div>
              <p className="mt-6 font-serif text-[17px] leading-7 text-[#36564b]">“{quote}”</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
