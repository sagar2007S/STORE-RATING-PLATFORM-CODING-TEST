import { useState } from "react";
import { changePassword } from "../../api/authApi.js";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";


const ChangePassword = () => {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  const uppercaseRegex = /[A-Z]/;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.oldPassword) return "Old password is required.";
    if (!form.newPassword) return "New password is required.";
    if (form.newPassword.length < 8 || form.newPassword.length > 16)
      return "New password must be 8–16 characters.";
    if (!uppercaseRegex.test(form.newPassword)) return "New password must contain at least one uppercase letter.";
    if (!specialCharRegex.test(form.newPassword)) return "New password must contain at least one special character.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    try {
      await changePassword(form);
       toast.success("Password updated successfully!");
      setMsg("Password updated successfully!");
      setForm({ oldPassword: "", newPassword: "" });
    } catch (err) {
       toast.error("Failed to update password."); 
      setError(err.response?.data?.error || "Failed to update password.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
          <h2 className="text-xl font-bold mb-4">Change Password</h2>
          {msg && <p className="mb-3 text-green-600">{msg}</p>}
          {error && <p className="mb-3 text-red-600">{error}</p>}
          <input
            type="password"
            name="oldPassword"
            placeholder="Old Password"
            value={form.oldPassword}
            onChange={handleChange}
            className="border w-full p-2 mb-3 rounded"
            required
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            className="border w-full p-2 mb-3 rounded"
            required
          />
          <button className="bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 p-4 text-white w-full py-2 rounded">Update</button>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
