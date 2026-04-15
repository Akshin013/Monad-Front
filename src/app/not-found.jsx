export default function NotFound() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-xl mt-4 text-gray-600">
          Страница не найдена или временно недоступна
        </p>

        <a
          href="/"
          className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          На главную
        </a>
      </div>
    </div>
  );
}