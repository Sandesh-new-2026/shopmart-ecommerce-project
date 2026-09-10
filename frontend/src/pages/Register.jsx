import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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
      const response = await api.post("/auth/register", form);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed",
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

          <span>JOIN SHOPMART</span>

          <h1>
            Your shopping
            <br />
            starts here.
          </h1>

          <p>
            Create your account and discover products
            you'll love.
          </p>

        </div>

      </div>

      <div className="auth-right">

        <div className="auth-form-card">

          <Link to="/" className="auth-mobile-logo">
            SHOPMART
          </Link>

          <div className="auth-title">

            <h2>Create Account</h2>

            <p>
              Join us and start shopping today
            </p>

          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="input-group">

              <label>Full Name</label>

              <div className="input-wrapper">

                <span>👤</span>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />

              </div>

            </div>

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
                  placeholder="Create a password"
                  minLength="6"
                  required
                />

              </div>

            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}

              {!loading && <span>→</span>}
            </button>

          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">
              Login
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

export default Register;
