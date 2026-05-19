import { apiFetch } from "@/utils/api";
import { useState } from "react";

import toast from "react-hot-toast";

import { motion } from "motion/react";

import {
  Eye,
  EyeOff,
  Lock,
  Sparkles,
  GraduationCap,
  Shield,
  Hash,
  User
} from "lucide-react";

export default function Login() {

  const [role, setRole] =
    useState("student");

  const [rollNumber, setRollNumber] =
    useState("");

  const [fullName, setFullName] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    showPassword,
    setShowPassword
  ] = useState(false);

  // ================= LOGIN =================

  const handleLogin = async () => {

    if (!password) {
      return toast.error(
        "Password is required"
      );
    }

    if (
      role === "student" &&
      !rollNumber
    ) {
      return toast.error(
        "Roll number is required"
      );
    }

    if (
      role === "admin" &&
      !fullName
    ) {
      return toast.error(
        "Full name is required"
      );
    }

    setLoading(true);

    try {

      const res = await apiFetch(
        "auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            rollNumber:
              role === "student"
                ? rollNumber
                : "",

            fullName:
              role === "admin"
                ? fullName
                : "",

            password
          })
        }
      );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(
          data.msg ||
          "Login failed"
        );

      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "role",
        data.role
      );

      toast.success(
        "Welcome back 👋"
      );

      window.location.href = "/";

    } catch (err) {

      toast.error(err.message);

    } finally {

      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        px-4
        text-white
      "
    >

      <motion.div
        initial={{
          opacity: 0,
          y: 40,
          filter: "blur(10px)"
        }}

        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)"
        }}

        transition={{
          duration: 0.5
        }}

        className="
          w-full
          max-w-md
        "
      >

        <div
          className="
            bg-white/5
            backdrop-blur-xl
            border
            border-white/10
            rounded-2xl
            p-8
            shadow-xl
          "
        >

          {/* HEADER */}

          <div
            className="
              flex
              flex-col
              items-center
              gap-2
              mb-6
            "
          >

            <Sparkles
              className="
                text-emerald-400
              "
            />

            <h2
              className="
                text-2xl
                md:text-3xl
                font-bold
                tracking-tight
              "
            >
              Welcome Back
            </h2>

            <p
              className="
                text-sm
                text-gray-400
              "
            >
              Login to continue
              your journey
            </p>

          </div>

          {/* ROLE SELECT */}

          <div
            className="
              flex
              gap-3
              mb-4
            "
          >

            <button
              type="button"

              onClick={() =>
                setRole("student")
              }

              className={`
                flex-1
                flex
                items-center
                justify-center
                gap-2
                py-2
                rounded-xl
                border
                transition

                ${role === "student"
                  ? `
                    bg-emerald-500/20
                    border-emerald-400
                    text-emerald-300
                  `
                  : `
                    border-white/10
                    text-gray-400
                    hover:bg-white/10
                  `
                }
              `}
            >

              <GraduationCap
                size={16}
              />

              Student

            </button>

            <button
              type="button"

              onClick={() =>
                setRole("admin")
              }

              className={`
                flex-1
                flex
                items-center
                justify-center
                gap-2
                py-2
                rounded-xl
                border
                transition

                ${role === "admin"
                  ? `
                    bg-purple-500/20
                    border-purple-400
                    text-purple-300
                  `
                  : `
                    border-white/10
                    text-gray-400
                    hover:bg-white/10
                  `
                }
              `}
            >

              <Shield
                size={16}
              />

              Teacher

            </button>

          </div>

          {/* FORM */}

          <div
            className="
              flex
              flex-col
              gap-4
            "
          >

            {/* STUDENT LOGIN */}

            {role === "student" && (

              <div className="relative">

                <Hash
                  className="
                    absolute
                    left-3
                    top-3
                    text-gray-400
                  "
                  size={16}
                />

                <input
                  type="text"

                  value={rollNumber}

                  onChange={(e) =>
                    setRollNumber(
                      e.target.value.toUpperCase()
                    )
                  }

                  placeholder="Roll Number"

                  className="
                    w-full
                    pl-10
                    pr-3
                    py-2
                    rounded-xl
                    bg-black/30
                    border
                    border-white/10
                    focus:outline-none
                    focus:ring-2
                    focus:ring-emerald-500
                  "
                />

              </div>
            )}

            {/* ADMIN LOGIN */}

            {role === "admin" && (

              <div className="relative">

                <User
                  className="
                    absolute
                    left-3
                    top-3
                    text-gray-400
                  "
                  size={16}
                />

                <input
                  type="text"

                  value={fullName}

                  onChange={(e) =>
                    setFullName(
                      e.target.value
                    )
                  }

                  placeholder="Full Name"

                  className="
                    w-full
                    pl-10
                    pr-3
                    py-2
                    rounded-xl
                    bg-black/30
                    border
                    border-white/10
                    focus:outline-none
                    focus:ring-2
                    focus:ring-emerald-500
                  "
                />

              </div>
            )}

            {/* PASSWORD */}

            <div className="relative">

              <Lock
                className="
                  absolute
                  left-3
                  top-3
                  text-gray-400
                "
                size={16}
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }

                value={password}

                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }

                placeholder="Password"

                className="
                  w-full
                  pl-10
                  pr-10
                  py-2
                  rounded-xl
                  bg-black/30
                  border
                  border-white/10
                  focus:outline-none
                  focus:ring-2
                  focus:ring-emerald-500
                "
              />

              <button
                type="button"

                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }

                className="
                  absolute
                  right-3
                  top-2
                  text-gray-400
                  hover:text-white
                "
              >

                {showPassword ? (
                  <EyeOff
                    size={16}
                  />
                ) : (
                  <Eye
                    size={16}
                  />
                )}

              </button>

            </div>

            {/* LOGIN BUTTON */}

            <button
              onClick={handleLogin}

              disabled={loading}

              className={`
                mt-2
                py-2
                rounded-xl
                font-medium
                transition-all

                ${loading
                  ? `
                    bg-gray-500
                    cursor-not-allowed
                  `
                  : `
                    bg-gradient-to-r
                    from-emerald-500
                    to-green-600
                    hover:opacity-90
                    shadow-md
                  `
                }
              `}
            >

              {loading
                ? "Signing in..."
                : "Login"}

            </button>

            {/* REGISTER */}

            <p
              className="
                text-sm
                text-center
                text-gray-400
                mt-2
              "
            >

              Don’t have an account?{" "}

              <span
                className="
                  text-emerald-400
                  cursor-pointer
                  hover:underline
                "

                onClick={() =>
                (
                  window.location.href =
                  "/register"
                )
                }
              >
                Register
              </span>

            </p>

          </div>

        </div>
      </motion.div>
    </div>
  );
}