import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios.js";

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats"); // backend endpoint
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white shadow-md p-6 rounded-xl">
            <h2 className="text-lg">Total Users</h2>
            <p className="text-3xl font-bold">{stats.users}</p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-xl">
            <h2 className="text-lg">Total Stores</h2>
            <p className="text-3xl font-bold">{stats.stores}</p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-xl">
            <h2 className="text-lg">Total Ratings</h2>
            <p className="text-3xl font-bold">{stats.ratings}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
