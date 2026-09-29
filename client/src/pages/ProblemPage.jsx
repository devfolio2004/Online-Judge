import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import SubmissionHistory from "../components/SubmissionHistory";
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

  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const [submissionHistoryRefresh, setSubmissionHistoryRefresh] = useState(0);

  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        setError("");

        const [problemResponse, solvedResponse] = await Promise.all([
          axiosClient.get(`/problems/fetch/${id}`),
          axiosClient.get("/problems/fetchUserSolvedProblems/user"),
        ]);

        const fetchedProblem =
          problemResponse.data.problem ||
          problemResponse.data.data ||
          problemResponse.data;

        setProblem(fetchedProblem);

        const solvedProblems = solvedResponse.data.problems || [];

        const solved = solvedProblems.some(
          (item) => String(item._id) === String(id),
        );

        setIsSolved(solved);

        if (fetchedProblem?.boilerPlate?.length > 0) {
          const firstBoilerplate = fetchedProblem.boilerPlate[0];

          setSelectedLanguage(firstBoilerplate.language);

          setCode(firstBoilerplate.initialCode);
        }
      } catch (err) {
        console.error("Failed to fetch problem:", err);

        if (err.response?.status === 401) {
          navigate("/login", {
            replace: true,
          });
          return;
        }

        setError(
          err.response?.data?.message ||
            err.response?.data?.Error ||
            "Failed to load problem.",
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

    const selectedBoilerplate = problem.boilerPlate.find(
      (item) => item.language === language,
    );

    setCode(selectedBoilerplate?.initialCode || "");
  };

  const handleCodeChange = (value) => {
    setCode(value ?? "");
  };
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setSubmission(null);
      setSubmitError("");

      const response = await axiosClient.post(`/submissions/save/${id}`, {
        code,
        language: selectedLanguage,
      });

      setSubmission(response.data.submission);
      if (response.data.submission?.status === "Accepted") {
        setIsSolved(true);
      }
      setSubmissionHistoryRefresh((current) => current + 1);
    } catch (err) {
      console.error("Submission failed:", err);

      setSubmitError(
        err.response?.data?.message ||
          err.response?.data?.Error ||
          "Submission failed.",
      );
    } finally {
      setSubmitting(false);
    }
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
          <button onClick={() => navigate("/")} className="btn btn-ghost">
            ← Problems
          </button>

          <h1 className="font-semibold">Online Judge</h1>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto grid max-w-[1600px] gap-4 p-4 lg:grid-cols-2">
        {/* LEFT SIDE */}
        <section className="rounded-xl border border-base-300 bg-base-100 p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-3xl font-bold">{problem.title}</h2>

              {problem.problemCreator && (
                <p className="mt-1 text-sm text-base-content/60">
                  By {problem.problemCreator.userName}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
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

              {isSolved && (
                <span className="badge badge-success badge-lg">Solved</span>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="mb-6 flex flex-wrap gap-2">
            {problem.tags?.map((tag) => (
              <span key={tag} className="badge badge-outline">
                {tag}
              </span>
            ))}
          </div>

          {/* Description */}
          <div className="prose max-w-none">
            <h3>Description</h3>

            <p className="whitespace-pre-wrap">{problem.description}</p>
          </div>

          {/* Examples */}
          {problem.visibleTestCases?.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-4 text-xl font-bold">Examples</h3>

              <div className="space-y-4">
                {problem.visibleTestCases.map((testCase, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-base-300 bg-base-200 p-4"
                  >
                    <h4 className="mb-3 font-semibold">Example {index + 1}</h4>

                    <div className="space-y-3">
                      <div>
                        <p className="mb-1 text-sm font-medium">Input</p>

                        <pre className="overflow-x-auto rounded bg-base-300 p-3 text-sm">
                          {testCase.input}
                        </pre>
                      </div>

                      <div>
                        <p className="mb-1 text-sm font-medium">Output</p>

                        <pre className="overflow-x-auto rounded bg-base-300 p-3 text-sm">
                          {testCase.output}
                        </pre>
                      </div>

                      {testCase.explanation && (
                        <div>
                          <p className="mb-1 text-sm font-medium">
                            Explanation
                          </p>

                          <p className="text-sm text-base-content/80">
                            {testCase.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
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
              {problem.boilerPlate?.map((item) => (
                <option key={item.language} value={item.language}>
                  {item.language}
                </option>
              ))}
            </select>

            <span className="text-sm text-base-content/60">
              {selectedLanguage}
            </span>
          </div>

          {/* Monaco */}
          <div className="min-h-0 flex-1">
            <Editor
              height="100%"
              language={editorLanguageMap[selectedLanguage] || "plaintext"}
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
          <div className="border-t border-base-300">
            <div className="flex items-center justify-between p-3">
              <div className="text-sm text-base-content/60">
                {submitting
                  ? "Evaluating your submission..."
                  : "Ready to submit"}
              </div>

              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={submitting || !code.trim() || !selectedLanguage}
              >
                {submitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Submitting
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>

            {submitError && (
              <div className="px-3 pb-3">
                <div className="alert alert-error">
                  <span>{submitError}</span>
                </div>
              </div>
            )}

            {submission && (
              <div className="border-t border-base-300 p-4">
                <h3 className="mb-3 text-lg font-bold">Submission Result</h3>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-base-content/60">Status</p>

                    <p
                      className={`font-semibold ${
                        submission.status === "Accepted"
                          ? "text-success"
                          : "text-error"
                      }`}
                    >
                      {submission.status}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-base-content/60">Test Cases</p>

                    <p className="font-semibold">
                      {submission.testCasesPassed} / {submission.totalTestCases}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-base-content/60">Runtime</p>

                    <p className="font-semibold">{submission.runtime ?? "-"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-base-content/60">Memory</p>

                    <p className="font-semibold">{submission.memory ?? "-"}</p>
                  </div>
                </div>

                {submission.errorMessage && (
                  <div className="mt-4">
                    <p className="mb-1 text-sm text-base-content/60">Error</p>

                    <pre className="overflow-x-auto rounded bg-base-300 p-3 text-sm">
                      {submission.errorMessage}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
        <SubmissionHistory
          problemId={id}
          refreshKey={submissionHistoryRefresh}
        />
      </main>
    </div>
  );
}

export default ProblemPage;
