import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useToast } from '@/hooks/use-toast';

const PAGE_SIZE = 10;

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const API_BASE = import.meta.env.VITE_BACKEND_URI || '';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ sales: 0, orders: 0, users: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [usersOnline, setUsersOnline] = useState({ admins: 0, shoppers: 0 });
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchStatsAndOrders = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      const statsRes = await fetch(`${API_BASE}/api/admin/dashboard/dashboard-stats`, { credentials: 'include' });
      if (!statsRes.ok) throw new Error('Failed to fetch stats');
      const statsData = await statsRes.json();
      setStats(statsData);
      const ordersRes = await fetch(`${API_BASE}/api/admin/dashboard/recent-orders?page=${pageNum}&limit=${PAGE_SIZE}`, { credentials: 'include' });
      if (!ordersRes.ok) throw new Error('Failed to fetch orders');
      const ordersData = await ordersRes.json();
      console.log('Fetched orders for page', pageNum, ordersData); // Debug log
      // Support both array and object response for backward compatibility
      if (Array.isArray(ordersData)) {
        setRecentOrders(ordersData);
        setTotalPages(1);
      } else {
        setRecentOrders(Array.isArray(ordersData.orders) ? ordersData.orders : []);
        setTotalPages(ordersData.totalPages || 1);
      }
    } catch (err) {
      setStats({ sales: 0, orders: 0, users: 0 });
      setRecentOrders([]);
      setError('Failed to load dashboard data. Please check your server and network.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsAndOrders(page);
    const socket = io('https://shopease-q3li.onrender.com', { withCredentials: true });
    socket.on('dashboardUpdate', () => {
      fetchStatsAndOrders(page);
    });
    socket.on('usersOnline', (counts) => {
      console.log('Received usersOnline event:', counts);
      setUsersOnline(counts);
    });
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, [page]);

  // Mock sales data for the last 7 days
  const salesData = {
    labels: [
      'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
    ],
    datasets: [
      {
        label: 'Sales ($)',
        data: [1200, 1900, 800, 1500, 2100, 1700, 2300], // Replace with real data if available
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96 text-xl">Loading dashboard...</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center h-96 text-xl text-red-600">{error}</div>;
  }

  return (
    <div className="w-full min-h-screen bg-[#f7fafd] p-2 sm:p-4 md:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-[#223263] text-center">Admin Dashboard</h1>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-10">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col items-center border-b-4 border-[#3b82f6] w-full">
          <span className="text-gray-500 text-sm sm:text-base">Total Sales</span>
          <span className="text-2xl sm:text-3xl font-bold text-green-600 mt-2">{stats.sales.toLocaleString()}</span>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col items-center border-b-4 border-[#a855f7] w-full">
          <span className="text-gray-500 text-sm sm:text-base">Total Orders</span>
          <span className="text-2xl sm:text-3xl font-bold text-[#223263] mt-2">{stats.orders}</span>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col items-center border-b-4 border-[#f43f5e] w-full">
          <span className="text-gray-500 text-sm sm:text-base">Total Users</span>
          <span className="text-2xl sm:text-3xl font-bold text-[#f43f5e] mt-2">{stats.users}</span>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col items-center border-b-4 border-[#f59e42] w-full">
          <span className="text-gray-500 text-sm sm:text-base">Users Online</span>
          <span className="text-2xl sm:text-3xl font-bold text-[#f59e42] mt-2">{usersOnline.admins} Admin / {usersOnline.shoppers} Shoppers</span>
        </div>
      </div>
      {/* Sales Chart at the top, full width */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-8 mb-6 sm:mb-8 w-full overflow-x-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-black text-center">Sales Over Last 7 Days</h2>
        {salesData && salesData.datasets && salesData.datasets[0].data && salesData.datasets[0].data.length > 0 ? (
          <div className="w-full min-w-[250px]" style={{ minWidth: 250 }}>
            <Line data={salesData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: true, position: 'top', labels: { color: '#000' } },
                title: { display: false },
              },
              scales: {
                x: { ticks: { color: '#000' }, grid: { color: '#eee' } },
                y: { beginAtZero: true, ticks: { color: '#000' }, grid: { color: '#eee' } }
              }
            }} height={220} />
          </div>
        ) : (
          <div className="text-gray-400 text-center py-8 sm:py-12">No sales data available</div>
        )}
      </div>
      {/* Recent Orders Table below chart */}
      <div className="bg-white rounded-xl shadow p-2 sm:p-8 flex flex-col w-full overflow-x-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-black text-center">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-[600px] sm:min-w-full text-left border rounded-lg text-xs sm:text-base">
            <thead>
              <tr className="bg-[#fafafa]">
                <th className="py-2 px-2 sm:px-4 font-semibold text-black">Order ID</th>
                <th className="py-2 px-2 sm:px-4 font-semibold text-black">User</th>
                <th className="py-2 px-2 sm:px-4 font-semibold text-black">Amount</th>
                <th className="py-2 px-2 sm:px-4 font-semibold text-black">Status</th>
                <th className="py-2 px-2 sm:px-4 font-semibold text-black">Date</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(recentOrders) && recentOrders.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-4 text-black">No recent orders</td></tr>
              ) : (
                Array.isArray(recentOrders) && recentOrders.map(order => (
                  <tr key={order._id} className="border-t hover:bg-[#fafafa] transition">
                    <td className="py-2 px-2 sm:px-4 text-xs break-all text-black">{order._id}</td>
                    <td className="py-2 px-2 sm:px-4 text-xs break-all text-black">{order.userName}</td>
                    <td className="py-2 px-2 sm:px-4 text-black">{typeof order.amount === 'number' ? order.amount.toFixed(2) : order.amount}</td>
                    <td className="py-2 px-2 sm:px-4 capitalize text-black">{order.status}</td>
                    <td className="py-2 px-2 sm:px-4 text-black">{order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6 gap-2 sm:gap-0">
          <button
            className="px-4 py-2 bg-gray-100 text-black rounded disabled:opacity-50 w-full sm:w-auto"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-black">Page {page} of {totalPages}</span>
          <button
            className="px-4 py-2 bg-gray-100 text-black rounded disabled:opacity-50 w-full sm:w-auto"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;