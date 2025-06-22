import { useState } from 'react';

export default function AdminsPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/admins/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Admin added successfully!');
        setEmail('');
        setPassword('');
      } else {
        setMessage(data.error || 'Failed to add admin');
      }
    } catch (err) {
      setMessage('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-black">Add New Admin</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          className="border rounded px-4 py-2 text-black"
          placeholder="Admin Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="border rounded px-4 py-2 text-black"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-black text-white rounded px-4 py-2 font-semibold disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Admin'}
        </button>
      </form>
      {message && <div className="mt-4 text-black">{message}</div>}
    </div>
  );
}
