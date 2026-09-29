import { Navigate, Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Signup />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />

                <Route
                    path="/problems/:id"
                    element={
                        <h1 className="p-8 text-2xl">
                            Problem Page Coming Next
                        </h1>
                    }
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