import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios.js";
import { sortData } from "../../utils/sort.js";

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });
  const [filter, setFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, order: "asc" });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStoresAndUsers = async () => {
      try {
        const [storesRes, usersRes] = await Promise.all([
          api.get("/admin/stores"),
          api.get("/admin/users"),
        ]);
        setStores(storesRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Error fetching stores or users", err);
      }
    };
    fetchStoresAndUsers();
  }, []);

  const validateNewStore = () => {
    const { name, email, address } = newStore;
    if (!name || name.trim().length === 0) return "Store name is required.";
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email || !emailRegex.test(email)) return "Please enter a valid email.";
    if (address && address.length > 400)
      return "Address must be at most 400 characters.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validateNewStore();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await api.post("/admin/stores", newStore);
      setStores([...stores, res.data]);
      setNewStore({ name: "", email: "", address: "", ownerId: "" });
    } catch (err) {
      console.error("Error creating store", err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Error creating store"
      );
    }
  };

  const handleSort = (key) => {
    let order = "asc";
    if (sortConfig.key === key && sortConfig.order === "asc") {
      order = "desc";
    }
    setSortConfig({ key, order });
    setStores(sortData(stores, key, order));
  };

  const filteredStores = stores.filter((s) =>
    [s.name, s.email, s.address, s.ownerName].some((field) =>
      (field || "").toLowerCase().includes(filter.toLowerCase())
    )
  );

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Manage Stores</h1>

        <form
          onSubmit={handleSubmit}
          className="mb-6 bg-white p-4 rounded shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-3">Add New Store</h3>

          {error && <div className="mb-3 text-red-600">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Store Name"
              value={newStore.name}
              onChange={(e) =>
                setNewStore({ ...newStore, name: e.target.value })
              }
              className="border p-2 rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newStore.email}
              onChange={(e) =>
                setNewStore({ ...newStore, email: e.target.value })
              }
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={newStore.address}
              onChange={(e) =>
                setNewStore({ ...newStore, address: e.target.value })
              }
              className="border p-2 rounded"
              required
            />
          </div>

          <div className="mt-3">
            <label className="block text-sm mb-1">
              Assign Owner (optional)
            </label>
            <select
              value={newStore.ownerId}
              onChange={(e) =>
                setNewStore({ ...newStore, ownerId: e.target.value })
              }
              className="border p-2 rounded w-full"
            >
              <option value="">Set Owner</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Add Store
            </button>
          </div>
        </form>

        <input
          type="text"
          placeholder="Filter by Name, Email, Address or Owner"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border w-full p-2 mb-4 rounded"
        />

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th
                className="p-2 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name{" "}
                {sortConfig.key === "name"
                  ? sortConfig.order === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </th>
              <th
                className="p-2 cursor-pointer"
                onClick={() => handleSort("email")}
              >
                Email{" "}
                {sortConfig.key === "email"
                  ? sortConfig.order === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </th>
              <th
                className="p-2 cursor-pointer"
                onClick={() => handleSort("address")}
              >
                Address{" "}
                {sortConfig.key === "address"
                  ? sortConfig.order === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </th>
              <th className="p-2">Owner</th>
              <th
                className="p-2 cursor-pointer"
                onClick={() => handleSort("rating")}
              >
                Rating{" "}
                {sortConfig.key === "rating"
                  ? sortConfig.order === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStores.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.email}</td>
                <td className="p-2">{s.address}</td>
                <td className="p-2">{s.ownerName || "—"}</td>
                <td className="p-2">{s.rating || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Stores;
