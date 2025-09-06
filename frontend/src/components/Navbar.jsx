import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 p-4 text-white flex justify-between">
      <div className="flex gap-6">
        {user?.role === "admin" && (
          <>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/stores">Stores</Link>
          </>
        )}
        {user?.role === "user" && <Link to="/user">Dashboard</Link>}
        {user?.role === "owner" && <Link to="/owner">Dashboard</Link>}
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="mr-2">{user.name}</span>
            <Link to="/change-password" className="text-1xl mr-3">
              Change Password
            </Link>
          </>
        )}
        {user ? (
          <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
        ) : (
          <Link to="/login" className="bg-green-500 px-3 py-1 rounded">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
