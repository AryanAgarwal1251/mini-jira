import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ProjectDetail.css";

const STATUSES = [
  { key: "Backlog", label: "Backlog", color: "#636e72", emoji: "📥" },
  { key: "Ready", label: "Ready", color: "#74b9ff", emoji: "📌" },
  { key: "In Progress", label: "In Progress", color: "#fdcb6e", emoji: "🔨" },
  { key: "In Review", label: "In Review", color: "#a29bfe", emoji: "👀" },
  { key: "Done", label: "Done", color: "#00b894", emoji: "✅" },
];

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", status: "Backlog" });
  const [creating, setCreating] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const [draggedIssue, setDraggedIssue] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const fetchData = async () => {
    try {
      const [issuesRes, projectsRes] = await Promise.all([
        api.get(`/api/issues/${projectId}`),
        api.get("/api/projects"),
      ]);
      setIssues(issuesRes.data);
      const found = projectsRes.data.find((p) => p._id === projectId);
      setProject(found || { name: "Project", _id: projectId });
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setCreating(true);
    try {
      await api.post("/api/issues", {
        title: form.title,
        description: form.description,
        status: form.status,
        projectId,
      });
      setShowModal(false);
      setForm({ title: "", description: "", status: "Backlog" });
      fetchData();
    } catch (err) {
      console.error("Failed to create issue:", err);
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      // Optimistic update
      setIssues((prev) =>
        prev.map((issue) =>
          issue._id === issueId ? { ...issue, status: newStatus } : issue
        )
      );
      await api.put(`/api/issues/${issueId}`, { status: newStatus });
    } catch (err) {
      console.error("Failed to update status:", err);
      fetchData(); // Revert on failure
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e, issue) => {
    setDraggedIssue(issue);
    e.dataTransfer.effectAllowed = "move";
    // Add a slight delay for visual feedback
    setTimeout(() => {
      e.target.classList.add("dragging");
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove("dragging");
    setDraggedIssue(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e, statusKey) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(statusKey);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e, statusKey) => {
    e.preventDefault();
    setDragOverColumn(null);
    if (draggedIssue && draggedIssue.status !== statusKey) {
      handleStatusChange(draggedIssue._id, statusKey);
    }
    setDraggedIssue(null);
  };

  const openEditModal = (issue) => {
    setEditingIssue(issue);
    setForm({ title: issue.title, description: issue.description || "", status: issue.status });
    setShowModal(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setCreating(true);
    try {
      await api.put(`/api/issues/${editingIssue._id}`, {
        title: form.title,
        description: form.description,
        status: form.status,
      });
      setShowModal(false);
      setEditingIssue(null);
      setForm({ title: "", description: "", status: "Backlog" });
      fetchData();
    } catch (err) {
      console.error("Failed to update issue:", err);
    } finally {
      setCreating(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingIssue(null);
    setForm({ title: "", description: "", status: "Backlog" });
  };

  const getIssuesByStatus = (status) => {
    return issues.filter((issue) => issue.status === status);
  };

  if (loading) {
    return (
      <div className="project-detail-page">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail-page">
      {/* Header */}
      <header className="project-detail-header">
        <div className="project-detail-header-left">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Projects
          </button>
          <h1>{project?.name || "Project"}</h1>
          {project?.description && (
            <p className="project-detail-desc">{project.description}</p>
          )}
        </div>
        <div className="project-detail-actions">
          <div className="issue-count-badge">
            <span>{issues.length}</span> {issues.length === 1 ? "issue" : "issues"}
          </div>
          <button
            className="create-project-btn"
            onClick={() => { setEditingIssue(null); setForm({ title: "", description: "", status: "Backlog" }); setShowModal(true); }}
            id="create-issue-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Issue
          </button>
        </div>
      </header>

      {/* Kanban Board */}
      <div className="kanban-board">
        {STATUSES.map((status) => {
          const columnIssues = getIssuesByStatus(status.key);
          return (
            <div
              key={status.key}
              className={`kanban-column ${dragOverColumn === status.key ? "drag-over" : ""}`}
              onDragOver={(e) => handleDragOver(e, status.key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status.key)}
            >
              <div className="kanban-column-header">
                <div className="column-title-group">
                  <span className="column-emoji">{status.emoji}</span>
                  <span className="column-title">{status.label}</span>
                  <span className="column-count" style={{ background: `${status.color}20`, color: status.color }}>
                    {columnIssues.length}
                  </span>
                </div>
                <div className="column-indicator" style={{ background: status.color }}></div>
              </div>

              <div className="kanban-cards">
                {columnIssues.length === 0 ? (
                  <div className="kanban-empty">
                    <span>No issues</span>
                  </div>
                ) : (
                  columnIssues.map((issue) => (
                    <div
                      key={issue._id}
                      className="kanban-card"
                      draggable
                      onDragStart={(e) => handleDragStart(e, issue)}
                      onDragEnd={handleDragEnd}
                      onClick={() => openEditModal(issue)}
                    >
                      <div className="kanban-card-top">
                        <span className="issue-id">#{issue._id?.slice(-5)?.toUpperCase()}</span>
                      </div>
                      <h4 className="issue-title">{issue.title}</h4>
                      {issue.description && (
                        <p className="issue-desc">{issue.description}</p>
                      )}
                      <div className="kanban-card-footer">
                        <span className="issue-status-dot" style={{ background: status.color }}></span>
                        <span className="issue-status-label" style={{ color: status.color }}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create/Edit Issue Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingIssue ? "Edit Issue" : "Create New Issue"}</h2>
              <button className="modal-close" onClick={closeModal}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={editingIssue ? handleEdit : handleCreate}>
              <div className="form-group">
                <label htmlFor="issue-title">Title</label>
                <input
                  id="issue-title"
                  type="text"
                  placeholder="Issue summary..."
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label htmlFor="issue-desc">Description</label>
                <textarea
                  id="issue-desc"
                  placeholder="Add details about this issue..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="form-group">
                <label htmlFor="issue-status">Status</label>
                <select
                  id="issue-status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {STATUSES.map((s) => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="modal-cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="auth-submit-btn" disabled={creating} style={{ flex: "none", padding: "12px 28px" }}>
                  {creating ? (
                    <span className="auth-spinner"></span>
                  ) : editingIssue ? (
                    "Save Changes"
                  ) : (
                    "Create Issue"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
