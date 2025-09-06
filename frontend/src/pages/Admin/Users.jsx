import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios.js";
import { sortData } from "../../utils/sort.js";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "user",
  });
  const [filter, setFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, order: "asc" });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };
    fetchUsers();
  }, []);

  const validateNewUser = () => {
    const { name, email, address, password } = newUser;

    if (!name || name.trim().length < 20)
      return "Name must be at least 20 characters.";
    if (name.trim().length > 60) return "Name must be at most 60 characters.";

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email || !emailRegex.test(email)) return "Please enter a valid email.";

    if (address && address.length > 400)
      return "Address must be at most 400 characters.";

    if (!password || password.length < 8 || password.length > 16)
      return "Password must be 8–16 characters.";
    if (!/[A-Z]/.test(password))
      return "Password must contain at least one uppercase letter.";
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password))
      return "Password must contain at least one special character.";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validateNewUser();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await api.post("/admin/users", newUser);
      setUsers([...users, res.data]);
      setNewUser({
        name: "",
        email: "",
        address: "",
        password: "",
        role: "user",
      });
    } catch (err) {
      console.error("Error creating user", err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Error creating user"
      );
    }
  };

  const changeUserRole = async (userId, newRole) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/role`, {
        role: newRole,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, role: res.data.user.role } : u
        )
      );
    } catch (err) {
      console.error("Failed to update role", err);
      alert(err.response?.data?.error || "Failed to update role");
    }
  };

  const handleSort = (key) => {
    let order = "asc";
    if (sortConfig.key === key && sortConfig.order === "asc") {
      order = "desc";
    }
    setSortConfig({ key, order });
    setUsers(sortData(users, key, order));
  };

  const filteredUsers = users.filter((u) =>
    [u.name, u.email, u.address, u.role].some((field) =>
      (field || "").toLowerCase().includes(filter.toLowerCase())
    )
  );

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

        <form
          onSubmit={handleSubmit}
          className="mb-6 bg-white p-4 rounded shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-3">Add New User</h3>

          {error && <div className="mb-3 text-red-600">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={newUser.address}
              onChange={(e) =>
                setNewUser({ ...newUser, address: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              className="border p-2 rounded"
              required
            />
          </div>

          <div className="mt-3 flex items-center gap-3">
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="user">User</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
            </select>

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Add User
            </button>
          </div>
        </form>

        {/* Filter */}
        <input
          type="text"
          placeholder="Filter by Name, Email, Address, Role"
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
              <th
                className="p-2 cursor-pointer"
                onClick={() => handleSort("role")}
              >
                Role{" "}
                {sortConfig.key === "role"
                  ? sortConfig.order === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.address}</td>
                <td className="p-2">
                  <select
                    value={u.role}
                    onChange={(e) => changeUserRole(u.id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="user">User</option>
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Users;
