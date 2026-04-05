import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [projectIssues, setProjectIssues] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const res = await api.get("/api/projects");
      setProjects(res.data);

      // Fetch issue counts for each project
      const issueMap = {};
      await Promise.all(
        res.data.map(async (project) => {
          try {
            const issuesRes = await api.get(`/api/issues/${project._id}`);
            issueMap[project._id] = issuesRes.data;
          } catch {
            issueMap[project._id] = [];
          }
        })
      );
      setProjectIssues(issueMap);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setCreating(true);
    setError("");
    try {
      await api.post("/api/projects", {
        name: form.name,
        description: form.description,
      });
      setShowModal(false);
      setForm({ name: "", description: "" });
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  const getProjectColor = (index) => {
    const colors = [
      "linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)",
      "linear-gradient(135deg, #e17055 0%, #fdcb6e 100%)",
      "linear-gradient(135deg, #00b894 0%, #55efc4 100%)",
      "linear-gradient(135deg, #0984e3 0%, #74b9ff 100%)",
      "linear-gradient(135deg, #d63031 0%, #ff7675 100%)",
      "linear-gradient(135deg, #e84393 0%, #fd79a8 100%)",
    ];
    return colors[index % colors.length];
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getIssueSummary = (projectId) => {
    const issues = projectIssues[projectId] || [];
    const total = issues.length;
    const done = issues.filter((i) => i.status === "Done").length;
    const inProgress = issues.filter((i) => i.status === "In Progress").length;
    const backlog = issues.filter(
      (i) => i.status === "Backlog" || i.status === "Ready"
    ).length;
    return { total, done, inProgress, backlog };
  };

  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <h1>Projects</h1>
          <p className="dashboard-subtitle">
            Manage and track your team's projects
          </p>
        </div>
        <button
          className="create-project-btn"
          onClick={() => setShowModal(true)}
          id="create-project-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Project
        </button>
      </header>

      {/* Content */}
      {loading ? (
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="dashboard-empty animate-fade-in">
          <div className="empty-icon">📂</div>
          <h3>No projects yet</h3>
          <p>Create your first project to start tracking issues on a Kanban board</p>
          <button
            className="create-project-btn"
            onClick={() => setShowModal(true)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create Project
          </button>
        </div>
      ) : (
        <div className="projects-grid animate-fade-in">
          {projects.map((project, index) => {
            const summary = getIssueSummary(project._id);
            return (
              <div
                key={project._id}
                className="project-card"
                onClick={() => navigate(`/project/${project._id}`)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="project-card-accent" style={{ background: getProjectColor(index) }}></div>
                <div className="project-card-body">
                  <div className="project-card-header">
                    <div className="project-avatar" style={{ background: getProjectColor(index) }}>
                      {project.name?.charAt(0)?.toUpperCase() || "P"}
                    </div>
                    <div className="project-meta">
                      <h3 className="project-name">{project.name}</h3>
                      <span className="project-date">
                        Created {formatDate(project.createdAt)}
                      </span>
                    </div>
                  </div>
                  {project.description && (
                    <p className="project-description">{project.description}</p>
                  )}

                  {/* Issue stats */}
                  <div className="project-stats">
                    <div className="stat-item">
                      <span className="stat-value">{summary.total}</span>
                      <span className="stat-label">Issues</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                      <span className="stat-value stat-progress">{summary.inProgress}</span>
                      <span className="stat-label">In Progress</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                      <span className="stat-value stat-done">{summary.done}</span>
                      <span className="stat-label">Done</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {summary.total > 0 && (
                    <div className="project-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${(summary.done / summary.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">
                        {Math.round((summary.done / summary.total) * 100)}% complete
                      </span>
                    </div>
                  )}

                  <div className="project-card-footer">
                    <span className="project-badge">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                      </svg>
                      View Board
                    </span>
                    <svg className="project-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Project</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="auth-alert auth-alert-error" style={{ margin: "0 0 16px" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label htmlFor="project-name">Project Name</label>
                <input
                  id="project-name"
                  type="text"
                  placeholder="e.g., Mobile App Redesign"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label htmlFor="project-desc">Description</label>
                <textarea
                  id="project-desc"
                  placeholder="Brief description of the project..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="auth-submit-btn" disabled={creating} style={{ flex: "none", padding: "12px 28px" }}>
                  {creating ? <span className="auth-spinner"></span> : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
