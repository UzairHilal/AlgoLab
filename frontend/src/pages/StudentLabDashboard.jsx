import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "@/utils/api";
import { motion } from "motion/react";
import {
  BookOpen, Clock, CheckCircle, AlertTriangle,
  ChevronRight, FlaskConical, Calendar, ArrowUpRight
} from "lucide-react";

export default function StudentLabDashboard() {
  const navigate = useNavigate();
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      const res = await apiFetch("student/labs");
      const data = await res.json();
      setLabs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-950 p-4 md:p-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-teal-500/10 backdrop-blur-2xl px-6 py-7"
        >
          <div className="absolute top-0 right-0 w-52 h-52 bg-emerald-500/10 blur-3xl rounded-full" />
          <div className="relative">
            <h1 className="text-2xl md:text-3xl font-bold text-white">My Labs</h1>
            <p className="text-sm text-gray-400 mt-2">Your enrolled laboratory courses</p>
          </div>
        </motion.div>

        {labs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center text-gray-500">
            <BookOpen size={40} className="mx-auto mb-3 opacity-50" />
            <p>No labs assigned yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {labs.map((lab, i) => (
              <motion.div
                key={lab._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/student/lab/${lab._id}`)}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 cursor-pointer hover:border-emerald-400/30 transition-all"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_40%)]" />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center">
                        <FlaskConical size={22} className="text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{lab.name}</h3>
                        <p className="text-sm text-gray-400">{lab.subjectCode}</p>
                      </div>
                    </div>
                    <ArrowUpRight size={18} className="text-gray-500 group-hover:text-emerald-400 transition" />
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {lab.session}</span>
                    <span className="flex items-center gap-1"><BookOpen size={12} /> {lab.teacherId?.fullName || "Teacher"}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}