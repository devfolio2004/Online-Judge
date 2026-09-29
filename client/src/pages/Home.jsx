import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../features/auth/authSlice";
import ProblemCard from "../components/ProblemCard";

function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state) => state.auth.user);

    const [problems, setProblems] = useState([]);
    const [solvedProblems, setSolvedProblems] = useState([]);
    const [pagination, setPagination] = useState(null);

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const limit = 10;

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                setLoading(true);
                setError("");

                const [problemResponse, solvedResponse] =
                    await Promise.all([
                        axiosClient.get(
                            `/problems/fetchall?page=${page}&limit=${limit}`
                        ),
                        axiosClient.get(
                            "/problems/fetchUserSolvedProblems/user"
                        ),
                    ]);

                setProblems(
                    problemResponse.data.data || []
                );

                setPagination(
                    problemResponse.data.pagination || null
                );

                setSolvedProblems(
                    solvedResponse.data.problems || []
                );
            } catch (err) {
                console.error("Failed to fetch problems:", err);

                setError(
                    err.response?.data?.message ||
                    err.response?.data?.Error ||
                    "Failed to load problems."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProblems();
    }, [page]);

    const solvedIds = useMemo(() => {
        return new Set(
            solvedProblems.map((problem) =>
                String(problem._id)
            )
        );
    }, [solvedProblems]);

    const handleLogout = async () => {
        const result = await dispatch(logoutUser());

        if (logoutUser.fulfilled.match(result)) {
            navigate("/login", { replace: true });
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200">
            <header className="border-b border-base-300 bg-base-100">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Online Judge
                        </h1>

                        <p className="text-sm text-base-content/60">
                            Welcome, {user?.firstName}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="badge badge-outline">
                            {user?.role}
                        </span>

                        {user?.role === "admin" && (
                            <button
                            onClick={() => navigate("/admin")}
                            className="btn btn-secondary btn-sm"
                            >
                            Admin
                            </button>
                        )}

                        <button
                            onClick={handleLogout}
                            className="btn btn-error btn-sm"
                        >
                        Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold">
                        Problems
                    </h2>

                    <p className="mt-1 text-base-content/60">
                        Practice coding problems and track your progress.
                    </p>
                </div>

                {error && (
                    <div className="alert alert-error mb-6">
                        <span>{error}</span>
                    </div>
                )}

                {problems.length === 0 ? (
                    <div className="rounded-xl border border-base-300 bg-base-100 p-8 text-center">
                        <p className="text-lg font-medium">
                            No problems found.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {problems.map((problem) => (
                            <ProblemCard
                                key={problem._id}
                                problem={problem}
                                solved={solvedIds.has(
                                    String(problem._id)
                                )}
                            />
                        ))}
                    </div>
                )}

                {pagination && (
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <button
                            className="btn btn-outline"
                            disabled={!pagination.hasPreviousPage}
                            onClick={() =>
                                setPage((currentPage) =>
                                    currentPage - 1
                                )
                            }
                        >
                            Previous
                        </button>

                        <span className="text-sm font-medium">
                            Page {pagination.currentPage} of{" "}
                            {pagination.totalPages}
                        </span>

                        <button
                            className="btn btn-outline"
                            disabled={!pagination.hasNextPage}
                            onClick={() =>
                                setPage((currentPage) =>
                                    currentPage + 1
                                )
                            }
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Home;