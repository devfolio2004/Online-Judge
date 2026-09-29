import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axiosClient from "../utils/axiosClient";

const LANGUAGES = [
    "C++",
    "Java",
    "JavaScript",
    "Python",
];

const TAGS = [
    "Array",
    "Graph Theory",
    "Tree",
    "Linked List",
    "Dynamic Programming",
    "Stack",
    "Queue",
    "Binary Search",
    "Two Pointers",
];

const createEmptyVisibleTestCase = () => ({
    input: "",
    output: "",
    explanation: "",
});

const createEmptyHiddenTestCase = () => ({
    input: "",
    output: "",
});

const createEmptyBoilerplate = (language) => ({
    language,
    initialCode: "",
});

const createEmptyEditorial = (language) => ({
    language,
    completeCode: "",
});

function CreateProblem() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        difficulty: "Easy",
        tags: [],
        visibleTestCases: [
            createEmptyVisibleTestCase(),
        ],
        hiddenTestCases: [
            createEmptyHiddenTestCase(),
        ],
        boilerPlate: LANGUAGES.map(
            createEmptyBoilerplate
        ),
        editorialCode: LANGUAGES.map(
            createEmptyEditorial
        ),
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleBasicChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleTagChange = (tag) => {
        setFormData((current) => {
            const alreadySelected =
                current.tags.includes(tag);

            return {
                ...current,
                tags: alreadySelected
                    ? current.tags.filter(
                          (item) => item !== tag
                      )
                    : [...current.tags, tag],
            };
        });
    };

    const handleVisibleTestChange = (
        index,
        field,
        value
    ) => {
        setFormData((current) => {
            const updated = [
                ...current.visibleTestCases,
            ];

            updated[index] = {
                ...updated[index],
                [field]: value,
            };

            return {
                ...current,
                visibleTestCases: updated,
            };
        });
    };

    const handleHiddenTestChange = (
        index,
        field,
        value
    ) => {
        setFormData((current) => {
            const updated = [
                ...current.hiddenTestCases,
            ];

            updated[index] = {
                ...updated[index],
                [field]: value,
            };

            return {
                ...current,
                hiddenTestCases: updated,
            };
        });
    };

    const handleBoilerplateChange = (
        language,
        value
    ) => {
        setFormData((current) => ({
            ...current,

            boilerPlate:
                current.boilerPlate.map((item) =>
                    item.language === language
                        ? {
                              ...item,
                              initialCode: value,
                          }
                        : item
                ),
        }));
    };

    const handleEditorialChange = (
        language,
        value
    ) => {
        setFormData((current) => ({
            ...current,

            editorialCode:
                current.editorialCode.map((item) =>
                    item.language === language
                        ? {
                              ...item,
                              completeCode: value,
                          }
                        : item
                ),
        }));
    };

    const addVisibleTestCase = () => {
        setFormData((current) => ({
            ...current,
            visibleTestCases: [
                ...current.visibleTestCases,
                createEmptyVisibleTestCase(),
            ],
        }));
    };

    const removeVisibleTestCase = (index) => {
        setFormData((current) => ({
            ...current,
            visibleTestCases:
                current.visibleTestCases.filter(
                    (_, currentIndex) =>
                        currentIndex !== index
                ),
        }));
    };

    const addHiddenTestCase = () => {
        setFormData((current) => ({
            ...current,
            hiddenTestCases: [
                ...current.hiddenTestCases,
                createEmptyHiddenTestCase(),
            ],
        }));
    };

    const removeHiddenTestCase = (index) => {
        setFormData((current) => ({
            ...current,
            hiddenTestCases:
                current.hiddenTestCases.filter(
                    (_, currentIndex) =>
                        currentIndex !== index
                ),
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            if (!formData.title.trim()) {
                throw new Error(
                    "Problem title is required."
                );
            }

            if (!formData.description.trim()) {
                throw new Error(
                    "Problem description is required."
                );
            }

            if (formData.tags.length === 0) {
                throw new Error(
                    "Select at least one tag."
                );
            }

            if (
                formData.visibleTestCases.length === 0
            ) {
                throw new Error(
                    "Add at least one visible test case."
                );
            }

            if (
                formData.hiddenTestCases.length === 0
            ) {
                throw new Error(
                    "Add at least one hidden test case."
                );
            }

            for (const testCase of formData.visibleTestCases) {
                if (
                    !testCase.input.trim() ||
                    !testCase.output.trim()
                ) {
                    throw new Error(
                        "Every visible test case needs input and output."
                    );
                }
            }

            for (const testCase of formData.hiddenTestCases) {
                if (
                    !testCase.input.trim() ||
                    !testCase.output.trim()
                ) {
                    throw new Error(
                        "Every hidden test case needs input and output."
                    );
                }
            }

            for (const item of formData.boilerPlate) {
                if (!item.initialCode.trim()) {
                    throw new Error(
                        `${item.language} boilerplate is required.`
                    );
                }
            }

            for (const item of formData.editorialCode) {
                if (!item.completeCode.trim()) {
                    throw new Error(
                        `${item.language} editorial code is required.`
                    );
                }
            }

            const response = await axiosClient.post(
                "/problems/create",
                formData
            );

            setSuccess(
                response.data?.message ||
                    "Problem created successfully."
            );

            setTimeout(() => {
                navigate("/admin");
            }, 1000);
        } catch (err) {
            console.error(
                "Failed to create problem:",
                err
            );

            const message =
                err.message &&
                !err.response
                    ? err.message
                    : err.response?.data?.message ||
                      err.response?.data?.Error ||
                      "Failed to create problem.";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200">
            <header className="border-b border-base-300 bg-base-100">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Create Problem
                        </h1>

                        <p className="text-sm text-base-content/60">
                            Add a new coding problem
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admin")
                        }
                        className="btn btn-ghost"
                    >
                        Back to Admin
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 py-8">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    {error && (
                        <div className="alert alert-error">
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success">
                            <span>{success}</span>
                        </div>
                    )}

                    {/* BASIC INFORMATION */}
                    <section className="rounded-xl border border-base-300 bg-base-100 p-6">
                        <h2 className="mb-4 text-xl font-bold">
                            Basic Information
                        </h2>

                        <div className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Title
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={
                                        formData.title
                                    }
                                    onChange={
                                        handleBasicChange
                                    }
                                    className="input input-bordered"
                                    placeholder="e.g. Two Sum"
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Description
                                    </span>
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleBasicChange
                                    }
                                    className="textarea textarea-bordered h-32"
                                    placeholder="Describe the problem..."
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Difficulty
                                    </span>
                                </label>

                                <select
                                    name="difficulty"
                                    value={
                                        formData.difficulty
                                    }
                                    onChange={
                                        handleBasicChange
                                    }
                                    className="select select-bordered"
                                >
                                    <option value="Easy">
                                        Easy
                                    </option>

                                    <option value="Medium">
                                        Medium
                                    </option>

                                    <option value="Hard">
                                        Hard
                                    </option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* TAGS */}
                    <section className="rounded-xl border border-base-300 bg-base-100 p-6">
                        <h2 className="mb-4 text-xl font-bold">
                            Tags
                        </h2>

                        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                            {TAGS.map((tag) => (
                                <label
                                    key={tag}
                                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-base-300 p-3"
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.tags.includes(
                                            tag
                                        )}
                                        onChange={() =>
                                            handleTagChange(
                                                tag
                                            )
                                        }
                                        className="checkbox checkbox-sm"
                                    />

                                    <span className="text-sm">
                                        {tag}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* VISIBLE TEST CASES */}
                    <section className="rounded-xl border border-base-300 bg-base-100 p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold">
                                Visible Test Cases
                            </h2>

                            <button
                                type="button"
                                onClick={
                                    addVisibleTestCase
                                }
                                className="btn btn-primary btn-sm"
                            >
                                + Add Test Case
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formData.visibleTestCases.map(
                                (
                                    testCase,
                                    index
                                ) => (
                                    <div
                                        key={index}
                                        className="rounded-lg border border-base-300 bg-base-200 p-4"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <h3 className="font-semibold">
                                                Test Case{" "}
                                                {index +
                                                    1}
                                            </h3>

                                            {formData
                                                .visibleTestCases
                                                .length >
                                                1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeVisibleTestCase(
                                                            index
                                                        )
                                                    }
                                                    className="btn btn-error btn-xs"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <textarea
                                                value={
                                                    testCase.input
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleVisibleTestChange(
                                                        index,
                                                        "input",
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                className="textarea textarea-bordered h-32 font-mono text-sm"
                                                placeholder="Input"
                                            />

                                            <textarea
                                                value={
                                                    testCase.output
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleVisibleTestChange(
                                                        index,
                                                        "output",
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                className="textarea textarea-bordered h-32 font-mono text-sm"
                                                placeholder="Expected output"
                                            />
                                        </div>

                                        <textarea
                                            value={
                                                testCase.explanation
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleVisibleTestChange(
                                                    index,
                                                    "explanation",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            className="textarea textarea-bordered mt-4 w-full"
                                            placeholder="Explanation (optional)"
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    </section>

                    {/* HIDDEN TEST CASES */}
                    <section className="rounded-xl border border-base-300 bg-base-100 p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold">
                                Hidden Test Cases
                            </h2>

                            <button
                                type="button"
                                onClick={
                                    addHiddenTestCase
                                }
                                className="btn btn-primary btn-sm"
                            >
                                + Add Test Case
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formData.hiddenTestCases.map(
                                (
                                    testCase,
                                    index
                                ) => (
                                    <div
                                        key={index}
                                        className="rounded-lg border border-base-300 bg-base-200 p-4"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <h3 className="font-semibold">
                                                Hidden Test{" "}
                                                {index +
                                                    1}
                                            </h3>

                                            {formData
                                                .hiddenTestCases
                                                .length >
                                                1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeHiddenTestCase(
                                                            index
                                                        )
                                                    }
                                                    className="btn btn-error btn-xs"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <textarea
                                                value={
                                                    testCase.input
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleHiddenTestChange(
                                                        index,
                                                        "input",
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                className="textarea textarea-bordered h-32 font-mono text-sm"
                                                placeholder="Hidden input"
                                            />

                                            <textarea
                                                value={
                                                    testCase.output
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    handleHiddenTestChange(
                                                        index,
                                                        "output",
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                className="textarea textarea-bordered h-32 font-mono text-sm"
                                                placeholder="Expected output"
                                            />
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </section>

                    {/* BOILERPLATE */}
                    <section className="rounded-xl border border-base-300 bg-base-100 p-6">
                        <h2 className="mb-2 text-xl font-bold">
                            Boilerplate Code
                        </h2>

                        <p className="mb-4 text-sm text-base-content/60">
                            This is the initial code shown to
                            users in the editor.
                        </p>

                        <div className="space-y-6">
                            {formData.boilerPlate.map(
                                (item) => (
                                    <div
                                        key={item.language}
                                    >
                                        <label className="mb-2 block font-semibold">
                                            {
                                                item.language
                                            }
                                        </label>

                                        <textarea
                                            value={
                                                item.initialCode
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleBoilerplateChange(
                                                    item.language,
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            className="textarea textarea-bordered h-56 w-full font-mono text-sm"
                                            placeholder={`${item.language} boilerplate`}
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    </section>

                    {/* EDITORIAL CODE */}
                    <section className="rounded-xl border border-base-300 bg-base-100 p-6">
                        <h2 className="mb-2 text-xl font-bold">
                            Editorial / Reference Solutions
                        </h2>

                        <p className="mb-4 text-sm text-base-content/60">
                            These complete solutions are
                            validated by the backend through
                            Judge0 before the problem is stored.
                        </p>

                        <div className="space-y-6">
                            {formData.editorialCode.map(
                                (item) => (
                                    <div
                                        key={item.language}
                                    >
                                        <label className="mb-2 block font-semibold">
                                            {
                                                item.language
                                            }
                                        </label>

                                        <textarea
                                            value={
                                                item.completeCode
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleEditorialChange(
                                                    item.language,
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            className="textarea textarea-bordered h-64 w-full font-mono text-sm"
                                            placeholder={`${item.language} complete solution`}
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    </section>

                    {/* SUBMIT */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary btn-lg"
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner"></span>
                                    Creating...
                                </>
                            ) : (
                                "Create Problem"
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default CreateProblem;