import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { LogOut, GraduationCap, FlaskConical, Code2 } from "lucide-react";

export default function StudentNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const isLabRoute = location.pathname.startsWith("/student/lab");

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/30 backdrop-blur-2xl shadow-lg">
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        <div className="flex items-center gap-4">
          <div onClick={() => navigate("/student/dashboard")} className="flex items-center gap-3 cursor-pointer group">
            <motion.div
              whileHover={{ scale: 1.08 }}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
            >
              <GraduationCap size={22} className="text-white" />
            </motion.div>
            <div className="hidden md:block">
              <h1 className="text-xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">Learn</span>
                <span className="text-white">Lab</span>
              </h1>
            </div>
          </div>

          {/* Nav Pills */}
          <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
            <button
              onClick={() => navigate("/student/dashboard")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition ${
                !isLabRoute
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <GraduationCap size={15} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              onClick={() => navigate("/algo-dashboard")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white transition"
            >
              <Code2 size={15} />
              <span className="hidden sm:inline">Algorithms</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10">
              <span className="text-sm text-emerald-300">{user.fullName}</span>
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-400/20 text-red-400 hover:bg-red-500/20 transition"
          >
            <LogOut size={16} />
            <span className="hidden md:inline text-sm">Logout</span>
          </motion.button>
        </div>
      </div>
    </nav>
  );
}