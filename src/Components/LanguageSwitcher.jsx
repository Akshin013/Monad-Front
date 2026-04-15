'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const locales = ['ru', 'en', 'az'];

  return (
    <div className="flex gap-2">
      {locales.map((loc) => (
        <Link
          key={loc}
          href={`/${loc}${pathname.replace(/^\/(ru|en|az)/, '')}`}
          className="px-2 py-1 bg-gray-200 text-black rounded"
        >
          {loc.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
