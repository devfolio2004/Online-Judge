import { useEffect, useState } from "react";

import axiosClient from "../utils/axiosClient";

function SubmissionHistory({ problemId, refreshKey }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosClient.get(
          `/submissions/problem/${problemId}`,
        );

        setSubmissions(response.data.submissions || []);
      } catch (err) {
        console.error("Failed to fetch submission history:", err);

        setError(
          err.response?.data?.message || "Failed to load submission history.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [problemId, refreshKey]);

  if (loading) {
    return (
      <div className="py-4 text-center">
        <span className="loading loading-spinner"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error mt-4">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="mb-3 text-xl font-bold">Submission History</h3>

      {submissions.length === 0 ? (
        <div className="rounded-lg border border-base-300 bg-base-200 p-4 text-sm text-base-content/60">
          No submissions yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-base-300">
          <table className="table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Language</th>
                <th>Tests</th>
                <th>Runtime</th>
                <th>Memory</th>
                <th>Submitted</th>
              </tr>
            </thead>

            <tbody>
              {submissions.map((submission) => (
                <tr key={submission._id}>
                  <td>
                    <span
                      className={`badge ${
                        submission.status === "Accepted"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {submission.status}
                    </span>
                  </td>

                  <td>{submission.language}</td>

                  <td>
                    {submission.testCasesPassed} / {submission.totalTestCases}
                  </td>

                  <td>{submission.runtime ?? "-"}</td>

                  <td>{submission.memory ?? "-"}</td>

                  <td className="text-sm">
                    {new Date(submission.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SubmissionHistory;
