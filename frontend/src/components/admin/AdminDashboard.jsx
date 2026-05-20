import React, { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";

import {
  Users,
  BookOpen,
  CheckCircle,
  FileCode,
  Activity,
  ArrowUpRight,
  Sparkles
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { motion } from "motion/react";


function StatCard({
  title,
  value,
  icon,
  route,
  gradient
}) {

  const navigate =
    useNavigate();

  return (

    <motion.div
      whileHover={{
        y: -4,
        scale: 1.01
      }}

      transition={{
        duration: 0.2
      }}

      onClick={() =>
        navigate(route)
      }

      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border border-white/10
        bg-white/[0.04]
        backdrop-blur-2xl
        p-5
        shadow-xl
        cursor-pointer
        transition-all duration-300
        hover:border-emerald-400/20
      "
    >

      <div
        className={`
          absolute inset-0 opacity-0
          group-hover:opacity-100
          transition duration-500
          bg-gradient-to-br
          ${gradient}
        `}
      />

      <div className="relative flex items-start justify-between">

        <div>

          <p className="text-xs uppercase tracking-wider text-gray-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-3 text-white">
            {value}
          </h2>

          <div className="flex items-center gap-1 mt-3 text-xs text-emerald-400">
            View Details
            <ArrowUpRight size={13} />
          </div>

        </div>

        <div
          className="
            p-4 rounded-2xl
            border border-white/10
            bg-black/20
            text-white
            shadow-lg
          "
        >
          {icon}
        </div>

      </div>

    </motion.div>
  );
}

function AdminDashboard() {

  const [stats, setStats] =
    useState(null);

  useEffect(() => {

    const fetchStats = async () => {

      try {

        const res =
          await apiFetch(
            "admin/stats"
          );

        const data =
          await res.json();

        setStats(data);

      } catch (err) {

        console.error(err);

      }
    };

    fetchStats();

  }, []);

  if (!stats) {

    return (

      <div
        className="
          flex flex-col items-center justify-center
          py-24 text-gray-400
        "
      >

        <div
          className="
            w-10 h-10
            border-2 border-emerald-400/30
            border-t-emerald-400
            rounded-full
            animate-spin
            mb-4
          "
        />

        Loading dashboard...

      </div>
    );
  }

  return (

    <div className="p-4 md:p-6 flex flex-col gap-6">

      {/* HEADER */}

      <div
        className="
          relative overflow-hidden
          rounded-3xl
          border border-white/10
          bg-gradient-to-br
          from-emerald-500/10
          via-cyan-500/5
          to-purple-500/10
          backdrop-blur-2xl
          px-6 py-7
        "
      >

        <div
          className="
            absolute top-0 right-0
            w-52 h-52
            bg-emerald-500/10
            blur-3xl rounded-full
          "
        />

        <div className="relative flex items-center justify-between gap-4">

          <div>

            <h1
              className="
                text-2xl md:text-3xl
                font-bold tracking-tight
                text-white
              "
            >
              Admin Dashboard
            </h1>

            <p className="text-sm text-gray-400 mt-2">
              Monitor students, submissions and platform growth.
            </p>

          </div>

          <div
            className="
              hidden md:flex
              items-center justify-center
              w-16 h-16
              rounded-2xl
              bg-white/5
              border border-white/10
            "
          >

            <Activity
              size={28}
              className="text-emerald-400"
            />

          </div>

        </div>

      </div>

      {/* STATS */}

      <div
        className="
          grid grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-5
        "
      >

        <StatCard
          title="Students"
          value={stats.totalStudents}
          icon={<Users size={24} />}
          route="/admin/students"
          gradient="
            from-emerald-500/10
            to-transparent
          "
        />

        <StatCard
          title="Algorithms"
          value={stats.totalAlgorithms}
          icon={<BookOpen size={24} />}
          route="/admin/algorithms"
          gradient="
            from-cyan-500/10
            to-transparent
          "
        />

        <StatCard
          title="Completed"
          value={stats.completedAlgorithms}
          icon={<CheckCircle size={24} />}
          route="/admin/progress"
          gradient="
            from-purple-500/10
            to-transparent
          "
        />

        <StatCard
          title="Submissions"
          value={stats.totalSubmissions}
          icon={<FileCode size={24} />}
          route="/admin/submissions"
          gradient="
            from-orange-500/10
            to-transparent
          "
        />

      </div>

      {/* RECENT ACTIVITY */}

      <div
        className="
          rounded-3xl
          border border-white/10
          bg-white/[0.04]
          backdrop-blur-2xl
          p-5 md:p-6
          shadow-xl
        "
      >

        <div className="flex items-center justify-between mb-5">

          <div>

            <h2 className="text-xl font-semibold text-white">
              Recent Activity
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Latest student completions across the platform
            </p>

          </div>

          <div
            className="
              px-3 py-1
              rounded-full
              text-xs
              border border-emerald-400/20
              bg-emerald-500/10
              text-emerald-300
            "
          >
            Live
          </div>

        </div>

        <div className="flex flex-col gap-3">

          {stats.recentProgress.length === 0 ? (

            <div
              className="
                text-center
                py-10
                text-gray-500
                border border-dashed border-white/10
                rounded-2xl
              "
            >
              No recent activity
            </div>

          ) : (

            stats.recentProgress.map((item, i) => (

              <motion.div
                key={i}

                initial={{
                  opacity: 0,
                  y: 10
                }}

                animate={{
                  opacity: 1,
                  y: 0
                }}

                transition={{
                  delay: i * 0.05
                }}

                className="
                  group
                  flex items-center justify-between
                  gap-4
                  rounded-2xl
                  border border-white/6
                  bg-black/20
                  px-4 py-4
                  transition-all duration-300
                  hover:bg-white/[0.03]
                  hover:border-emerald-400/20
                "
              >

                <div className="flex items-center gap-4">

                  <div
                    className="
                      flex items-center justify-center
                      w-11 h-11
                      rounded-xl
                      bg-emerald-500/10
                      border border-emerald-400/10
                    "
                  >

                    <CheckCircle
                      size={18}
                      className="text-emerald-400"
                    />

                  </div>

                  <div>

                    <p className="font-medium text-white">
                      {item.algorithmSlug}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Algorithm completed successfully
                    </p>

                  </div>

                </div>

                <div className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(
                    item.completedAt
                  ).toLocaleString()}
                </div>

              </motion.div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;