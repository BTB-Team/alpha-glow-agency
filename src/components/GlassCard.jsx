export function GlassCard({ badge, title, description }) {
  return (
    <article className="group relative rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/15 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.08] hover:border-sky-400/40">
      <div className="mb-4 inline-flex items-center rounded-full bg-sky-400/10 px-3 py-1 text-xs font-medium tracking-wider text-sky-300 border border-sky-400/20">
        {badge}
      </div>
      <h3 className="text-xl font-semibold text-white group-hover:text-sky-200 transition-colors">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-300/90">
        {description}
      </p>
    </article>
  );
}