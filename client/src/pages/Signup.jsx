import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import {
    clearAuthError,
    registerUser,
} from "../features/auth/authSlice";

function Signup() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, loading, error } = useSelector(
        (state) => state.auth
    );

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        age: "",
    });

    useEffect(() => {
        if (user) {
            navigate("/", { replace: true });
        }
    }, [user, navigate]);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        dispatch(clearAuthError());

        const payload = {
            ...formData,
            age: formData.age ? Number(formData.age) : undefined,
        };

        const result = await dispatch(registerUser(payload));

        if (registerUser.fulfilled.match(result)) {
            navigate("/", { replace: true });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-8">
            <form
                onSubmit={handleSubmit}
                className="card w-full max-w-lg bg-base-100 shadow-xl"
            >
                <div className="card-body">
                    <h1 className="card-title justify-center text-2xl">
                        Create Account
                    </h1>

                    {error && (
                        <div className="alert alert-error">
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    First Name
                                </span>
                            </label>

                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="input input-bordered"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Last Name
                                </span>
                            </label>

                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="input input-bordered"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                Username
                            </span>
                        </label>

                        <input
                            type="text"
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            className="input input-bordered"
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                Email
                            </span>
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input input-bordered"
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                Password
                            </span>
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input input-bordered"
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                Age
                            </span>
                        </label>

                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            className="input input-bordered"
                            min="6"
                            max="80"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary mt-4"
                    >
                        {loading ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            "Create Account"
                        )}
                    </button>

                    <p className="text-center text-sm">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="link link-primary"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default Signup;