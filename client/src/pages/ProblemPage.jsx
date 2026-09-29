import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";

import axiosClient from "../utils/axiosClient";

const editorLanguageMap = {
    "C++": "cpp",
    Java: "java",
    JavaScript: "javascript",
    Python: "python",
};

function ProblemPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [problem, setProblem] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [code, setCode] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axiosClient.get(
                    `/problems/fetch/${id}`
                );

                const fetchedProblem =
                    response.data.problem ||
                    response.data.data ||
                    response.data;

                setProblem(fetchedProblem);

                if (fetchedProblem?.boilerPlate?.length > 0) {
                    const firstBoilerplate =
                        fetchedProblem.boilerPlate[0];

                    setSelectedLanguage(
                        firstBoilerplate.language
                    );

                    setCode(
                        firstBoilerplate.initialCode
                    );
                }
            } catch (err) {
                console.error(
                    "Failed to fetch problem:",
                    err
                );

                if (err.response?.status === 401) {
                    navigate("/login", {
                        replace: true,
                    });
                    return;
                }

                setError(
                    err.response?.data?.message ||
                    err.response?.data?.Error ||
                    "Failed to load problem."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProblem();
    }, [id, navigate]);

    const handleLanguageChange = (event) => {
        const language = event.target.value;

        setSelectedLanguage(language);

        const selectedBoilerplate =
            problem.boilerPlate.find(
                (item) => item.language === language
            );

        setCode(
            selectedBoilerplate?.initialCode || ""
        );
    };

    const handleCodeChange = (value) => {
        setCode(value ?? "");
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-base-200 p-8">
                <div className="mx-auto max-w-3xl">
                    <div className="alert alert-error">
                        <span>{error}</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!problem) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>Problem not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200">
            {/* Header */}
            <header className="border-b border-base-300 bg-base-100">
                <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3">
                    <button
                        onClick={() => navigate("/")}
                        className="btn btn-ghost"
                    >
                        ← Problems
                    </button>

                    <h1 className="font-semibold">
                        Online Judge
                    </h1>
                </div>
            </header>

            {/* Main */}
            <main className="mx-auto grid max-w-[1600px] gap-4 p-4 lg:grid-cols-2">
                
                {/* LEFT SIDE */}
                <section className="rounded-xl border border-base-300 bg-base-100 p-6">
                    
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h2 className="text-3xl font-bold">
                                {problem.title}
                            </h2>

                            {problem.problemCreator && (
                                <p className="mt-1 text-sm text-base-content/60">
                                    By{" "}
                                    {problem.problemCreator.userName}
                                </p>
                            )}
                        </div>

                        <span
                            className={`badge badge-lg ${
                                problem.difficulty === "Easy"
                                    ? "badge-success"
                                    : problem.difficulty === "Medium"
                                    ? "badge-warning"
                                    : "badge-error"
                            }`}
                        >
                            {problem.difficulty}
                        </span>
                    </div>

                    {/* Tags */}
                    <div className="mb-6 flex flex-wrap gap-2">
                        {problem.tags?.map((tag) => (
                            <span
                                key={tag}
                                className="badge badge-outline"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Description */}
                    <div className="prose max-w-none">
                        <h3>Description</h3>

                        <p className="whitespace-pre-wrap">
                            {problem.description}
                        </p>
                    </div>

                    {/* Examples */}
                    {problem.visibleTestCases?.length > 0 && (
                        <div className="mt-8">
                            <h3 className="mb-4 text-xl font-bold">
                                Examples
                            </h3>

                            <div className="space-y-4">
                                {problem.visibleTestCases.map(
                                    (testCase, index) => (
                                        <div
                                            key={index}
                                            className="rounded-lg border border-base-300 bg-base-200 p-4"
                                        >
                                            <h4 className="mb-3 font-semibold">
                                                Example{" "}
                                                {index + 1}
                                            </h4>

                                            <div className="space-y-3">
                                                <div>
                                                    <p className="mb-1 text-sm font-medium">
                                                        Input
                                                    </p>

                                                    <pre className="overflow-x-auto rounded bg-base-300 p-3 text-sm">
                                                        {
                                                            testCase.input
                                                        }
                                                    </pre>
                                                </div>

                                                <div>
                                                    <p className="mb-1 text-sm font-medium">
                                                        Output
                                                    </p>

                                                    <pre className="overflow-x-auto rounded bg-base-300 p-3 text-sm">
                                                        {
                                                            testCase.output
                                                        }
                                                    </pre>
                                                </div>

                                                {testCase.explanation && (
                                                    <div>
                                                        <p className="mb-1 text-sm font-medium">
                                                            Explanation
                                                        </p>

                                                        <p className="text-sm text-base-content/80">
                                                            {
                                                                testCase.explanation
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </section>

                {/* RIGHT SIDE */}
                <section className="flex min-h-[700px] flex-col overflow-hidden rounded-xl border border-base-300 bg-base-100">

                    {/* Language selector */}
                    <div className="flex items-center justify-between border-b border-base-300 p-3">
                        <select
                            value={selectedLanguage}
                            onChange={handleLanguageChange}
                            className="select select-bordered select-sm"
                        >
                            {problem.boilerPlate?.map(
                                (item) => (
                                    <option
                                        key={item.language}
                                        value={item.language}
                                    >
                                        {item.language}
                                    </option>
                                )
                            )}
                        </select>

                        <span className="text-sm text-base-content/60">
                            {selectedLanguage}
                        </span>
                    </div>

                    {/* Monaco */}
                    <div className="min-h-0 flex-1">
                        <Editor
                            height="100%"
                            language={
                                editorLanguageMap[
                                    selectedLanguage
                                ] || "plaintext"
                            }
                            theme="vs-dark"
                            value={code}
                            onChange={handleCodeChange}
                            options={{
                                minimap: {
                                    enabled: false,
                                },
                                fontSize: 14,
                                automaticLayout: true,
                                scrollBeyondLastLine: false,
                                padding: {
                                    top: 12,
                                },
                            }}
                        />
                    </div>

                    {/* Bottom */}
                    <div className="flex items-center justify-between border-t border-base-300 p-3">
                        <div className="text-sm text-base-content/60">
                            Ready to submit
                        </div>

                        <button
                            className="btn btn-primary"
                            disabled
                        >
                            Submit
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default ProblemPage;