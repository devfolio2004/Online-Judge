import { Navigate, Route, Routes } from "react-router-dom";

import Admin from "../pages/Admin";
import CreateProblem from "../pages/CreateProblem";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ProtectedRoute from "./ProtectedRoute";
import ProblemPage from "../pages/ProblemPage";


import AdminRoute from "./AdminRoute";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Signup />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />

                <Route
                  path="/problems/:id"
                  element={<ProblemPage />}
                />
            </Route>

          <Route element={<AdminRoute />}>
            <Route
              path="/admin"
              element={<Admin />}
            />
            <Route
              path="/admin/create"
              element={<CreateProblem />}
            />
          </Route>

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
        </Routes>
    );
}

export default AppRoutes;