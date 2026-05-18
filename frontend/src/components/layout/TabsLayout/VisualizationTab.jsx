import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// 🔁 CHANGE THIS DATA TO TEST

// Palindrome
// const steps = [
//   {
//     array: ["M", "A", "D", "A", "M"],
//     active: [0, 4],
//     found: false,
//     message: "Compare M and M",
//   },
//   {
//     array: ["M", "A", "D", "A", "M"],
//     active: [0, 4],
//     found: true,
//     message: "Match",
//   },
//   {
//     array: ["M", "A", "D", "A", "M"],
//     active: [1, 3],
//     found: false,
//     message: "Compare A and A",
//   },
//   {
//     array: ["M", "A", "D", "A", "M"],
//     active: [1, 3],
//     found: true,
//     message: "Match",
//   },
//   {
//     array: ["M", "A", "D", "A", "M"],
//     active: [2],
//     found: true,
//     message: "Palindrome confirmed",
//   },
// ];

// ✅ Bubble Sort Example (uncomment to test)
// const steps = [
//   { array: [4,7,2,9], active: [0,1], found: false, message: "Compare 4 & 7" },
//   { array: [4,7,2,9], active: [1,2], found: false, message: "Compare 7 & 2" },
//   { array: [4,2,7,9], active: [1,2], found: true, message: "Swap 7 & 2" },
//   { array: [4,2,7,9], active: [2,3], found: false, message: "Compare 7 & 9" },
//   { array: [4,2,7,9], active: [3], found: true, message: "9 fixed" },
// ];

// Linear search
// const steps = [
//   { array: [3, 8, 7, 10], active: [0], found: false, message: "Is 3 === 7? No." },
//   { array: [3, 8, 7, 10], active: [1], found: false, message: "Is 8 === 7? No." },
//   { array: [3, 8, 7, 10], active: [2], found: true, message: "Found 7 at index 2!" },
// ];

// Binary Search
// const steps = [
//   { array: [2, 5, 8, 12, 18, 25, 30], active: [0, 1, 2, 3, 4, 5, 6], found: false, message: "Initial Range" },
//   { array: [2, 5, 8, 12, 18, 25, 30], active: [3], found: false, message: "Check middle: 12. Too low!" },
//   { array: [2, 5, 8, 12, 18, 25, 30], active: [4, 5, 6], found: false, message: "New range: Right side" },
//   { array: [2, 5, 8, 12, 18, 25, 30], active: [5], found: false, message: "Check middle: 25. Too high!" },
//   { array: [2, 5, 8, 12, 18, 25, 30], active: [4], found: true, message: "Found 18!" },
// ];

// Two Sum Problem
// const steps = [
//   {
//     array: [2, 11, 7, 15],
//     active: [0, 1],
//     found: false,
//     message: "2 + 11 = 13 (Target 9)",
//   },
//   {
//     array: [2, 11, 7, 15],
//     active: [0, 2],
//     found: true,
//     message: "2 + 7 = 9. Match Found!",
//   },
// ];

const stepsLoadFail = [
  {
    array: [0, 0, 0, 0],
    active: [],
    found: false,
    message: "Loading Visualization...",
  },
  {
    array: [0, 0, 0, 0],
    active: [0, 1, 2, 3, 4],
    found: false,
    message: "Failed!",
  },
];

const VisualiztionTab = ({ algo }) => {
  const [i, setI] = useState(0);

  const steps =
    algo.animationSteps && algo.animationSteps.length > 0
      ? algo.animationSteps
      : stepsLoadFail;

  const step = steps[i];

  useEffect(() => {
    const id = setInterval(() => {
      setI((prev) => (prev + 1) % steps?.length);
    }, 2000);
    return () => clearInterval(id);
  });

  // useEffect(() => {
  //   step.found ? toast.success(step.message) : toast.error(step.message);

  //   return () => {i >= steps.length - 1 && toast.dismissAll()};
  // });

  return (
    <div>
      <div className="flex">
        <h2 className="text-md font-bold mb-3 text-center">
          {algo?.title || "Algorithm"} Visualization
        </h2>
      </div>

      <div
        className="min-h-screen text-white p-6"
        style={{
          backgroundColor: "bg-[var(--bg-primary)]",
          backgroundImage: `radial-gradient(circle, #5a5a5a 0.5px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      >
        <div className="h-80 flex flex-col items-center justify-center gap-10">
          {step?.target ? (
            <div className="w-full flex justify-center sm:text-xl gap-2">
              <p>Target: </p>
              <strong>{step.target}</strong>
            </div>
          ) : null}
          {/* ARRAY */}
          <div className="flex gap-2 sm:gap-6">
            {step.array.map((val, indx) => {
              let bg = "rgba(255,255,255,0.05)";
              let glow = "";

              if (step.active?.includes(indx) && step.found === false) {
                bg = "linear-gradient(135deg, #ff4d4d, #ff0000)";
                glow = "0 0 20px rgba(255,0,0,0.6)";
              } else if (step.active?.includes(indx) && step.found === true) {
                bg = "linear-gradient(135deg, #4dff88, #00cc44)";
                glow = "0 0 20px rgba(0,255,100,0.6)";
              }

              return (
                <div
                  key={indx}
                  style={{
                    background: bg,
                    boxShadow: glow,
                    backdropFilter: "blur(10px)",
                    transition: "all 0.4s ease",
                    transform: step.active?.includes(indx)
                      ? "scale(1.15)"
                      : "scale(1)",
                  }}
                  className="
                  w-8 h-8
                  sm:w-20 sm:h-20
                  flex items-center justify-center
                  rounded-sm
                  border border-white/10
                  text-lg font-semibold
                  tracking-wide
          
                "
                >
                  {val}
                </div>
              );
            })}
          </div>

          {/* Message */}
          <div className="px-2 py-1 sm:px-6 sm:py-3 rounded-sm bg-[rgba(255,255,255,0.05)] backdrop-blur-md border border-white/10 text-center sm:text-lg">
            {step.message}
          </div>
          <div className="block sm:block">
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                duration: 3000,
                style: {
                  position:"relative",
                  top:"60vh",
                  background: "rgba(255,255,255,0.05)",
                  color: "#fff",
                  backdropFilter: "blur(3px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  padding: "12px 16px",
                  fontSize: "14px",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualiztionTab;
