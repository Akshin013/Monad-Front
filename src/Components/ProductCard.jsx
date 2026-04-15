import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <div className="card">
      <img
        src={product.image || "/images/no-image.png"}
        className="h-20 w-full object-cover rounded-xl mb-4"
        alt={product.title}
      />

      <h3 className="font-semibold text-lg">{product.title}</h3>
      <p className="text-gray-400 mt-1">{product.price} $</p>

      <Link
        href={`/Products/${product._id}`}
        className="inline-block mt-4 text-gold hover:underline"
      >
        View details →
      </Link>
    </div>
  );
}
  