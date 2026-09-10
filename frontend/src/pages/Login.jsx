import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", form);

      localStorage.setItem("token", response.data.token);

      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user),
        );
      }

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">

      <div className="auth-left">

        <div className="auth-brand">
          SHOPMART
        </div>

        <div className="auth-left-content">
          <span>WELCOME BACK</span>

          <h1>
            Shop smarter.
            <br />
            Live better.
          </h1>

          <p>
            Discover quality products, great prices and
            a simple shopping experience.
          </p>
        </div>

      </div>

      <div className="auth-right">

        <div className="auth-form-card">

          <Link to="/" className="auth-mobile-logo">
            SHOPMART
          </Link>

          <div className="auth-title">
            <h2>Welcome Back</h2>

            <p>
              Login to your account to continue
            </p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="input-group">

              <label>Email Address</label>

              <div className="input-wrapper">
                <span>✉</span>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

            </div>

            <div className="input-group">

              <label>Password</label>

              <div className="input-wrapper">
                <span>🔒</span>

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

            </div>

            <div className="forgot-row">
              <span> </span>

              <button
                type="button"
                className="forgot-btn"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
              {!loading && <span>→</span>}
            </button>

          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/register">
              Create Account
            </Link>
          </p>

          <Link to="/" className="auth-home">
            ← Back to Shop
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;