import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios.js";

const Dashboard = () => {
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(null);

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        // Fetch all ratings for this owner's store
        const res = await api.get("/owner/ratings"); 
        setRatings(res.data.ratings);
        setAverage(res.data.averageRating);
      } catch (err) {
        console.error("Error fetching store ratings", err);
      }
    };
    fetchOwnerData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Store Owner Dashboard</h1>

        {/* Average Rating */}
        <div className="mb-6 bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-lg">Average Store Rating</h2>
          <p className="text-3xl font-bold text-blue-600">
            {average !== null ? average.toFixed(1) : "N/A"}
          </p>
        </div>

        {/* Ratings List */}
        <h2 className="text-xl font-semibold mb-4">User Ratings</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">User Name</th>
              <th className="p-2">User Email</th>
              <th className="p-2">Rating</th>
            </tr>
          </thead>
          <tbody>
            {ratings.length > 0 ? (
              ratings.map((r) => (
                <tr key={r.userId} className="border-t">
                  <td className="p-2">{r.userName}</td>
                  <td className="p-2">{r.userEmail}</td>
                  <td className="p-2">{r.rating}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  No ratings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Dashboard;
