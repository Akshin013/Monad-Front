export function FilterPanel({ title, children }) {
  return (
    <div className="
      bg-slate-800/70 backdrop-blur
      border border-slate-700/50
      rounded-2xl p-5
      shadow-lg
    ">
      <p className="text-white font-semibold mb-3">
        {title}
      </p>
      {children}
    </div>
  );
}
