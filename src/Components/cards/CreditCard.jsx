import Link from "next/link";

export default function CreditCard({
  title,
  description,
  details,
  detailsLink,
  applyLink,
  badge,
}) {
  return (
    <div className="
      bg-slate-800/60 backdrop-blur
      border border-slate-700/50
      rounded-2xl p-6
      flex flex-col justify-between
      shadow-lg hover:shadow-2xl
      transition-all duration-300
    ">
      <div>
        {badge && (
          <span className="text-xs text-blue-400 uppercase font-semibold">
            {badge}
          </span>
        )}

        <h3 className="text-white text-xl font-semibold mt-1 mb-2">
          {title}
        </h3>

        <p className="text-slate-300 mb-4">
          {description}
        </p>

        <div className="text-sm text-slate-400 space-y-1">
          {details.map((item, i) => (
            <p key={i}>
              {item.label}:{" "}
              <span className="text-white">{item.value}</span>
            </p>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <a
          href={applyLink}
          target="_blank"
          className="bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-center font-semibold transition"
        >
          Подать заявку
        </a>

        <Link
          href={detailsLink}
          className="bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-center font-semibold transition"
        >
          Подробнее
        </Link>
      </div>
    </div>
  );
}
