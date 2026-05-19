import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "@/utils/api";

import { ChevronLeft } from "lucide-react";
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

      const res =
        await apiFetch(`admin/students/${id}`);

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
      <div className="text-center py-10 text-gray-400">
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-10 text-red-400">
        Failed to load student
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6">

      {/* BACK BUTTON */}
      <Button
        onClick={() => navigate(-1)}
        className="
          max-w-fit
          bg-white/10
          hover:bg-white/20
          border border-white/10
        "
      >
        <ChevronLeft size={16} />
        Back
      </Button>

      {/* HEADER */}
      <div className="
        rounded-2xl
        border border-white/10
        bg-white/5
        backdrop-blur-xl
        p-6
      ">

        {/* <h1 className="text-3xl font-bold">
          {data.student.username}
        </h1> */}
        <div className="flex flex-col gap-2">

          <h1 className="text-3xl font-bold">
            {data.student.fullName}
          </h1>

          <div className="flex items-center gap-3 text-sm text-gray-400">

            <span>
              Roll No:
            </span>

            <span className="
      px-3 py-1 rounded-lg
      bg-white/5
      border border-white/10
      text-white
    ">
              {data.student.rollNumber}
            </span>

          </div>

        </div>

        <p className="text-gray-400 mt-1">
          Student Progress Monitoring
        </p>

        <div className="mt-5">

          <div className="flex justify-between mb-2 text-sm">
            <span>Progress</span>
            <span>{data.progressPercent}%</span>
          </div>

          <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{
                width: `${data.progressPercent}%`
              }}
            />
          </div>

        </div>

      </div>

      {/* COMPLETED */}
      <div className="
        rounded-2xl
        border border-green-500/20
        bg-green-500/5
        p-6
      ">

        <h2 className="text-xl font-semibold text-green-400 mb-4">
          Completed Algorithms
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {data.completed.length === 0 && (
            <p className="text-gray-400">
              No completed algorithms
            </p>
          )}

          {data.completed.map((algo) => (

            <div
              key={algo._id}
              className="
                p-4 rounded-xl
                bg-black/20
                border border-green-500/10
              "
            >

              <h3 className="font-semibold">
                {algo.title}
              </h3>

              <p className="text-sm text-gray-400 mt-1">
                {algo.category}
              </p>

            </div>
          ))}

        </div>
      </div>

      {/* PENDING */}
      <div className="
        rounded-2xl
        border border-yellow-500/20
        bg-yellow-500/5
        p-6
      ">

        <h2 className="text-xl font-semibold text-yellow-400 mb-4">
          Pending Algorithms
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {data.pending.length === 0 && (
            <p className="text-gray-400">
              All algorithms completed
            </p>
          )}

          {data.pending.map((algo) => (

            <div
              key={algo._id}
              className="
                p-4 rounded-xl
                bg-black/20
                border border-yellow-500/10
              "
            >

              <h3 className="font-semibold">
                {algo.title}
              </h3>

              <p className="text-sm text-gray-400 mt-1">
                {algo.category}
              </p>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default StudentDetails;