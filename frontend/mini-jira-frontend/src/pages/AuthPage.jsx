import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./AuthPage.css";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.post("/api/auth/login", {
          email: form.email,
          password: form.password,
        });
        login(res.data.token, { email: form.email, name: form.email.split("@")[0] });
        navigate("/dashboard");
      } else {
        await api.post("/api/auth/signup", {
          name: form.name,
          email: form.email,
          password: form.password,
        });
        setSuccess("Account created! You can now log in.");
        setIsLogin(true);
        setForm({ ...form, name: "" });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
  };

  return (
    <div className="auth-page">
      {/* Background decoration */}
      <div className="auth-bg">
        <div className="auth-bg-orb auth-bg-orb-1"></div>
        <div className="auth-bg-orb auth-bg-orb-2"></div>
        <div className="auth-bg-orb auth-bg-orb-3"></div>
        <div className="auth-grid"></div>
      </div>

      <div className="auth-container animate-fade-in">
        {/* Left branding panel */}
        <div className="auth-branding">
          <div className="auth-branding-content">
            <div className="auth-logo">
              <svg width="48" height="48" viewBox="0 0 28 28" fill="none">
                <rect x="2" y="2" width="10" height="10" rx="3" fill="#6c5ce7" />
                <rect x="16" y="2" width="10" height="10" rx="3" fill="#a29bfe" opacity="0.7" />
                <rect x="2" y="16" width="10" height="10" rx="3" fill="#a29bfe" opacity="0.5" />
                <rect x="16" y="16" width="10" height="10" rx="3" fill="#6c5ce7" opacity="0.3" />
              </svg>
            </div>
            <h1 className="auth-title">Mini Jira</h1>
            <p className="auth-subtitle">
              Streamline your workflow. Track issues, manage projects, and ship faster — all in one place.
            </p>

            <div className="auth-features">
              <div className="auth-feature">
                <div className="feature-icon">📋</div>
                <div>
                  <strong>Project Management</strong>
                  <span>Create and organize projects</span>
                </div>
              </div>
              <div className="auth-feature">
                <div className="feature-icon">🎯</div>
                <div>
                  <strong>Issue Tracking</strong>
                  <span>Kanban boards with drag &amp; flow</span>
                </div>
              </div>
              <div className="auth-feature">
                <div className="feature-icon">👥</div>
                <div>
                  <strong>Team Collaboration</strong>
                  <span>Assign tasks to team members</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="auth-form-panel">
          <div className="auth-form-wrapper">
            <div className="auth-form-header">
              <h2>{isLogin ? "Welcome back" : "Create account"}</h2>
              <p>
                {isLogin
                  ? "Enter your credentials to access your workspace"
                  : "Get started with Mini Jira today"}
              </p>
            </div>

            {error && (
              <div className="auth-alert auth-alert-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="auth-alert auth-alert-success">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {success}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="auth-name">Full Name</label>
                  <input
                    id="auth-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required={!isLogin}
                    autoComplete="name"
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="auth-email">Email Address</label>
                <input
                  id="auth-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="auth-password">Password</label>
                <input
                  id="auth-password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="auth-spinner"></span>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="auth-toggle">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button className="auth-toggle-btn" onClick={toggleMode} type="button">
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
