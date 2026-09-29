import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axiosClient from "../utils/axiosClient";

function Admin() {
    const navigate = useNavigate();

    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const fetchProblems = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axiosClient.get(
                "/problems/fetchall?page=1&limit=100"
            );

            setProblems(response.data.data || []);
        } catch (err) {
            console.error(
                "Failed to fetch admin problems:",
                err
            );

            if (err.response?.status === 401) {
                navigate("/login", { replace: true });
                return;
            }

            if (err.response?.status === 403) {
                navigate("/", { replace: true });
                return;
            }

            setError(
                err.response?.data?.message ||
                err.response?.data?.Error ||
                "Failed to load problems."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProblems();
    }, []);

    const handleDelete = async (problemId, title) => {
        const confirmed = window.confirm(
            `Delete "${title}"? This action cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(problemId);

            await axiosClient.delete(
                `/problems/delete/${problemId}`
            );

            setProblems((currentProblems) =>
                currentProblems.filter(
                    (problem) =>
                        problem._id !== problemId
                )
            );
        } catch (err) {
            console.error(
                "Failed to delete problem:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.Error ||
                "Failed to delete problem."
            );
        } finally {
            setDeletingId(null);
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
                            Admin Dashboard
                        </h1>

                        <p className="text-sm text-base-content/60">
                            Manage coding problems
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/")}
                        className="btn btn-ghost"
                    >
                        Back to Problems
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8">
                {error && (
                    <div className="alert alert-error mb-6">
                        <span>{error}</span>
                    </div>
                )}

                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">
                            Problems
                        </h2>

                        <p className="text-sm text-base-content/60">
                            {problems.length} loaded
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/admin/create")}
                        className="btn btn-primary"
                    >
                        Create Problem
                    </button>
                </div>

                {problems.length === 0 ? (
                    <div className="rounded-xl border border-base-300 bg-base-100 p-8 text-center">
                        <p className="font-medium">
                            No problems found.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-base-300 bg-base-100">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Difficulty</th>
                                    <th>Tags</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {problems.map((problem) => (
                                    <tr key={problem._id}>
                                        <td>
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/problems/${problem._id}`
                                                    )
                                                }
                                                className="font-semibold hover:text-primary"
                                            >
                                                {problem.title}
                                            </button>
                                        </td>

                                        <td>
                                            <span
                                                className={`badge ${
                                                    problem.difficulty ===
                                                    "Easy"
                                                        ? "badge-success"
                                                        : problem.difficulty ===
                                                          "Medium"
                                                        ? "badge-warning"
                                                        : "badge-error"
                                                }`}
                                            >
                                                {
                                                    problem.difficulty
                                                }
                                            </span>
                                        </td>

                                        <td>
                                            <div className="flex flex-wrap gap-1">
                                                {problem.tags?.map(
                                                    (tag) => (
                                                        <span
                                                            key={tag}
                                                            className="badge badge-outline"
                                                        >
                                                            {tag}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </td>

                                        <td>
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        problem._id,
                                                        problem.title
                                                    )
                                                }
                                                className="btn btn-error btn-sm"
                                                disabled={
                                                    deletingId ===
                                                    problem._id
                                                }
                                            >
                                                {deletingId ===
                                                problem._id ? (
                                                    <span className="loading loading-spinner loading-sm"></span>
                                                ) : (
                                                    "Delete"
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Admin;