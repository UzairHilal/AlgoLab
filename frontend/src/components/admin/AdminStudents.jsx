import React, {
  useEffect,
  useState
} from "react";

import { apiFetch } from "@/utils/api";

import {
  Search,
  User,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

function AdminStudents() {

  const navigate = useNavigate();

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
      <div className="
        text-center
        py-20
        text-gray-400
      ">
        Loading students...
      </div>
    );
  }

  return (
    <div className="
      p-6
      flex
      flex-col
      gap-6
    ">

      <Button
        onClick={() => navigate("/admin")}
        className="
          max-w-fit
          px-4
          py-2
          rounded-xl
          bg-white/10
          hover:bg-white/20
        "
      >
        <ChevronLeft size={16} />
        Back
      </Button>

      <div>

        <h1 className="
          text-3xl
          font-bold
        ">
          Student Monitor
        </h1>

        <p className="
          text-gray-400
          mt-1
        ">
          Track student progress
          and completion
        </p>

      </div>

      {/* SEARCH */}

      <div className="
        relative
        max-w-md
      ">

        <Search
          size={18}
          className="
            absolute
            left-3
            top-3
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
            pl-10
            pr-4
            py-3
            rounded-xl
            bg-white/5
            border border-white/10
            outline-none
          "
        />

      </div>

      {/* TABLE */}

      <div className="
        rounded-2xl
        border border-white/10
        bg-white/5
        backdrop-blur-xl
        overflow-hidden
      ">

        {/* HEADER */}

        <div className="
          grid
          grid-cols-5
          gap-4
          px-6
          py-4
          border-b
          border-white/10
          text-gray-400
          text-sm
          font-medium
        ">

          <div>Student</div>
          <div>Roll No.</div>
          <div>Progress</div>
          <div>Completed</div>
          <div>Latest</div>

        </div>

        {/* BODY */}

        <div className="
          flex
          flex-col
        ">

          {filteredStudents.map(
            (student, i) => (

              <div
                key={i}
                className="
                  grid
                  grid-cols-5
                  gap-4
                  px-6
                  py-5
                  border-b
                  border-white/5
                  hover:bg-white/5
                  cursor-pointer
                  hover:scale-[1.01]
                  transition
                "
                onClick={() =>
                  navigate(
                    `/admin/students/${student.id}`
                  )
                }
              >

                {/* STUDENT */}

                <div className="
                  flex
                  items-center
                  gap-3
                ">

                  <div className="
                    w-10
                    h-10
                    rounded-full
                    bg-emerald-500/10
                    flex
                    items-center
                    justify-center
                    text-emerald-400
                  ">
                    <User size={18} />
                  </div>

                  <div>

                    <p className="
                      font-medium
                    ">
                      {student.fullName}
                    </p>

                    <p className="
                      text-xs
                      text-gray-500
                    ">
                      Student
                    </p>

                  </div>

                </div>

                {/* ROLL NUMBER */}

                <div className="
                  flex
                  items-center
                  text-sm
                  text-gray-300
                ">
                  {student.rollNumber}
                </div>

                {/* PROGRESS */}

                <div className="
                  flex
                  flex-col
                  justify-center
                  gap-2
                ">

                  <div className="
                    w-full
                    h-2
                    rounded-full
                    bg-black/30
                    overflow-hidden
                  ">

                    <div
                      style={{
                        width:
                          `${student.percentage}%`
                      }}
                      className="
                        h-full
                        bg-gradient-to-r
                        from-emerald-500
                        to-green-400
                      "
                    />

                  </div>

                  <p className="
                    text-xs
                    text-gray-400
                  ">
                    {student.percentage}%
                  </p>

                </div>

                {/* COMPLETED */}

                <div className="
                  flex
                  items-center
                  text-sm
                ">

                  {student.completedCount}
                  {" "}
                  algorithms

                </div>

                {/* LATEST */}

                <div className="
                  flex
                  items-center
                  justify-between
                  text-sm
                ">

                  <span>
                    {student.latestAlgorithm}
                  </span>

                  <ChevronRight
                    size={16}
                    className="
                      text-gray-500
                    "
                  />

                </div>

              </div>
            ))}

        </div>

      </div>

    </div>
  );
}

export default AdminStudents;