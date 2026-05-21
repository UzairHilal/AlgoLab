import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import { motion } from "motion/react";
import { FileSpreadsheet, TrendingUp, Users, ClipboardCheck, CalendarCheck, Download } from "lucide-react";
import toast from "react-hot-toast";
export default function ReportsTab({ lab }) {
  const [performance, setPerformance] = useState([]);
  const [marksAnalysis, setMarksAnalysis] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchAllReports();
  }, [lab, selectedMonth, selectedYear]);

  const fetchAllReports = async () => {
    setLoading(true);
    try {
      const [perfRes, marksRes, attRes] = await Promise.all([
        apiFetch(`reports/student-performance/${lab._id}`),
        apiFetch(`reports/marks-analysis/${lab._id}`),
        apiFetch(`reports/attendance-summary/${lab._id}?month=${selectedMonth}&year=${selectedYear}`)
      ]);
      setPerformance(await perfRes.json());
      setMarksAnalysis(await marksRes.json());
      setAttendanceSummary(await attRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (type) => {
    // Placeholder - would integrate with a PDF/Excel library
    toast.success(`${type} export started`);
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading reports...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FileSpreadsheet size={20} className="text-purple-400" />
          Reports & Analytics
        </h3>
        <div className="flex gap-2">
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="p-2 rounded-xl bg-black/30 border border-white/10 text-white text-sm">
            {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => (
              <option key={i} value={i+1}>{m}</option>
            ))}
          </select>
          <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="p-2 rounded-xl bg-black/30 border border-white/10 text-white text-sm">
            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* ATTENDANCE SUMMARY */}
      {attendanceSummary && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <h4 className="text-white font-semibold flex items-center gap-2 mb-4">
            <CalendarCheck size={18} className="text-cyan-400" />
            Attendance Summary — {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][selectedMonth-1]} {selectedYear}
          </h4>
          <div className="grid grid-cols-2 gap-4  ">
            <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/5 p-4 text-center">
              <p className="text-3xl font-bold text-emerald-400">{attendanceSummary.lab.percentage}%</p>
              <p className="text-sm text-gray-400">Lab Attendance</p>
            </div>
            {/* <div className="rounded-xl border border-blue-400/20 bg-blue-500/5 p-4 text-center">
              <p className="text-3xl font-bold text-blue-400">{attendanceSummary.lecture.percentage}%</p>
              <p className="text-sm text-gray-400">Lecture Attendance</p>
            </div> */}
          </div>
        </motion.div>
      )}

      {/* MARKS ANALYSIS */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-black/20 p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white font-semibold flex items-center gap-2">
            <TrendingUp size={18} className="text-yellow-400" />
            Marks Analysis
          </h4>
          <button onClick={() => handleExport("Marks")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-xs hover:bg-white/10">
            <Download size={12} /> Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-400 border-b border-white/10">
              <tr>
                <th className="p-3">Practical</th>
                <th className="p-3">Highest</th>
                <th className="p-3">Lowest</th>
                <th className="p-3">Average</th>
                <th className="p-3">Submissions</th>
              </tr>
            </thead>
            <tbody>
              {marksAnalysis.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-6 text-gray-500">No data</td></tr>
              ) : (
                marksAnalysis.map((m, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="p-3 text-white">{m.practical.title}</td>
                    <td className="p-3 text-emerald-400">{m.highest}</td>
                    <td className="p-3 text-red-400">{m.lowest}</td>
                    <td className="p-3 text-gray-300">{m.average}</td>
                    <td className="p-3 text-gray-400">{m.submissions}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* STUDENT PERFORMANCE */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-black/20 p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white font-semibold flex items-center gap-2">
            <Users size={18} className="text-purple-400" />
            Student Performance
          </h4>
          <button onClick={() => handleExport("Performance")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-xs hover:bg-white/10">
            <Download size={12} /> Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-400 border-b border-white/10">
              <tr>
                <th className="p-3">Student</th>
                <th className="p-3">Practicals Done</th>
                <th className="p-3">Avg Marks</th>
                <th className="p-3">Total Marks</th>
                <th className="p-3">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {performance.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-6 text-gray-500">No data</td></tr>
              ) : (
                performance.map((p, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="p-3">
                      <p className="text-white">{p.student.fullName}</p>
                      <p className="text-xs text-gray-500">{p.student.rollNumber}</p>
                    </td>
                    <td className="p-3 text-gray-300">{p.practicalsCompleted}/{p.totalPracticals}</td>
                    <td className="p-3 text-gray-300">{p.avgMarks}</td>
                    <td className="p-3 text-white font-medium">{p.totalMarks}</td>
                    <td className="p-3">
                      <span className={`${p.attendancePercent >= 75 ? "text-emerald-400" : "text-red-400"}`}>
                        {p.attendancePercent}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}