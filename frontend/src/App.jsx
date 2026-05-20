import {
  useLocation,
  useNavigate,
  Route,
  Routes
} from "react-router-dom";

import Navbar from "./components/layout/Navbar";

import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";

import AlgoDashboard from "./components/layout/AlgoDashboard";
import AlgoWorkspace from "./components/layout/AlgoWorkspace";

import ProtectedRoute from "./utils/ProtectedRoute";

import {
  useEffect,
  useState
} from "react";

import AdminDashboard from "./components/admin/AdminDashboard";
import AdminRoute from "./components/auth/AdminRoute";
import AdminStudents from "./components/admin/AdminStudents";
import StudentDetails from "./components/admin/StudentDetails";

export default function App() {

  const location = useLocation();

  const navigate = useNavigate();

  const [role, setRole] =
    useState(null);

  useEffect(() => {

    setRole(
      localStorage.getItem("role")
    );

  }, []);

  useEffect(() => {

    if (!role) return;

    if (
      role === "admin" &&
      location.pathname === "/"
    ) {

      navigate("/admin");

    }

    if (
      role === "student" &&
      location.pathname === "/"
    ) {

      navigate("/dashboard");

    }

  }, [
    role,
    location.pathname
  ]);

  const isLanding =
    location.pathname === "/";

  return (
    <>

      <Toaster position="top-center" />

      <div
        className="
          min-h-screen
          flex
          flex-col
          bg-gradient-to-br
          from-black
          via-zinc-900
          to-zinc-950
          text-white
        "
      >

        <Navbar />

        <div
          className="
            sticky
            top-0
            z-40
            backdrop-blur-md
            bg-white/5
            border-b
            border-white/10
          "
        >
        </div>

        <div
          className={`
            flex-1
            ${isLanding
              ? ""
              : "px-4 md:px-8 py-6"
            }
          `}
        >

          <div
            className={
              isLanding
                ? ""
                : `
                  max-w-full
                  mx-auto
                  bg-white/5
                  border
                  border-white/10
                  rounded-2xl
                  p-4
                  md:p-6
                  shadow-xl
                  backdrop-blur-md
                `
            }
          >

            <Routes>

              {/* PUBLIC */}

              <Route
                path="/"
                element={<LandingPage />}
              />

              <Route
                path="/login"
                element={<Login />}
              />

              <Route
                path="/register"
                element={<Register />}
              />

              {/* STUDENT */}

              <Route
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      "student"
                    ]}
                  />
                }
              >

                <Route
                  path="/dashboard"
                  element={
                    <AlgoDashboard />
                  }
                />

                <Route
                  path="/algo/:id"
                  element={
                    <AlgoWorkspace />
                  }
                />

              </Route>

              {/* ADMIN */}

              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/students"
                element={
                  <AdminRoute>
                    <AdminStudents />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/students/:id"
                element={
                  <AdminRoute>
                    <StudentDetails />
                  </AdminRoute>
                }
              />

            </Routes>

          </div>

        </div>

      </div>

    </>
  );
}