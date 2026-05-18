import { apiFetch } from "@/utils/api";
import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "motion/react";
import {
    User,
    Lock,
    Eye,
    EyeOff,
    Sparkles,
    Shield,
    GraduationCap
} from "lucide-react";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async () => {
        if (!username || !password || !role) {
            return toast.error("All fields are required");
        }

        if (password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        setLoading(true);

        try {
            const res = await apiFetch("auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, role, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.msg || "Registration failed");
            }

            toast.success("Account created");

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);

            window.location.href = "/";
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4
       from-black via-zinc-900 to-zinc-950 text-white">

            <motion.div
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">

                    <div className="flex flex-col items-center gap-2 mb-6">
                        <Sparkles className="text-emerald-400" />
                        <h2 className="text-2xl md:text-3xl font-bold">
                            Create Account
                        </h2>
                        <p className="text-sm text-gray-400">
                            Start your Algo journey 
                        </p>
                    </div>

                    {/* FORM */}
                    <div className="flex flex-col gap-4">

                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input
                                className="w-full pl-10 pr-3 py-2 rounded-xl
                  bg-black/30 border border-white/10
                  focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Username"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full pl-10 pr-10 py-2 rounded-xl
                  bg-black/30 border border-white/10
                  focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2 text-gray-400 hover:text-white"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input
                                type="password"
                                className="w-full pl-10 pr-3 py-2 rounded-xl
                  bg-black/30 border border-white/10
                  focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Confirm Password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        {/* <div className="flex gap-3 mt-2">

                            <button
                                type="button"
                                onClick={() => setRole("student")}
                                className={`
                  flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border transition
                  ${role === "student"
                                        ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                                        : "border-white/10 text-gray-400 hover:bg-white/10"}
                `}
                            >
                                <GraduationCap size={16} />
                                Student
                            </button>

                            <button
                                type="button"
                                onClick={() => setRole("admin")}
                                className={`
                  flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border transition
                  ${role === "admin"
                                        ? "bg-purple-500/20 border-purple-400 text-purple-300"
                                        : "border-white/10 text-gray-400 hover:bg-white/10"}
                `}
                            >
                                <Shield size={16} />
                                Teacher
                            </button>

                        </div> */}

                        <button
                            onClick={handleRegister}
                            disabled={loading}
                            className={`
                mt-3 py-2 rounded-xl font-medium transition-all
                ${loading
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-emerald-500 to-green-600 hover:opacity-90 shadow-md"}
              `}
                        >
                            {loading ? "Creating account..." : "Register"}
                        </button>

                        <p className="text-sm text-center text-gray-400 mt-2">
                            Already have an account?{" "}
                            <span
                                className="text-emerald-400 cursor-pointer hover:underline"
                                onClick={() => (window.location.href = "/login")}
                            >
                                Login
                            </span>
                        </p>

                    </div>
                </div>
            </motion.div>
        </div>
    );
}