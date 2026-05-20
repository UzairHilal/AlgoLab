import React, {
  useEffect,
  useState
} from "react";

import { apiFetch } from "@/utils/api";

import {
  Search,
  User,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  GraduationCap,
  Activity
} from "lucide-react";

import { Button } from "../ui/button";

import { useNavigate } from "react-router-dom";

import { motion } from "motion/react";

function AdminStudents() {

  const navigate =
    useNavigate();

  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {

    const fetchStudents =
      async () => {

        try {

          const res =
            await apiFetch(
              "admin/students"
            );

          const data =
            await res.json();

          setStudents(data);

        } catch (err) {

          console.error(err);

        } finally {

          setLoading(false);

        }
      };

    fetchStudents();

  }, []);

  const filteredStudents =
    students.filter((student) =>

      student.fullName
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )

      ||

      student.rollNumber
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  if (loading) {

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

        Loading students...

      </div>
    );
  }

  return (

    <div className="p-4 md:p-6 flex flex-col gap-6">

      {/* TOP BAR */}

      <div className="flex items-center justify-between gap-4 flex-wrap">

        <Button
          onClick={() =>
            navigate("/admin")
          }

          className="
            px-4 py-2
            rounded-xl
            bg-white/[0.05]
            border border-white/10
            hover:bg-white/[0.08]
            text-white
          "
        >

          <ChevronLeft size={16} />
          Back

        </Button>

        <div
          className="
            flex items-center gap-2
            px-3 py-2
            rounded-xl
            border border-emerald-400/20
            bg-emerald-500/10
            text-emerald-300
            text-sm
          "
        >

          <Activity size={16} />

          {filteredStudents.length} Students

        </div>

      </div>

      {/* HEADER */}

      <div
        className="
          relative overflow-hidden
          rounded-3xl
          border border-white/10
          bg-gradient-to-br
          from-cyan-500/10
          via-emerald-500/5
          to-purple-500/10
          backdrop-blur-2xl
          px-6 py-7
        "
      >

        <div
          className="
            absolute -top-10 -right-10
            w-52 h-52
            bg-cyan-500/10
            blur-3xl rounded-full
          "
        />

        <div className="relative flex items-start justify-between gap-4">

          <div>

            <div className="flex items-center gap-2 mb-2">

              

              <span className="text-sm text-cyan-300">
                Student Analytics
              </span>

            </div>

            <h1
              className="
                text-2xl md:text-3xl
                font-bold tracking-tight
                text-white
              "
            >
              Student Monitor
            </h1>

            <p className="text-sm text-gray-400 mt-2 max-w-2xl">
              Track student activity, monitor algorithm completion
              progress and view learning performance.
            </p>

          </div>

          <div
            className="
              hidden md:flex
              items-center justify-center
              w-16 h-16
              rounded-2xl
              bg-white/[0.04]
              border border-white/10
            "
          >

            <GraduationCap
              size={28}
              className="text-cyan-400"
            />

          </div>

        </div>

      </div>

      {/* SEARCH */}

      <div className="relative max-w-md">

        <Search
          size={18}
          className="
            absolute
            left-3 top-3.5
            text-gray-500
          "
        />

        <input
          type="text"

          placeholder="Search by name or roll number..."

          value={search}

          onChange={(e) =>
            setSearch(e.target.value)
          }

          className="
            w-full
            pl-10 pr-4 py-3
            rounded-2xl
            bg-white/[0.04]
            border border-white/10
            backdrop-blur-xl
            text-white
            placeholder:text-gray-500
            outline-none
            transition-all
            focus:border-emerald-400/30
            focus:bg-white/[0.06]
          "
        />

      </div>

      {/* STUDENTS */}

      <div className="flex flex-col gap-4">

        {filteredStudents.length === 0 ? (

          <div
            className="
              text-center
              py-16
              rounded-3xl
              border border-dashed border-white/10
              text-gray-500
            "
          >
            No students found
          </div>

        ) : (

          filteredStudents.map(
            (student, i) => (

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
                  delay: i * 0.03
                }}

                whileHover={{
                  y: -2
                }}

                onClick={() =>
                  navigate(
                    `/admin/students/${student.id}`
                  )
                }

                className="
                  group
                  relative overflow-hidden
                  rounded-3xl
                  border border-white/10
                  bg-white/[0.04]
                  backdrop-blur-2xl
                  p-5
                  cursor-pointer
                  transition-all duration-300
                  hover:border-emerald-400/20
                  hover:bg-white/[0.05]
                "
              >

                <div
                  className="
                    absolute inset-0
                    opacity-0 group-hover:opacity-100
                    transition duration-500
                    bg-gradient-to-r
                    from-emerald-500/[0.03]
                    to-cyan-500/[0.03]
                  "
                />

                <div
                  className="
                    relative
                    flex flex-col xl:flex-row
                    xl:items-center
                    justify-between
                    gap-5
                  "
                >

                  {/* LEFT */}

                  <div className="flex items-center gap-4 min-w-0">

                    <div
                      className="
                        w-14 h-14
                        rounded-2xl
                        bg-emerald-500/10
                        border border-emerald-400/10
                        flex items-center justify-center
                        text-emerald-400
                        shrink-0
                      "
                    >

                      <User size={22} />

                    </div>

                    <div className="min-w-0">

                      <h2
                        className="
                          text-white font-semibold
                          truncate
                        "
                      >
                        {student.fullName}
                      </h2>

                      <div className="flex items-center gap-2 mt-1">

                        <span
                          className="
                            text-xs
                            px-2 py-1
                            rounded-full
                            bg-white/[0.05]
                            border border-white/10
                            text-gray-400
                          "
                        >
                          {student.rollNumber}
                        </span>

                        <span className="text-xs text-gray-500">
                          Student
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* CENTER */}

                  <div className="flex-1 max-w-md">

                    <div className="flex items-center justify-between mb-2">

                      <span className="text-xs text-gray-500">
                        Progress
                      </span>

                      <span className="text-sm text-emerald-400 font-medium">
                        {student.percentage}%
                      </span>

                    </div>

                    <div
                      className="
                        w-full h-2.5
                        rounded-full
                        bg-black/30
                        overflow-hidden
                      "
                    >

                      <motion.div
                        initial={{
                          width: 0
                        }}

                        animate={{
                          width:
                            `${student.percentage}%`
                        }}

                        transition={{
                          duration: 0.8
                        }}

                        className="
                          h-full rounded-full
                          bg-gradient-to-r
                          from-emerald-500
                          via-green-400
                          to-cyan-400
                        "
                      />

                    </div>

                  </div>

                  {/* RIGHT */}

                  <div
                    className="
                      flex items-center
                      justify-between xl:justify-end
                      gap-6
                    "
                  >

                    <div className="text-right">

                      <p className="text-lg font-bold text-white">
                        {student.completedCount}
                      </p>

                      <p className="text-xs text-gray-500">
                        Completed
                      </p>

                    </div>

                    <div className="hidden md:block">

                      <p
                        className="
                          text-sm text-gray-300
                          max-w-[180px]
                          truncate
                        "
                      >
                        {student.latestAlgorithm}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Latest Algorithm
                      </p>

                    </div>

                    <div
                      className="
                        w-10 h-10
                        rounded-xl
                        border border-white/10
                        bg-black/20
                        flex items-center justify-center
                        text-gray-500
                        group-hover:text-white
                        group-hover:border-emerald-400/20
                        transition-all
                      "
                    >

                      <ChevronRight size={18} />

                    </div>

                  </div>

                </div>

              </motion.div>
            ))
        )}

      </div>

    </div>
  );
}

export default AdminStudents;