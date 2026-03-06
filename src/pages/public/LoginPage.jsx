import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { authService } from "@lib/services/auth.service";
import { useAuthStore } from "@shared/stores";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [form, setForm] = useState({
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

      await authService.login(form);

      const user = await authService.getMe();

      login(user);

      navigate("/");
    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#0b0f17]">
      {/* LEFT SIDE - Branding */}
      <div className="hidden lg:flex flex-col justify-center px-20 text-white bg-gradient-to-br from-[#0b0f17] to-[#121826]">
        <h1 className="text-4xl font-bold mb-6">Find My Edge</h1>

        <p className="text-gray-400 mb-8 text-lg leading-relaxed">
          Professional trade journaling and analytics platform designed to help
          traders discover their true edge.
        </p>

        <div className="space-y-4 text-gray-300">
          <div>📊 Advanced trade analytics</div>
          <div>📈 Strategy performance tracking</div>
          <div>🧠 Behavioral mistake analysis</div>
          <div>⚡ Broker integrations</div>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          Build discipline. Track performance. Find your edge.
        </div>
      </div>

      {/* RIGHT SIDE - Login */}
      <div className="flex items-center justify-center p-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-[#111827] border border-gray-800 p-10 rounded-xl shadow-xl"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Sign in</h2>

          <div className="space-y-4">
            <input
              name="email"
              placeholder="Email address"
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
              className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-md font-medium text-white"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-400 text-center">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:text-blue-400">
              Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
