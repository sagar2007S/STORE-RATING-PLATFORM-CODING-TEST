import { useState } from "react";
import { signupUser } from "../../api/authApi.js";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", address: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const emailRegex = /^\S+@\S+\.\S+$/;
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  const uppercaseRegex = /[A-Z]/;

  const validate = () => {
    const e = {};

    if (!form.name || form.name.trim().length < 20) {
      e.name = "Name must be at least 20 characters.";
    } else if (form.name.trim().length > 60) {
      e.name = "Name must be at most 60 characters.";
    }

    if (!form.email || !emailRegex.test(form.email)) {
      e.email = "Please enter a valid email address.";
    }

    if (form.address && form.address.length > 400) {
      e.address = "Address must be at most 400 characters.";
    }

    if (!form.password) {
      e.password = "Password is required.";
    } else if (form.password.length < 8 || form.password.length > 16) {
      e.password = "Password must be 8–16 characters.";
    } else if (!uppercaseRegex.test(form.password)) {
      e.password = "Password must contain at least one uppercase letter.";
    } else if (!specialCharRegex.test(form.password)) {
      e.password = "Password must contain at least one special character.";
    }

    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eobj = validate();
    setErrors(eobj);
    if (Object.keys(eobj).length > 0) return;

    try {
      await signupUser(form);
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err) {
      setServerError(err.response?.data?.error || err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Signup</h2>

        {serverError && <div className="mb-3 text-red-600">{serverError}</div>}

        <label className="text-sm">Name</label>
        <input
          type="text"
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          className="border w-full p-2 mb-1 rounded"
        />
        {errors.name && <div className="text-red-600 text-sm mb-2">{errors.name}</div>}

        <label className="text-sm">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border w-full p-2 mb-1 rounded"
        />
        {errors.email && <div className="text-red-600 text-sm mb-2">{errors.email}</div>}

        <label className="text-sm">Address (optional)</label>
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="border w-full p-2 mb-1 rounded"
        />
        {errors.address && <div className="text-red-600 text-sm mb-2">{errors.address}</div>}

        <label className="text-sm">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border w-full p-2 mb-1 rounded"
        />
        {errors.password && <div className="text-red-600 text-sm mb-2">{errors.password}</div>}

        <button className="bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 p-4 text-white w-full py-2 rounded hover:bg-green-700">Signup</button>

        <p className="mt-4 text-sm text-center">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
