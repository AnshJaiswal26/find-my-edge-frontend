import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { authService } from "@lib/services/auth.service";
import { useAuthStore } from "@shared/stores";

export default function Register() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((s) => ({
      ...s,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await authService.register(form);

      const user = await authService.getMe();

      setUser(user);

      navigate("/");
    } catch (err) {
      alert(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#0b0f17]">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex flex-col justify-center px-20 text-white bg-gradient-to-br from-[#0b0f17] to-[#121826]">
        <h1 className="text-4xl font-bold mb-6">Start Tracking Your Edge</h1>

        <p className="text-gray-400 text-lg leading-relaxed">
          Join Find My Edge and transform your trading with data-driven insights
          and disciplined journaling.
        </p>

        <div className="mt-10 space-y-4 text-gray-300">
          <div>✔ Strategy performance analytics</div>
          <div>✔ Risk and reward tracking</div>
          <div>✔ Behavioral mistake insights</div>
          <div>✔ Broker trade imports</div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center p-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-[#111827] border border-gray-800 p-10 rounded-xl shadow-xl"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">
            Create Account
          </h2>

          <div className="space-y-4">
            <input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-[#0b0f17] border border-gray-700 text-white focus:outline-none focus:border-blue-500"
            />

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-[#0b0f17] border border-gray-700 text-white focus:outline-none focus:border-blue-500"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-[#0b0f17] border border-gray-700 text-white focus:outline-none focus:border-blue-500"
            />

            <button
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 transition p-3 rounded-md font-medium text-white"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-400 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:text-blue-400">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
