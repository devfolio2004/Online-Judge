import { Link } from "react-router-dom";

function ProblemCard({ problem, solved }) {
    return (
        <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <Link
                            to={`/problems/${problem._id}`}
                            className="card-title transition hover:text-primary"
                        >
                            {problem.title}
                        </Link>

                        {problem.problemCreator && (
                            <p className="mt-1 text-sm text-base-content/60">
                                By{" "}
                                {problem.problemCreator.userName}
                            </p>
                        )}
                    </div>

                    {solved && (
                        <span className="badge badge-success">
                            Solved
                        </span>
                    )}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span
                        className={`badge ${
                            problem.difficulty === "Easy"
                                ? "badge-success"
                                : problem.difficulty === "Medium"
                                ? "badge-warning"
                                : "badge-error"
                        }`}
                    >
                        {problem.difficulty}
                    </span>

                    {problem.tags?.map((tag) => (
                        <span
                            key={tag}
                            className="badge badge-outline"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="card-actions justify-end">
                    <Link
                        to={`/problems/${problem._id}`}
                        className="btn btn-primary btn-sm"
                    >
                        Solve
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ProblemCard;