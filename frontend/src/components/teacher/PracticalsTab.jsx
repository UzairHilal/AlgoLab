import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import { Plus, Edit3, Trash2, Clock, FileText, X, Save, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";

export default function PracticalsTab({ lab }) {
  const [practicals, setPracticals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "", description: "", instructions: "", deadline: null, order: 0
  });
  const [timeString, setTimeString] = useState("23:59");

  useEffect(() => {
    fetchPracticals();
  }, [lab]);

  const fetchPracticals = async () => {
    try {
      const res = await apiFetch(`practicals/lab/${lab._id}`);
      const data = await res.json();
      setPracticals(data);
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setForm({ title: "", description: "", instructions: "", deadline: null, order: 0 });
    setTimeString("23:59");
    setEditing(null);
    setShowForm(false);
  };

  const getCombinedDeadline = () => {
    if (!form.deadline) return null;

    const [hours, minutes] = timeString.split(":").map(Number);
    const deadline = new Date(form.deadline);
    deadline.setHours(hours, minutes, 0, 0);
    return deadline.toISOString();
  };

  const handleSubmit = async () => {
    if (!form.title) return toast.error("Title is required");
    try {
      const payload = {
        title: form.title,
        description: form.description,
        instructions: form.instructions,
        labId: lab._id,
        deadline: getCombinedDeadline(),
        order: form.order
      };

      if (editing) {
        await apiFetch(`practicals/${editing}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        toast.success("Practical updated");
      } else {
        await apiFetch("practicals", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        toast.success("Practical created");
      }
      resetForm();
      fetchPracticals();
    } catch (err) {
      toast.error("Failed to save");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this practical?")) return;
    try {
      await apiFetch(`practicals/${id}`, { method: "DELETE" });
      toast.success("Practical deleted");
      fetchPracticals();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleEdit = (p) => {
    setEditing(p._id);
    const deadlineDate = p.deadline ? new Date(p.deadline) : null;
    setForm({
      title: p.title,
      description: p.description || "",
      instructions: p.instructions || "",
      deadline: deadlineDate,
      order: p.order || 0
    });
    if (deadlineDate) {
      const h = deadlineDate.getHours().toString().padStart(2, "0");
      const m = deadlineDate.getMinutes().toString().padStart(2, "0");
      setTimeString(`${h}:${m}`);
    } else {
      setTimeString("23:59");
    }
    setShowForm(true);
  };

  const isOverdue = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const formatDeadline = (deadline) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    return date.toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    }) + " at " + date.toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FileText size={20} className="text-purple-400" />
          Practicals ({practicals.length})
        </h3>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300 hover:bg-purple-500/30 transition"
        >
          <Plus size={16} />
          Add Practical
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="rounded-2xl border border-white/10 bg-black/20 p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">{editing ? "Edit Practical" : "New Practical"}</h3>
            <button onClick={resetForm}><X size={18} className="text-gray-400" /></button>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Title *</label>
            <input
              type="text"
              placeholder="e.g., Binary Search Implementation"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Description</label>
            <textarea
              placeholder="Brief description of the practical..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full p-2.5 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Instructions</label>
            <textarea
              placeholder="Step-by-step instructions for students..."
              value={form.instructions}
              onChange={(e) => setForm({ ...form, instructions: e.target.value })}
              rows={3}
              className="w-full p-2.5 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Deadline - Date + Time */}
          <div>
            <label className="text-xs text-gray-500 mb-2 block">Deadline</label>
            <div className="flex gap-3">
              {/* Date Picker */}
              <div className="flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/10 text-left transition ${
                        !form.deadline ? "text-gray-500" : "text-white"
                      } hover:border-purple-400/30 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    >
                      <span className="flex items-center gap-2">
                        <CalendarIcon size={15} className="text-gray-500" />
                        {form.deadline ? format(form.deadline, "PPP") : "Pick a date"}
                      </span>
                      {form.deadline && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setForm({ ...form, deadline: null });
                          }}
                          className="text-gray-500 hover:text-red-400"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl" align="start">
                    <Calendar
                      mode="single"
                      selected={form.deadline}
                      onSelect={(date) => setForm({ ...form, deadline: date })}
                      initialFocus
                      className="rounded-xl bg-zinc-900 text-white"
                      classNames={{
                        day_selected: "bg-purple-500 text-white hover:bg-purple-600",
                        day_today: "bg-white/10 text-white",
                        day: "text-gray-300 hover:bg-white/10 rounded-lg",
                        nav_button: "text-white hover:bg-white/10 rounded-lg",
                        caption: "text-white",
                        head_cell: "text-gray-500",
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Picker */}
              <div className="w-32">
                <div className="relative">
                  <Clock size={15} className="absolute left-3 top-3 text-gray-500" />
                  <input
                    type="time"
                    value={timeString}
                    onChange={(e) => setTimeString(e.target.value)}
                    className="w-full pl-10 pr-3 p-2.5 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>
            {form.deadline && (
              <p className="text-xs text-gray-500 mt-1.5">
                Deadline: {format(form.deadline, "PPP")} at {timeString ? 
                  new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
                  : "23:59"}
              </p>
            )}
          </div>

          {/* Order */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Order <span className="text-gray-600">(display sequence, e.g., 1, 2, 3...)</span>
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
              className="w-full p-2.5 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-medium transition"
          >
            <Save size={16} />
            {editing ? "Update Practical" : "Create Practical"}
          </button>
        </motion.div>
      )}

      {/* PRACTICALS LIST */}
      <div className="flex flex-col gap-3">
        {practicals.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border border-dashed border-white/10 rounded-2xl">
            <FileText size={32} className="mx-auto mb-2 opacity-50" />
            <p>No practicals yet</p>
            <p className="text-xs mt-1">Click "Add Practical" to create one</p>
          </div>
        ) : (
          practicals.sort((a, b) => (a.order || 0) - (b.order || 0)).map((p, i) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-xl border border-white/10 bg-black/20 p-4 hover:border-purple-400/20 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs bg-white/5 px-2 py-0.5 rounded-full text-gray-500">
                      #{p.order || 0}
                    </span>
                    <h4 className="text-white font-semibold">{p.title}</h4>
                  </div>
                  {p.description && (
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{p.description}</p>
                  )}
                  {p.deadline && (
                    <p className={`flex items-center gap-1 text-xs mt-2 ${
                      isOverdue(p.deadline) ? "text-red-400" : "text-gray-500"
                    }`}>
                      <Clock size={12} />
                      {isOverdue(p.deadline) ? "Overdue: " : "Deadline: "}
                      {formatDeadline(p.deadline)}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(p)}
                    className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 hover:bg-cyan-500/20 transition"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="p-2 rounded-lg bg-red-500/10 border border-red-400/20 text-red-400 hover:bg-red-500/20 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}