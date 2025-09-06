import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios.js";

const Dashboard = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [userRatings, setUserRatings] = useState({}); 

  // Fetch all stores
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await api.get("/stores"); // backend: GET /stores
        setStores(res.data);
      } catch (err) {
        console.error("Error fetching stores", err);
      }
    };
    fetchStores();
  }, []);

  // Handle rating change
  const handleRating = async (storeId, rating) => {
    try {
      const res = await api.post(`/stores/${storeId}/rate`, { rating });
      setUserRatings({ ...userRatings, [storeId]: rating });
      console.log("Rating submitted:", res.data);
    } catch (err) {
      console.error("Error submitting rating", err);
    }
  };

  // Filtering Logic
  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Browse Stores</h1>

       
        <input
          type="text"
          placeholder="Search by name or address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border w-full p-2 mb-4 rounded"
        />

        
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Store Name</th>
              <th className="p-2">Address</th>
              <th className="p-2">Overall Rating</th>
              <th className="p-2">Your Rating</th>
            </tr>
          </thead>
          <tbody>
            {filteredStores.map((store) => (
              <tr key={store.id} className="border-t">
                <td className="p-2">{store.name}</td>
                <td className="p-2">{store.address}</td>
                <td className="p-2">{store.averageRating || "N/A"}</td>
                <td className="p-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleRating(store.id, num)}
                      className={`px-2 py-1 mx-1 rounded ${
                        userRatings[store.id] === num
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Dashboard;
