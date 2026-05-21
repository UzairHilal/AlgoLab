import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "@/utils/api";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import Editor from "@monaco-editor/react";
import {
    ChevronLeft, FlaskConical, Clock, CheckCircle,
    AlertTriangle, Upload, FileText, Eye, Calendar,
    BarChart3, CalendarCheck, Download, X, Send,
    RotateCcw, Code2, Play, MessageSquare
} from "lucide-react";

export default function StudentLabDetail() {
    const { labId } = useParams();
    const navigate = useNavigate();
    const [lab, setLab] = useState(null);
    const [practicals, setPracticals] = useState([]);
    const [submissions, setSubmissions] = useState({});
    const [evaluations, setEvaluations] = useState({});
    const [marks, setMarks] = useState({});
    const [attendance, setAttendance] = useState(null);
    const [activeTab, setActiveTab] = useState("practicals");
    const [loading, setLoading] = useState(true);
    const [showEditor, setShowEditor] = useState(false);
    const [editorPractical, setEditorPractical] = useState(null);
    const [code, setCode] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAllData();
    }, [labId]);

    const fetchAllData = async () => {
        try {
            const [labRes, pracRes, subRes, marksRes, attRes] = await Promise.all([
                apiFetch(`labs/${labId}`),
                apiFetch(`practicals/lab/${labId}`),
                apiFetch("submissions/my"),
                apiFetch(`marks/lab/${labId}`),
                apiFetch(`attendance/student/${getStudentId()}/${labId}`)
            ]);

            const labData = await labRes.json();
            const pracData = await pracRes.json();
            const subData = await subRes.json();
            const marksData = await marksRes.json();
            const attData = await attRes.json();

            setLab(labData);
            setPracticals(Array.isArray(pracData) ? pracData : []);

            const subMap = {};
            const subArray = Array.isArray(subData) ? subData : [];
            subArray.forEach(s => {
                subMap[s.practicalId?._id || s.practicalId] = s;
            });
            setSubmissions(subMap);

            // Load evaluations for each submission
            const evalMap = {};
            for (const sub of subArray) {
                try {
                    const practicalId = sub.practicalId?._id || sub.practicalId;
                    if (!practicalId) continue;
                    const evalRes = await apiFetch(`evaluations/submission/${sub._id}`);
                    const evalData = await evalRes.json();
                    if (evalData && evalData._id) {
                        evalMap[practicalId] = evalData;
                    }
                } catch (err) {
                    // No evaluation yet — that's fine
                }
            }
            setEvaluations(evalMap);

            const marksMap = {};
            (Array.isArray(marksData) ? marksData : []).forEach(m => {
                marksMap[m.practicalId?._id || m.practicalId] = m;
            });
            setMarks(marksMap);

            setAttendance(attData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStudentId = () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        return user.id || "";
    };

    const openEditor = async (practical) => {
        setEditorPractical(practical);
        setShowEditor(true);

        try {
            const res = await apiFetch(`submissions/my/${practical._id}`);
            const data = await res.json();
            if (data?.submission?.code) {
                setCode(data.submission.code);
            } else {
                setCode(practical.starterCode || "# Write your solution here\n\ndef solution(input):\n    # Your code here\n    pass\n");
            }
        } catch (err) {
            setCode(practical.starterCode || "# Write your solution here\n\ndef solution(input):\n    # Your code here\n    pass\n");
        }
    };

    const handleSubmitCode = async () => {
        if (!editorPractical) return;
        setSubmitting(true);
        try {
            await apiFetch("submissions", {
                method: "POST",
                body: JSON.stringify({
                    practicalId: editorPractical._id,
                    code,
                    language: "python"
                })
            });
            toast.success("Code submitted successfully!");
            setShowEditor(false);
            setEditorPractical(null);
            fetchAllData();
        } catch (err) {
            toast.error("Failed to submit code");
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (practicalId) => {
        const sub = submissions[practicalId];
        if (!sub) return { icon: Clock, color: "text-gray-400 bg-gray-500/10", label: "Pending" };
        if (sub.status === "late") return { icon: AlertTriangle, color: "text-orange-400 bg-orange-500/10", label: "Late" };
        return { icon: CheckCircle, color: "text-emerald-400 bg-emerald-500/10", label: "Submitted" };
    };

    const tabs = [
        { id: "practicals", label: "Practicals", icon: FlaskConical },
        { id: "marks", label: "Marks", icon: BarChart3 },
        { id: "attendance", label: "Attendance", icon: CalendarCheck },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                    <p className="text-gray-400">Loading lab...</p>
                </div>
            </div>
        );
    }

    if (!lab) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-950 flex items-center justify-center">
                <p className="text-red-400">Lab not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-950 p-4 md:p-6">
            <div className="max-w-6xl mx-auto flex flex-col gap-6">

                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4"
                >
                    <button
                        onClick={() => navigate("/student/dashboard")}
                        className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">{lab.name}</h1>
                        <p className="text-sm text-gray-400">{lab.subjectCode} — {lab.session}</p>
                    </div>
                </motion.div>

                {/* TABS */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                                        ? "bg-emerald-500/20 border border-emerald-400/40 text-white shadow-lg shadow-emerald-500/10"
                                        : "bg-white/[0.03] border border-white/10 text-gray-400 hover:bg-white/[0.06] hover:text-white"
                                    }`}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* PRACTICALS TAB */}
                {activeTab === "practicals" && (
                    <motion.div
                        key="practicals"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        {practicals.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center text-gray-500">
                                <FlaskConical size={40} className="mx-auto mb-3 opacity-50" />
                                <p>No practicals assigned yet</p>
                            </div>
                        ) : (
                            practicals.sort((a, b) => (a.order || 0) - (b.order || 0)).map((p, i) => {
                                const badge = getStatusBadge(p._id);
                                const BadgeIcon = badge.icon;
                                const practicalMarks = marks[p._id];
                                const practicalEval = evaluations[p._id];
                                const isPastDeadline = p.deadline && new Date(p.deadline) < new Date();
                                const isSubmitted = !!submissions[p._id];

                                return (
                                    <motion.div
                                        key={p._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`rounded-2xl border backdrop-blur-xl p-5 transition-all ${practicalEval?.status === "approved"
                                                ? "bg-emerald-500/5 border-emerald-400/30"
                                                : practicalEval?.status === "rejected"
                                                    ? "bg-red-500/5 border-red-400/30"
                                                    : "bg-white/[0.04] border-white/10 hover:border-emerald-400/20"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                    <span className="text-xs bg-white/5 px-2 py-1 rounded-full text-gray-500">
                                                        #{p.order || i + 1}
                                                    </span>
                                                    <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${badge.color}`}>
                                                        <BadgeIcon size={12} />
                                                        {badge.label}
                                                    </span>
                                                    {practicalEval && (
                                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${practicalEval.status === "approved"
                                                                ? "text-emerald-400 bg-emerald-500/10 border-emerald-400/20"
                                                                : "text-red-400 bg-red-500/10 border-red-400/20"
                                                            }`}>
                                                            {practicalEval.status === "approved" ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                                                            {practicalEval.status === "approved" ? "Approved" : "Rejected"}
                                                        </span>
                                                    )}
                                                </div>

                                                {p.description && (
                                                    <p className="text-sm text-gray-400 mb-3">{p.description}</p>
                                                )}

                                                {p.deadline && (
                                                    <p className={`flex items-center gap-1 text-xs mb-3 ${isPastDeadline ? "text-red-400" : "text-gray-500"}`}>
                                                        <Calendar size={12} />
                                                        Deadline: {new Date(p.deadline).toLocaleString()}
                                                        {isPastDeadline && " (Overdue)"}
                                                    </p>
                                                )}

                                                {/* Evaluation Feedback */}
                                                {isSubmitted && practicalEval && (
                                                    <div className={`mt-2 p-4 rounded-xl border ${practicalEval.status === "approved"
                                                            ? "bg-emerald-500/5 border-emerald-400/20"
                                                            : "bg-red-500/5 border-red-400/20"
                                                        }`}>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            {practicalEval.status === "approved" ? (
                                                                <CheckCircle size={16} className="text-emerald-400" />
                                                            ) : (
                                                                <AlertTriangle size={16} className="text-red-400" />
                                                            )}
                                                            <span className={`text-sm font-semibold ${practicalEval.status === "approved" ? "text-emerald-400" : "text-red-400"
                                                                }`}>
                                                                {practicalEval.status === "approved" ? "Approved" : "Rejected"}
                                                            </span>
                                                        </div>
                                                        {practicalEval.remarks ? (
                                                            <div className="flex items-start gap-2 mt-2">
                                                                <MessageSquare size={14} className="text-yellow-400 mt-0.5 shrink-0" />
                                                                <p className="text-sm text-gray-300 leading-relaxed">
                                                                    {practicalEval.remarks}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs text-gray-500 mt-1">No feedback provided</p>
                                                        )}
                                                    </div>
                                                )}

                                                {practicalMarks && (
                                                    <div className="mt-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-400/10">
                                                        <p className="text-sm text-emerald-400 font-medium">
                                                            Marks: {practicalMarks.total}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex gap-2 shrink-0">
                                                <button
                                                    onClick={() => openEditor(p)}
                                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-sm hover:bg-cyan-500/30 transition"
                                                >
                                                    <Code2 size={15} />
                                                    {submissions[p._id] ? "Edit Code" : "Write Code"}
                                                </button>
                                                {p.instructions && (
                                                    <button
                                                        onClick={() => {
                                                            toast(p.instructions, {
                                                                duration: 6000,
                                                                icon: "📋",
                                                                style: {
                                                                    background: "#1a1a2e",
                                                                    color: "#fff",
                                                                    border: "1px solid rgba(255,255,255,0.1)",
                                                                }
                                                            });
                                                        }}
                                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm hover:bg-white/10 transition"
                                                    >
                                                        <Eye size={15} />
                                                        <span className="hidden sm:inline">Instructions</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </motion.div>
                )}

                {/* MARKS TAB */}
                {activeTab === "marks" && (
                    <motion.div
                        key="marks"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-5 overflow-x-auto">
                            {Object.keys(marks).length === 0 ? (
                                <div className="text-center py-16 text-gray-500">
                                    <BarChart3 size={40} className="mx-auto mb-3 opacity-50" />
                                    <p>No marks available yet</p>
                                </div>
                            ) : (
                                <table className="w-full text-sm text-left">
                                    <thead className="text-gray-400 border-b border-white/10">
                                        <tr>
                                            <th className="p-3">Practical</th>
                                            <th className="p-3">Viva</th>
                                            <th className="p-3">Obs</th>
                                            <th className="p-3">Exec</th>
                                            <th className="p-3">Record</th>
                                            <th className="p-3">Output</th>
                                            <th className="p-3">Attd</th>
                                            <th className="p-3">Internal</th>
                                            <th className="p-3 font-bold text-white">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.values(marks).map((m, i) => (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                                                <td className="p-3 text-white">{m.practicalId?.title || "—"}</td>
                                                <td className="p-3 text-gray-300">{m.viva}</td>
                                                <td className="p-3 text-gray-300">{m.observation}</td>
                                                <td className="p-3 text-gray-300">{m.execution}</td>
                                                <td className="p-3 text-gray-300">{m.record}</td>
                                                <td className="p-3 text-gray-300">{m.output}</td>
                                                <td className="p-3 text-gray-300">{m.attendance}</td>
                                                <td className="p-3 text-gray-300">{m.internal}</td>
                                                <td className="p-3 text-white font-bold">{m.total}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* ATTENDANCE TAB */}
                {activeTab === "attendance" && (
                    <motion.div
                        key="attendance"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                            {attendance ? (
                                <div className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/5 p-5 text-center">
                                            <p className="text-4xl font-bold text-emerald-400">{attendance.percentage}%</p>
                                            <p className="text-sm text-gray-400 mt-2">Overall Attendance</p>
                                        </div>
                                        <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-emerald-400">Present</span>
                                                <span className="text-white font-semibold">{attendance.present}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-red-400">Absent</span>
                                                <span className="text-white font-semibold">{attendance.absent}</span>
                                            </div>
                                            <div className="flex justify-between text-sm pt-1 border-t border-white/10">
                                                <span className="text-gray-400">Total</span>
                                                <span className="text-white font-semibold">{attendance.total}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-3 rounded-full bg-black/40 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${attendance.percentage}%` }}
                                            transition={{ duration: 0.8 }}
                                            className={`h-full rounded-full ${attendance.percentage >= 75
                                                    ? "bg-gradient-to-r from-emerald-400 to-green-500"
                                                    : "bg-gradient-to-r from-orange-400 to-red-500"
                                                }`}
                                        />
                                    </div>
                                    {attendance.percentage < 75 && (
                                        <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-500/10 border border-orange-400/20 text-orange-300 text-sm">
                                            <AlertTriangle size={16} />
                                            Low attendance — minimum 75% required
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-16 text-gray-500">
                                    <CalendarCheck size={40} className="mx-auto mb-3 opacity-50" />
                                    <p>No attendance records yet</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

            </div>

            {/* CODE EDITOR MODAL */}
            {showEditor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-5xl h-[85vh] rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl flex flex-col overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/5 shrink-0">
                            <div>
                                <h3 className="text-lg font-semibold text-white">{editorPractical?.title}</h3>
                                <p className="text-xs text-gray-400">
                                    {editorPractical?.description || "Write your solution"}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCode("# Write your solution here\n\ndef solution(input):\n    # Your code here\n    pass\n")}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-xs hover:bg-white/10 transition"
                                >
                                    <RotateCcw size={12} />
                                    Reset
                                </button>
                                <button
                                    onClick={handleSubmitCode}
                                    disabled={submitting}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={14} />
                                            Submit
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowEditor(false);
                                        setEditorPractical(null);
                                    }}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1">
                            <Editor
                                height="100%"
                                theme="vs-dark"
                                language="python"
                                value={code}
                                onChange={(value) => setCode(value || "")}
                                options={{
                                    fontSize: 14,
                                    minimap: { enabled: false },
                                    smoothScrolling: true,
                                    padding: { top: 16 },
                                    scrollBeyondLastLine: false,
                                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                    lineNumbers: "on",
                                    renderLineHighlight: "line",
                                    bracketPairColorization: { enabled: true },
                                }}
                            />
                        </div>
                    </motion.div>
                </div>
            )}

        </div>
    );
}