import { Hexagon, Aperture, Boxes, Command, Gem, Layers, Orbit, Triangle } from "lucide-react";

const brands = [
  { name: "NovaCart", icon: Hexagon },
  { name: "PulseFM", icon: Aperture },
  { name: "Stackly", icon: Boxes },
  { name: "Kryptik", icon: Command },
  { name: "Aurora", icon: Gem },
  { name: "LayrUp", icon: Layers },
  { name: "OrbitIQ", icon: Orbit },
  { name: "Trinova", icon: Triangle },
];

export default function Marquee() {
  const row = [...brands, ...brands];
  return (
    <section className="border-y border-brand-100/70 bg-brand-50/40 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-center text-xs font-semibold tracking-[0.22em] text-slate-400 uppercase">
          Powering brands across 15+ industries
        </p>
        <div className="marquee-mask mt-7 overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-14">
            {row.map((brand, i) => (
              <div
                key={`${brand.name}-${i}`}
                className="flex items-center gap-2.5 text-slate-400 transition-colors duration-300 hover:text-brand-600"
              >
                <brand.icon className="h-6 w-6" strokeWidth={1.8} />
                <span className="font-display text-lg font-bold tracking-tight whitespace-nowrap">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
