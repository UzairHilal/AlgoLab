import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "@/utils/api";

import {
  ChevronLeft,
  User,
  CheckCircle2,
  Clock3,
  Trophy,
  Layers3
} from "lucide-react";

import { motion } from "motion/react";
import { Button } from "../ui/button";

function StudentDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {

    try {

      const res = await apiFetch(`admin/students/${id}`);

      const result = await res.json();

      setData(result);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-zinc-500">
        Loading student profile...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center py-24 text-red-400">
        Failed to load student
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-4 md:px-6 py-5">

      {/* BACK */}

      <Button
        onClick={() => navigate(-1)}
        className="w-fit rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white shadow-none"
      >
        <ChevronLeft size={16} />
        Back
      </Button>

      {/* HEADER */}

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          relative overflow-hidden
          rounded-3xl
          border border-white/10
          bg-gradient-to-br from-white/8 to-white/4
          backdrop-blur-2xl
          p-5 md:p-6
        "
      >

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_35%)]" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          {/* LEFT */}

          <div className="flex items-start gap-4">

            <div className="
              flex items-center justify-center
              w-16 h-16 rounded-2xl
              bg-emerald-500/10
              border border-emerald-500/20
              text-emerald-400
              shadow-lg shadow-emerald-500/10
            ">
              <User size={28} />
            </div>

            <div className="flex flex-col gap-2">

              <div>
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
                  {data.student.fullName}
                </h1>

                <p className="text-sm text-zinc-400 mt-1">
                  Student Progress Overview
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm">

                <div className="
                  flex items-center gap-2
                  px-3 py-1.5 rounded-xl
                  border border-white/10
                  bg-white/5
                  text-zinc-300
                ">
                  <Layers3 size={14} />
                  Roll No:
                  <span className="text-white font-medium">
                    {data.student.rollNumber}
                  </span>
                </div>

                <div className="
                  flex items-center gap-2
                  px-3 py-1.5 rounded-xl
                  border border-emerald-500/20
                  bg-emerald-500/10
                  text-emerald-300
                ">
                  <Trophy size={14} />
                  {data.progressPercent}% Completed
                </div>

              </div>

            </div>

          </div>

          {/* RIGHT STATS */}

          <div className="grid grid-cols-2 gap-3 min-w-[220px]">

            <div className="
              rounded-2xl
              border border-green-500/10
              bg-green-500/5
              px-4 py-3
            ">
              <div className="flex items-center gap-2 text-green-400 text-sm mb-1">
                <CheckCircle2 size={15} />
                Completed
              </div>

              <h3 className="text-2xl font-semibold text-white">
                {data.completed.length}
              </h3>
            </div>

            <div className="
              rounded-2xl
              border border-yellow-500/10
              bg-yellow-500/5
              px-4 py-3
            ">
              <div className="flex items-center gap-2 text-yellow-400 text-sm mb-1">
                <Clock3 size={15} />
                Pending
              </div>

              <h3 className="text-2xl font-semibold text-white">
                {data.pending.length}
              </h3>
            </div>

          </div>

        </div>

        {/* PROGRESS */}

        <div className="relative mt-6">

          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-zinc-400">
              Overall Progress
            </span>

            <span className="text-emerald-400 font-medium">
              {data.progressPercent}%
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-black/40 border border-white/5">

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.progressPercent}%` }}
              transition={{ duration: 0.8 }}
              className="
                h-full rounded-full
                bg-gradient-to-r
                from-emerald-400
                via-green-500
                to-teal-400
              "
            />

          </div>

        </div>

      </motion.div>

      {/* COMPLETED */}

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="
          rounded-3xl
          border border-green-500/15
          bg-gradient-to-br from-green-500/6 to-transparent
          backdrop-blur-xl
          p-5
        "
      >

        <div className="flex items-center gap-3 mb-5">

          <div className="
            flex items-center justify-center
            w-11 h-11 rounded-2xl
            bg-green-500/10
            text-green-400
            border border-green-500/20
          ">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">
              Completed Algorithms
            </h2>

            <p className="text-sm text-zinc-400">
              Successfully solved algorithms
            </p>
          </div>

        </div>

        {data.completed.length === 0 ? (

          <div className="
            rounded-2xl
            border border-white/5
            bg-black/20
            py-10 text-center
            text-zinc-500
          ">
            No completed algorithms
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

            {data.completed.map((algo, index) => (

              <motion.div
                key={algo._id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ y: -3 }}
                className="
                  group relative overflow-hidden
                  rounded-2xl
                  border border-green-500/10
                  bg-black/20
                  p-4
                  transition-all
                  hover:border-green-400/30
                  hover:bg-green-500/5
                "
              >

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.15),transparent_40%)]" />

                <div className="relative">

                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <h3 className="font-medium text-white">
                        {algo.title}
                      </h3>

                      <p className="text-sm text-zinc-400 mt-1">
                        {algo.category}
                      </p>
                    </div>

                    <div className="
                      flex items-center justify-center
                      min-w-9 h-9 rounded-xl
                      bg-green-500/10
                      text-green-400
                    ">
                      <CheckCircle2 size={16} />
                    </div>

                  </div>

                </div>

              </motion.div>
            ))}

          </div>

        )}

      </motion.div>

      {/* PENDING */}

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="
          rounded-3xl
          border border-yellow-500/15
          bg-gradient-to-br from-yellow-500/6 to-transparent
          backdrop-blur-xl
          p-5
        "
      >

        <div className="flex items-center gap-3 mb-5">

          <div className="
            flex items-center justify-center
            w-11 h-11 rounded-2xl
            bg-yellow-500/10
            text-yellow-400
            border border-yellow-500/20
          ">
            <Clock3 size={20} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">
              Pending Algorithms
            </h2>

            <p className="text-sm text-zinc-400">
              Algorithms left to complete
            </p>
          </div>

        </div>

        {data.pending.length === 0 ? (

          <div className="
            rounded-2xl
            border border-white/5
            bg-black/20
            py-10 text-center
            text-emerald-400
          ">
            🎉 All algorithms completed
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

            {data.pending.map((algo, index) => (

              <motion.div
                key={algo._id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ y: -3 }}
                className="
                  group relative overflow-hidden
                  rounded-2xl
                  border border-yellow-500/10
                  bg-black/20
                  p-4
                  transition-all
                  hover:border-yellow-400/30
                  hover:bg-yellow-500/5
                "
              >

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.12),transparent_40%)]" />

                <div className="relative">

                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <h3 className="font-medium text-white">
                        {algo.title}
                      </h3>

                      <p className="text-sm text-zinc-400 mt-1">
                        {algo.category}
                      </p>
                    </div>

                    <div className="
                      flex items-center justify-center
                      min-w-9 h-9 rounded-xl
                      bg-yellow-500/10
                      text-yellow-400
                    ">
                      <Clock3 size={16} />
                    </div>

                  </div>

                </div>

              </motion.div>
            ))}

          </div>

        )}

      </motion.div>

    </div>
  );
}

export default StudentDetails;