import React, { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import {
    Users,
    BookOpen,
    CheckCircle,
    FileCode
} from "lucide-react";
import { useNavigate } from "react-router-dom";


function StatCard({
    title,
    value,
    icon,
    route
}) {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(route)}
            className="
    rounded-2xl
    border border-white/10
    bg-white/5
    backdrop-blur-xl
    p-6
    shadow-xl
    cursor-pointer
    transition-all
    hover:scale-[1.02]
    hover:border-emerald-500/30
  "
        >
            <div className="flex justify-between items-center">

                <div>
                    <p className="text-gray-400 text-sm">
                        {title}
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {value}
                    </h2>
                </div>

                <div className="
          p-4 rounded-xl
          bg-emerald-500/10
          text-emerald-400
        ">
                    {icon}
                </div>

            </div>
        </div>
    );
}

function AdminDashboard() {

    const [stats, setStats] = useState(null);

    useEffect(() => {

        const fetchStats = async () => {

            try {

                const res =
                    await apiFetch("admin/stats");

                const data = await res.json();

                setStats(data);

            } catch (err) {
                console.error(err);
            }
        };

        fetchStats();

    }, []);

    if (!stats) {
        return (
            <div className="text-center py-20 text-gray-400">
                Loading dashboard...
            </div>
        );
    }

    return (
        <div className="p-6 flex flex-col gap-6">

            <div>
                <h1 className="text-3xl font-bold">
                    Admin Dashboard
                </h1>

                <p className="text-gray-400 mt-1">
                    Monitor platform activity
                </p>
            </div>

            {/* STATS */}
            <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-5
      ">

                <StatCard
                    title="Students"
                    value={stats.totalStudents}
                    icon={<Users />}
                    route="/admin/students"
                />

                <StatCard
                    title="Algorithms"
                    value={stats.totalAlgorithms}
                    icon={<BookOpen />}
                    route="/admin/algorithms"
                />

                <StatCard
                    title="Completed"
                    value={stats.completedAlgorithms}
                    icon={<CheckCircle />}
                    route="/admin/progress"
                />

                <StatCard
                    title="Submissions"
                    value={stats.totalSubmissions}
                    icon={<FileCode />}
                    route="/admin/submissions"
                />

            </div>

            {/* RECENT ACTIVITY */}
            <div className="
        rounded-2xl
        border border-white/10
        bg-white/5
        backdrop-blur-xl
        p-6
      ">

                <h2 className="text-xl font-semibold mb-4">
                    Recent Activity
                </h2>

                <div className="flex flex-col gap-3">

                    {stats.recentProgress.length === 0 ? (
                        <p className="text-gray-400">
                            No recent activity
                        </p>
                    ) : (
                        stats.recentProgress.map((item, i) => (
                            <div
                                key={i}
                                className="
                  flex justify-between
                  items-center
                  border border-white/5
                  rounded-xl
                  px-4 py-3
                  bg-black/20
                "
                            >
                                <div>
                                    <p className="font-medium">
                                        {item.algorithmSlug}
                                    </p>

                                    <p className="text-xs text-gray-400">
                                        Algorithm completed
                                    </p>
                                </div>

                                <div className="text-xs text-gray-500">
                                    {new Date(
                                        item.completedAt
                                    ).toLocaleString()}
                                </div>
                            </div>
                        ))
                    )}

                </div>
            </div>

        </div>
    );
}

export default AdminDashboard;