import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import { UserPlus, Trash2, Upload, Search, Users, X, Plus, UserCheck } from "lucide-react";

export default function StudentsTab({ lab, onUpdate }) {
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [rollNumber, setRollNumber] = useState("");
  const [enrollingAll, setEnrollingAll] = useState(false);

  useEffect(() => {
    fetchEnrolledStudents();
    fetchAllStudents();
  }, [lab]);

  const fetchEnrolledStudents = async () => {
    try {
      const res = await apiFetch(`lab-students/${lab._id}`);
      const data = await res.json();
      setEnrolledStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllStudents = async () => {
    try {
      const res = await apiFetch("auth/all-students");
      const data = await res.json();
      setAllStudents(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async () => {
    if (!rollNumber.trim()) return toast.error("Enter a roll number");
    try {
      const res = await apiFetch(`lab-students/${lab._id}/enroll`, {
        method: "POST",
        body: JSON.stringify({ rollNumber: rollNumber.trim() })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.msg || data.error || "Failed to add student");

      toast.success(data.msg || "Student added");
      setRollNumber("");
      fetchEnrolledStudents();
      onUpdate();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleQuickAdd = async (roll) => {
    try {
      const res = await apiFetch(`lab-students/${lab._id}/enroll`, {
        method: "POST",
        body: JSON.stringify({ rollNumber: roll })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.msg || data.error || "Failed to add student");

      toast.success(`${roll} added`);
      fetchEnrolledStudents();
      onUpdate();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEnrollAll = async () => {
    if (availableStudents.length === 0) {
      return toast.error("No students available to enroll");
    }

    const rollNumbers = availableStudents.map(s => s.rollNumber);

    setEnrollingAll(true);
    try {
      const res = await apiFetch(`lab-students/${lab._id}/bulk-enroll`, {
        method: "POST",
        body: JSON.stringify({ rollNumbers })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.msg || data.error || "Failed to enroll");

      toast.success(`${data.enrolled || 0} students enrolled`);
      fetchEnrolledStudents();
      onUpdate();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setEnrollingAll(false);
    }
  };

  const handleRemove = async (studentId) => {
    if (!confirm("Remove this student?")) return;
    try {
      await apiFetch(`lab-students/${lab._id}/remove/${studentId}`, { method: "DELETE" });
      toast.success("Student removed");
      fetchEnrolledStudents();
      onUpdate();
    } catch (err) {
      toast.error("Failed to remove");
    }
  };

  const handleRemoveAll = async () => {
    if (!confirm(`Remove ALL ${enrolledStudents.length} students from this lab?`)) return;
    try {
      for (const student of enrolledStudents) {
        await apiFetch(`lab-students/${lab._id}/remove/${student._id}`, { method: "DELETE" });
      }
      toast.success("All students removed");
      fetchEnrolledStudents();
      onUpdate();
    } catch (err) {
      toast.error("Failed to remove all students");
    }
  };

  const filteredEnrolled = enrolledStudents.filter(s =>
    (s.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.rollNumber || "").toLowerCase().includes(search.toLowerCase())
  );

  const enrolledRolls = new Set(enrolledStudents.map(s => s.rollNumber?.toUpperCase()));
  const availableStudents = allStudents.filter(s => !enrolledRolls.has(s.rollNumber?.toUpperCase()));

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Users size={20} className="text-purple-400" />
            Enrolled Students
            <span className="text-sm text-gray-500 font-normal">({enrolledStudents.length})</span>
          </h3>
        </div>
        <div className="flex gap-2">
          {enrolledStudents.length > 0 && (
            <button
              onClick={handleRemoveAll}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-400/20 text-red-400 hover:bg-red-500/20 transition text-sm"
            >
              <Trash2 size={15} /> Remove All
            </button>
          )}
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300 hover:bg-purple-500/30 transition"
          >
            <UserPlus size={16} />
            {showAdd ? "Close" : "Add Students"}
          </button>
        </div>
      </div>

      {/* ADD STUDENTS PANEL */}
      {showAdd && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="rounded-2xl border border-white/10 bg-black/20 p-5 space-y-5"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">Add Students to {lab.name}</h3>
            <button onClick={() => setShowAdd(false)}><X size={18} className="text-gray-400" /></button>
          </div>

          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Enter Roll Number</label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                placeholder="e.g. 22CS001"
                className="w-full p-2.5 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={handleAdd}
              className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-medium"
            >
              Add
            </button>
          </div>

          {availableStudents.length > 0 && (
            <div className="border-t border-white/10 pt-4">
              <button
                onClick={handleEnrollAll}
                disabled={enrollingAll}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:opacity-90 text-white font-medium transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {enrollingAll ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enrolling...
                  </>
                ) : (
                  <>
                    <UserCheck size={18} />
                    Enroll All Available Students ({availableStudents.length})
                  </>
                )}
              </button>
            </div>
          )}

          <div className="border-t border-white/10 pt-4">
            <label className="text-xs text-gray-500 mb-3 block">
              Available Students ({availableStudents.length} not enrolled)
            </label>

            {availableStudents.length === 0 ? (
              <div className="text-center py-6 text-gray-500 text-sm border border-dashed border-white/10 rounded-xl">
                All students are already enrolled 🎉
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto rounded-xl border border-white/10 divide-y divide-white/5">
                {availableStudents.map((student) => (
                  <div
                    key={student._id}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.03] transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-400/20 flex items-center justify-center text-purple-400 text-xs font-medium">
                        {student.fullName?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{student.fullName}</p>
                        <p className="text-xs text-gray-500">{student.rollNumber}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleQuickAdd(student.rollNumber)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-400/20 text-purple-300 text-xs hover:bg-purple-500/20 transition"
                    >
                      <Plus size={12} /> Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* SEARCH */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-3 text-gray-500" />
        <input
          type="text"
          placeholder="Search enrolled students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* ENROLLED STUDENTS */}
      <div className="flex flex-col gap-2">
        {filteredEnrolled.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border border-dashed border-white/10 rounded-2xl">
            <Users size={32} className="mx-auto mb-2 opacity-30" />
            <p>No students enrolled yet</p>
            <p className="text-xs mt-1">Click "Add Students" to enroll</p>
          </div>
        ) : (
          filteredEnrolled.map((student, i) => (
            <motion.div
              key={student._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/20 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center text-purple-400 text-sm font-semibold">
                  {student.fullName?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium">{student.fullName}</p>
                  <p className="text-sm text-gray-400">{student.rollNumber}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemove(student._id)}
                className="p-2 rounded-lg bg-red-500/10 border border-red-400/20 text-red-400 hover:bg-red-500/20 transition"
              >
                <Trash2 size={15} />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}