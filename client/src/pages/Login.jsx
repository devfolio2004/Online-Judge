import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import {
    clearAuthError,
    fetchMe,
    loginUser,
} from "../features/auth/authSlice";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, loading, error } = useSelector(
        (state) => state.auth
    );

    const [formData, setFormData] = useState({
        email: "",
        password: "",
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

        const result = await dispatch(loginUser(formData));

        if (loginUser.fulfilled.match(result)) {
            navigate("/", { replace: true });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-base-200 px-4">
            <form
                onSubmit={handleSubmit}
                className="card w-full max-w-md bg-base-100 shadow-xl"
            >
                <div className="card-body">
                    <h1 className="card-title justify-center text-2xl">
                        Login
                    </h1>

                    {error && (
                        <div className="alert alert-error">
                            <span>{error}</span>
                        </div>
                    )}

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
                            placeholder="Enter your email"
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
                            placeholder="Enter your password"
                            required
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
                            "Login"
                        )}
                    </button>

                    <p className="text-center text-sm">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="link link-primary"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default Login;