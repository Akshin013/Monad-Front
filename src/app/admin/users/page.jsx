"use client";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NTEyNDAyOTRlNThiNGZmYzg2ZDA5ZSIsImVtYWlsIjoicHJlbWl1bS5iYW5rQHRlc3QuY29tIiwicm9sZSI6IkRFQUxFUiIsImlhdCI6MTc2NjkyNTc4NSwiZXhwIjoxNzY3NTMwNTg1fQ.L7uXMRPolliw6RKWjFfuM3Pn5qCtSqof44SMlqH6aek"; // JWT текущего залогиненного админа
    if (!token) return;

    fetch("http://localhost:5000/api/users/")
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка: " + res.status);
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-[#0B3D91]">Пользователи</h1>

      {loading ? (
        <p className="text-gray-500">Загрузка...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-[#0B3D91] text-white">
              <tr>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Телефон</th>
                <th className="px-4 py-2 border">Роль</th>
                <th className="px-4 py-2 border">Статус</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr
                  key={u._id}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}
                >
                  <td className="px-4 py-2 text-gray-700">{u.email}</td>
                  <td className="px-4 py-2 text-gray-700">{u.phone || "-"}</td>
                  <td className="px-4 py-2 text-gray-700 capitalize">{u.role}</td>
                  <td
                    className={`px-4 py-2 font-semibold ${
                      u.is_verified ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {u.is_verified ? "Verified" : "Pending"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
